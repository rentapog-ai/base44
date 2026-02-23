# 🚀 Deploy Base44 CLI to Render.com

Render.com offers a free tier with great uptime. Here's how to deploy the CLI there.

## Prerequisites

1. GitHub account with the repo: https://github.com/rentapog-ai/base44
2. Render.com account (free): https://render.com/

## Deployment Steps

### 1. Connect Your GitHub Repository

1. Go to https://dashboard.render.com
2. Click "New +" button
3. Select "Web Service"
4. Click "Connect account" → authorize GitHub if needed
5. Select `rentapog-ai/base44` repository
6. Click "Connect"

### 2. Configure the Service

**Basic Settings:**
- **Name:** `base44-cli`
- **Environment:** Node
- **Region:** Select closest to you (e.g., Singapore, US-West)
- **Branch:** `main`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `node ./bin/run.js --help` OR `node server.js` (see options below)

### 3. Environment Variables

Click "Environment" and add:

```
BASE44_API_URL=https://app.base44.com
BASE44_DISABLE_TELEMETRY=1
NODE_ENV=production
```

### 4. Choose Your Deployment Option

**Option A: Run CLI as Web Service (Recommended for Render)**

Create a `server.js` file in your project root:

```javascript
import express from 'express';
import { execSync } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', cli: 'ready' });
});

app.get('/cli/:command', (req, res) => {
  try {
    const cmd = req.params.command;
    const result = execSync(`node ./bin/run.js ${cmd}`, { 
      encoding: 'utf-8',
      timeout: 30000 
    });
    res.json({ output: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Base44 CLI server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Run command: http://localhost:${PORT}/cli/--help`);
});
```

Then set:
- **Start Command:** `node server.js`

**Option B: Simple HTTP Handler**

Use just the CLI with HTTP wrapper:
- **Start Command:** `node ./bin/run.js --help`
- **Build Command:** `npm install && npm run build`

This won't expose a web service, but Render will keep it running as a background process.

### 5. Instance Type

- **Free Plan:** ✅ 0.5 CPU, 512 MB RAM (sufficient for CLI)
- **750 compute hours/month** = runs continuously

### 6. Deploy!

Click "Create Web Service"

Render will:
1. Clone your repo
2. Run build command: `npm install && npm run build`
3. Start your service
4. Assign a public URL

### 7. Verify Deployment

**Check Health:**
```bash
curl https://base44-cli-xxxxx.onrender.com/health
```

**Run CLI Command (if using server.js):**
```bash
curl https://base44-cli-xxxxx.onrender.com/cli/--help
```

**View Logs:**
- Dashboard → Your Service → "Logs" tab

## Auto-Deploy on Push

Render automatically redeploys when you push to `main`. To disable:
- Services → Settings → Auto-Deploy → Off

## Important Notes

⚠️ **This is a CLI tool, not a web app.** 

If you want to:
- **Run CLI commands on schedule:** Use Render Cron Jobs (paid feature)
- **Keep it always running:** Deploy as background service (works on free tier)
- **Expose as HTTP API:** Use the `server.js` wrapper above
- **Just deploy build artifacts:** Consider a simple VPS instead

## Free Tier Limits

- ✅ Always-on service for free
- ✅ 750 compute hours/month
- ✅ 99.9% uptime
- ✅ Auto-deploy from GitHub
- ❌ No custom domains (unless you upgrade)

## Rolling Back

If something breaks:

1. Dashboard → Your Service → "**Deployments**"
2. Find working version
3. Click "**Redeploy**"

## Troubleshooting

**Build fails?**
- Check Logs tab
- Ensure `npm run build` works locally
- Common issue: Missing environment variables

**Service crashes?**
- Check if start command is correct
- Verify Node.js version (20.19.0+ required)
- Check logs for errors

**Want to SSH in?**
- Render doesn't offer SSH for free tier
- Use Premium tier for SSH access

## Next Steps

1. Push code to GitHub (already done ✅)
2. Create Render account
3. Connect repository
4. Add environment variables
5. Deploy! 🚀

**Questions?** Check https://render.com/docs
