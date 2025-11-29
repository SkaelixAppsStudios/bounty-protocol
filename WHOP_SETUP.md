# Whop Dashboard Configuration Guide

## Step 1: Configure App Hosting Settings

Go to your Whop Developer Dashboard: https://whop.com/dashboard/developer

Find your app (ID: `app_UT9gYVlk4Hmsgu`) and go to the **Hosting** section.

### Set these paths:

1. **Base URL**: `https://bounty-protocol.vercel.app`
2. **App Path**: `/experiences/[experienceId]`
3. **Dashboard Path**: `/dashboard/[companyId]`
4. **Discover Path**: `/discover`

## Step 2: Enable Development Mode (For Local Testing)

In the Whop app settings:

1. Find the **Development Mode** toggle
2. Enable it
3. Set **Localhost Mode** URL to: `http://localhost:3000`

This allows you to test locally while the production app runs on Vercel.

## Step 3: Install Your App to a Company

1. Go to a Whop company you own
2. Navigate to the **Tools** section
3. Add your app to test it

---

**Complete these steps, then I'll help you set up local development with the Whop proxy.**
