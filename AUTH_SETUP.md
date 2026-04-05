# Authentication Setup Guide

This app uses environment variables to securely store login credentials.

## Local Development

1. Create a `logins.json` file in the root directory (this file is gitignored):
```json
{
  "izzard": "wontsharefood",
  "jenny": "bestdoctor",
  "adi": "lovesanmol",
  "jt": "mentorman"
}
```

2. Run `pnpm dev` - the app will automatically read from `logins.json`

## Vercel Deployment (Production)

### Step 1: Prepare your credentials

Format your credentials as a single-line JSON string:
```
{"izzard":"wontsharefood","jenny":"bestdoctor","adi":"lovesanmol","jt":"mentorman"}
```

**Important**: Remove all whitespace and newlines - it must be a single line!

### Step 2: Add Environment Variable in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Key**: `AUTH_CREDENTIALS`
   - **Value**: Your single-line JSON from Step 1
   - **Environment**: Check all (Production, Preview, Development)
5. Click **Save**

### Step 3: (Optional) Add Session Secret

For additional security, add a custom session secret:

1. Generate a random secret (you can use: `openssl rand -base64 32`)
2. In Vercel Environment Variables, add:
   - **Key**: `SESSION_SECRET`
   - **Value**: Your random secret
   - **Environment**: Check all

### Step 4: Redeploy

After adding environment variables:
- Go to **Deployments** tab
- Click the three dots on the latest deployment
- Click **Redeploy**

That's it! Your app is now secured with credentials stored safely in Vercel environment variables.

## Updating Users

To add/remove users:

1. Update the `AUTH_CREDENTIALS` environment variable in Vercel
2. Redeploy your application

## Security Notes

- `logins.json` is gitignored and will never be committed to your repository
- Credentials are encrypted in Vercel's environment variable storage
- Sessions are stateless and signed with HMAC-SHA256
- Session cookies are httpOnly and cleared when browser closes
