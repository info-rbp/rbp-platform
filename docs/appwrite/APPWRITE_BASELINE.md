# Appwrite Baseline

## Required Variables

- APPWRITE_ENDPOINT
- APPWRITE_PROJECT_ID
- APPWRITE_API_KEY
- APPWRITE_DATABASE_ID
- APPWRITE_STORAGE_BUCKET_ID

## Baseline Checks

- auth availability
- database availability
- storage bucket strategy
- functions runtime support
- teams availability
- messaging/email status where accessible
- existing collections and functions where available

## Validation Commands

- `npm run appwrite:inspect`
- `npm run appwrite:connection:validate`
