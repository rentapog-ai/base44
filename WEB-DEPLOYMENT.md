# Deploy Base44 Web UI to Render

Complete guide to deploy the Next.js web interface alongside your CLI service.

## Prerequisites

✅ **Already have:**
- GitHub repo: https://github.com/rentapog-ai/base44
- CLI service running on Render: `https://base44-cli-xxxx.onrender.com`
- Personal Access Token for GitHub auth

## Step-by-Step Deployment

### 1. Create New Web Service on Render

1. Go to https://dashboard.render.com
2. Click "**+ New**" button
3. Select "**Web Service**"
4. Select your GitHub repository: `rentapog-ai/base44`
5. Click "**Connect**"

### 2. Configure the Web Service

Fill in these settings:

**Basic Information:**
- **Name:** `base44-web`
- **Region:** Select closest to you (Singapore, US-West, etc.)
- **Branch:** `main`
- **Root Directory:** `web` ← Important!

**Build Settings:**
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment:** `Node`

### 3. Add Environment Variables

Click "**Environment**" and add:

```
NEXT_PUBLIC_CLI_API_URL=https://base44-cli-xxxx.onrender.com
NODE_ENV=production
```

⚠️ Replace `base44-cli-xxxx` with your **actual CLI service URL**

### 4. Deploy!

Click "**Create Web Service**"

Render will:
1. Clone your repo
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Start the web server
5. Assign a public URL like: `https://base44-web-xxxx.onrender.com`

### 5. Verify Deployment

Wait 2-3 minutes for build to complete, then:

1. **Visit your URL:** `https://base44-web-xxxx.onrender.com`
2. **Should see:** Beautiful modern UI with hero section
3. **Test it:** Type in a description, hit "Build"
4. **Check Logs:** Dashboard → Your Service → "Logs" tab if issues

## Architecture

```
┌─────────────────────────────────────────────┐
│       base44-web.onrender.com                │
│    (Next.js UI - Your new service)          │
│                                              │
│  - Hero section with input                  │
│  - Template showcase                        │
│  - Results display                          │
└────────────────┬────────────────────────────┘
                 │ HTTP requests
                 ↓
┌─────────────────────────────────────────────┐
│      base44-cli-xxxx.onrender.com            │
│    (Node.js CLI API - Existing)             │
│                                              │
│  - /health (status check)                   │
│  - /api/help (CLI help)                     │
│  - /api/execute (run commands)              │
└─────────────────────────────────────────────┘
```

## Troubleshooting

### Build Fails

**Error:** `Cannot find module...`

**Solution:**
- Check npm install succeeded
- Verify build command: `npm run build`
- Check Node version (20+)

**Check logs:**
1. Dashboard → Service → "Logs"
2. Look for build errors
3. Common issues: Missing env vars, wrong root directory

### Service won't start

**Error:** `Port already in use` or `Cannot find...`

**Solution:**
- Verify start command: `npm start`
- Check environment variables are set
- Verify `NEXT_PUBLIC_CLI_API_URL` is correct

### Web UI loads but can't reach CLI

**Error:** When you click "Build", nothing happens

**Solution:**
1. Check your CLI service URL in env vars
2. Test CLI health: `curl https://base44-cli-xxxx.onrender.com/health`
3. Verify `NEXT_PUBLIC_CLI_API_URL` in web dashboard → Environment
4. Check browser console (F12) for network errors

### Stuck on "Building..."

The build might take 3-5 minutes. Check "Logs" tab:
- If stuck > 10 min, click "Cancel Deploy" and rebuild
- Check disk space isn't full

## Auto-Deploy

Whenever you push to `main`, Render automatically redeploys.

**To disable auto-deploy (not recommended):**
1. Dashboard → Your Service → Settings
2. Scroll down → Auto-Deploy
3. Toggle "off"

## Updating the Web App

Make changes locally, commit, and push:

```bash
cd web
# Make changes...
git add .
git commit -m "Update UI features"
git push origin main
```

Render will automatically rebuild and deploy!

## Advanced: Custom Domain

To use your own domain (e.g., `base44.io`):

1. Render Dashboard → Your Web Service → Settings
2. Scroll to "Custom Domain"
3. Enter your domain
4. Update DNS records (instructions provided)
5. Wait up to 48h for DNS propagation

Requires Render paid plan.

## Performance Tips

- ✅ Service will auto-sleep after 15 minutes of inactivity (free tier)
- ✅ First request may take ~30 sec to wake up
- ✅ Upgrade to paid plan for always-on service
- ✅ Render provides generous free tier: 750 compute hours/month

## What to Share

Once deployed, share your URL:

**Social:** "Check out my AI-powered app builder: https://base44-web-xxxx.onrender.com"

**Demo:** 
1. Visit your URL (takes ~30 sec to wake up first time)
2. Type an app description
3. Click "Build"
4. Watch the magic happen!

## SSL/HTTPS

✅ Automatic! Render provides free SSL certificates for all services.

Your site is secure by default at: `https://base44-web-xxxx.onrender.com`

## Getting Help

**Render Docs:** https://render.com/docs  
**Base44 Repo:** https://github.com/rentapog-ai/base44  
**Status Page:** https://renderstatus.com

---

🎉 **Congrats!** You now have:
- ✅ CLI backend on Render
- ✅ Web UI on Render
- ✅ Both connecting together
- ✅ Auto-deploy on every Git push

**You're live!**
