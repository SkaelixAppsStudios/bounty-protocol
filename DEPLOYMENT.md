# Vercel Deployment Instructions

## Step 1: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/new)
2. Import your GitHub repository: `https://github.com/SkaelixAppsStudios/bounty-protocol`
3. Configure the following settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `my-whop-app`
   - **Build Command**: `pnpm build` (default)
   - **Output Directory**: `.next` (default)

## Step 2: Add Environment Variables

In the Vercel project settings, add these environment variables:

```
WHOP_API_KEY=apik_9fqqLuNxixXw7_A2019446_C_5e314cad3308b450606e183a432e1151c3b48af0e697e8bfe20b297eb17786
NEXT_PUBLIC_WHOP_APP_ID=app_UT9gYVlk4Hmsgu
WHOP_WEBHOOK_SECRET=(leave empty for now, will add after webhook setup)
```

## Step 3: Deploy

Click "Deploy" and wait for the build to complete.

## Step 4: Get Your Deployment URL

After deployment, copy your production URL (e.g., `https://your-app.vercel.app`)

## Step 5: Configure Whop Dashboard

Go to [Whop Developer Dashboard](https://whop.com/dashboard/developer) and update:

1. **Base URL**: Set to your Vercel deployment URL
2. **App Path**: `/experiences/[experienceId]`
3. **Dashboard Path**: `/dashboard/[companyId]`
4. **Discover Path**: `/discover`

## Step 6: Set Up Webhooks (After Deployment)

1. In Whop Dashboard, create a webhook pointing to: `https://your-app.vercel.app/api/webhooks`
2. Copy the webhook secret
3. Add it to Vercel environment variables as `WHOP_WEBHOOK_SECRET`
4. Redeploy the app

---

**After completing these steps, reply with your Vercel deployment URL.**
