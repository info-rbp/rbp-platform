import { createAdminServices, requireEnv } from "./_lib";

type CheckStatus = "ok" | "missing" | "error" | "unavailable";

type SectionReport = {
  status: CheckStatus;
  message: string;
};

function classifyLookupError(error: unknown, label: string): SectionReport {
  const message = error instanceof Error ? error.message : String(error);
  if (/404|not found/i.test(message)) {
    return {
      status: "missing",
      message: `${label} was not found. Check the configured id and that the resource exists in Appwrite.`,
    };
  }

  return {
    status: "error",
    message: `${label} lookup failed: ${message}`,
  };
}

try {
  requireEnv([
    "APPWRITE_ENDPOINT",
    "APPWRITE_PROJECT_ID",
    "APPWRITE_API_KEY",
    "APPWRITE_DATABASE_ID",
    "APPWRITE_STORAGE_BUCKET_ID",
  ]);

  const { databases, functions, storage, databaseId, storageBucketId } = createAdminServices();

  const report: Record<string, unknown> = {
    endpoint: process.env.APPWRITE_ENDPOINT,
    projectId: process.env.APPWRITE_PROJECT_ID,
    database: {
      id: databaseId,
      status: "unavailable" satisfies CheckStatus,
      message: "Database lookup not started.",
    },
    storageBucket: {
      id: storageBucketId,
      status: "unavailable" satisfies CheckStatus,
      message: "Storage lookup not started.",
    },
    functions: {
      status: "unavailable" satisfies CheckStatus,
      message: "Functions lookup not started.",
      total: 0,
    },
  };

  try {
    await databases.get(databaseId);
    report.database = {
      id: databaseId,
      status: "ok" satisfies CheckStatus,
      message: `Database ${databaseId} is reachable.`,
    };
  } catch (error) {
    report.database = {
      id: databaseId,
      ...classifyLookupError(error, `Database ${databaseId}`),
    };
  }

  try {
    await storage.getBucket(storageBucketId);
    report.storageBucket = {
      id: storageBucketId,
      status: "ok" satisfies CheckStatus,
      message: `Storage bucket ${storageBucketId} is reachable.`,
    };
  } catch (error) {
    report.storageBucket = {
      id: storageBucketId,
      ...classifyLookupError(error, `Storage bucket ${storageBucketId}`),
    };
  }

  try {
    const liveFunctions = await functions.list();
    report.functions = {
      status: "ok" satisfies CheckStatus,
      message: `Functions are listable.`,
      total: liveFunctions.total,
    };
  } catch (error) {
    report.functions = {
      status: "error" satisfies CheckStatus,
      message: `Functions lookup failed: ${error instanceof Error ? error.message : String(error)}`,
      total: 0,
    };
  }

  console.log(JSON.stringify(report, null, 2));

  const failed = [report.database, report.storageBucket, report.functions]
    .map((entry) => entry as SectionReport)
    .some((entry) => entry.status === "missing" || entry.status === "error");

  if (failed) {
    process.exit(1);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
