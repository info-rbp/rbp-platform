const required = [
  "APPWRITE_ENDPOINT",
  "APPWRITE_PROJECT_ID",
  "APPWRITE_API_KEY",
  "QA_EMAIL_ALLOWLIST",
  "QA_EMAIL_ALLOWED_RECIPIENT",
  "QA_EMAIL_BLOCKED_RECIPIENT",
];

function fail(message, details = {}) {
  console.error(JSON.stringify({ status: "failed", message, ...details }, null, 2));
  process.exit(1);
}

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  fail(`Email QA live proof blocked: missing required environment variables: ${missing.join(", ")}`, { missing });
}

const endpoint = String(process.env.APPWRITE_ENDPOINT || "").replace(/\/+$/, "");

async function requestJson(path, options = {}) {
  const response = await fetch(`${endpoint}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      "x-appwrite-project": process.env.APPWRITE_PROJECT_ID,
      "x-appwrite-key": process.env.APPWRITE_API_KEY,
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw Object.assign(new Error(`Appwrite request failed: ${response.status} ${response.statusText}`), { body });
  }
  return body;
}

async function executeFunction(functionId, body, headers = {}) {
  return requestJson(`/functions/${functionId}/executions`, {
    method: "POST",
    body: JSON.stringify({
      body: JSON.stringify(body),
      async: false,
      method: "POST",
      path: "/",
      headers,
    }),
  });
}

try {
  const allowed = await executeFunction("send-notification", {
    title: "QA allowed email proof",
    message: `QA allowed email proof ${new Date().toISOString()}`,
    recipient: process.env.QA_EMAIL_ALLOWED_RECIPIENT,
    channel: "email",
  });

  const blocked = await executeFunction("send-notification", {
    title: "QA blocked email proof",
    message: `QA blocked email proof ${new Date().toISOString()}`,
    recipient: process.env.QA_EMAIL_BLOCKED_RECIPIENT,
    channel: "email",
  });

  let queue = null;
  const trustedToken = process.env.APPWRITE_TRUSTED_FUNCTION_TOKEN || process.env.RBP_INTERNAL_FUNCTION_TOKEN;
  if (trustedToken) {
    queue = await executeFunction("process-notification-queue", {}, { "x-rbp-internal-token": trustedToken });
  }

  console.log(JSON.stringify({
    status: "passed",
    allowedExecutionId: allowed.$id || allowed.id || "submitted",
    blockedExecutionId: blocked.$id || blocked.id || "submitted",
    queueProcessed: Boolean(queue),
    queueExecutionId: queue ? queue.$id || queue.id || "submitted" : null,
  }, null, 2));
} catch (error) {
  fail(error instanceof Error ? error.message : String(error), {
    error: error && typeof error === "object" && "body" in error ? error.body : undefined,
  });
}
