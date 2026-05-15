const required = [
  "VITE_BACKEND_PROVIDER",
  "VITE_APPWRITE_ENDPOINT",
  "VITE_APPWRITE_PROJECT_ID",
  "VITE_APPWRITE_DATABASE_ID",
  "VITE_APPWRITE_STORAGE_BUCKET_ID",
  "VITE_QA_ENVIRONMENT",
  "VITE_CLOUDFLARE_ENVIRONMENT",
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing Cloudflare build environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("Cloudflare build environment variables are present.");
