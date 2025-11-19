# Deploy to Cloudflare

This guide explains how to deploy your application to Cloudflare Workers.

## Prerequisites

- Node.js installed on your machine
- Wrangler CLI installed (`npm install -g wrangler`)
- Cloudflare account with Workers & D1 enabled
- D1 database already created and configured

## Step-by-step Deployment

### 1. Verify your database setup

Make sure your D1 database is properly configured in `wrangler.jsonc`:

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-app-db",
      "database_id": "YOUR_ACTUAL_DATABASE_ID"  // Make sure this is updated
    }
  ]
}
```

### 2. Login to Cloudflare (if not already logged in)

```bash
wrangler login
```

### 3. Build the application

```bash
npm run build
```

### 4. Deploy to Cloudflare

```bash
npm run deploy
```

This command will:
- Build your React Router application
- Deploy your Hono API to Cloudflare Workers
- Bind your D1 database to the deployed worker

### 5. Access your deployed application

After deployment completes, you'll receive a URL where your application is available, typically in the format:
```
https://your-worker.your-subdomain.workers.dev
```

## Automated Deployment Script

Alternatively, you can use the deploy script:
```bash
npm run deploy
```

## Verification

After deployment, you can verify your application is working by:

1. Visiting the deployed URL in your browser
2. Testing the API endpoints using the instructions in `API_TESTING.md`
3. Checking your database to ensure data is being stored correctly

## Troubleshooting

If you encounter issues during deployment:

1. Verify that your `wrangler.jsonc` file has the correct database ID
2. Ensure you have sufficient permissions in your Cloudflare account
3. Check that your D1 database is properly created and migrated
4. Verify that you're logged in to the correct Cloudflare account

For more detailed logs, you can run:
```bash
wrangler deploy --dry-run  # To see what would be deployed
wrangler deploy --verbose  # To see detailed logs
```