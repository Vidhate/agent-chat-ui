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

### Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add one variable for each user:

**For each user, add a separate variable:**

| Variable Name | Value |
|--------------|-------|
| `LOGIN_USER1` | `{"username":"izzard","password":"wontsharefood"}` |
| `LOGIN_USER2` | `{"username":"jenny","password":"bestdoctor"}` |
| `LOGIN_USER3` | `{"username":"adi","password":"lovesanmol"}` |
| `LOGIN_USER4` | `{"username":"jt","password":"mentorman"}` |

**For each variable:**
- **Environment**: Check all (Production, Preview, Development)
- Click **Save**

**Format**: Each value must be valid JSON with `username` and `password` fields:
```json
{"username":"yourname","password":"yourpassword"}
```

### (Optional) Add Session Secret

For additional security, add a custom session secret:

1. Generate a random secret (you can use: `openssl rand -base64 32`)
2. In Vercel Environment Variables, add:
   - **Key**: `SESSION_SECRET`
   - **Value**: Your random secret
   - **Environment**: Check all

### Redeploy

After adding environment variables:
- Go to **Deployments** tab
- Click the three dots on the latest deployment
- Click **Redeploy**

That's it! Your app is now secured with credentials stored safely in Vercel environment variables.

## Adding/Removing Users

### To add a new user:
1. Add a new environment variable: `LOGIN_USER5`, `LOGIN_USER6`, etc.
2. Value: `{"username":"newuser","password":"newpass"}`
3. Redeploy

### To remove a user:
1. Delete their `LOGIN_USER*` environment variable
2. Redeploy

### To change a password:
1. Update the corresponding `LOGIN_USER*` environment variable
2. Redeploy

**Note**: The number suffix (1, 2, 3...) doesn't matter - the app reads all variables starting with `LOGIN_USER`

## Security Notes

- `logins.json` is gitignored and will never be committed to your repository
- Each credential is stored as a separate encrypted environment variable in Vercel
- Sessions are stateless and signed with HMAC-SHA256
- Session cookies are httpOnly and cleared when browser closes
- Easy to manage individual users without editing long JSON strings
