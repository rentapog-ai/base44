# Base44 CLI - Deployment Guide

## Production Deployment with Node.js

This guide explains how to deploy the built Base44 CLI on a production server.

### Prerequisites
- Node.js 20.19.0 or higher
- npm or yarn (optional, but recommended)

### Files Needed for Deployment

After building, you only need these files/folders on your server:

```
dist/
├── cli/
│   └── index.js          # Main CLI bundle
└── templates/            # Templates directory
    └── (all template files)

bin/
└── run.js               # CLI entry point

package.json            # For dependency info (optional)
```

### Deployment Steps

#### 1. Build Locally (Already Done!)
```bash
npm run build
```
This creates the `dist/` folder with everything bundled.

#### 2. Upload to Server
```bash
# Copy the necessary files to your server
scp -r dist/ bin/ package.json user@server:/path/to/base44-cli/
```

#### 3. Install Dependencies on Server
```bash
cd /path/to/base44-cli

# Install production dependencies (if needed)
npm install --production

# Or just Node.js (esbuild bundles everything)
node --version  # Verify Node.js is installed
```

#### 4. Run the CLI on Server
```bash
# Run the CLI
node ./bin/run.js

# Or with specific commands
node ./bin/run.js --help
node ./bin/run.js auth login
node ./bin/run.js project create
```

#### 5. (Optional) Create a Systemd Service for Auto-Run
Create `/etc/systemd/system/base44-cli.service`:
```ini
[Unit]
Description=Base44 CLI Service
After=network.target

[Service]
Type=simple
User=base44
WorkingDirectory=/path/to/base44-cli
ExecStart=/usr/bin/node /path/to/base44-cli/bin/run.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then enable it:
```bash
sudo systemctl daemon-reload
sudo systemctl enable base44-cli
sudo systemctl start base44-cli
sudo systemctl status base44-cli
```

### Environment Variables

You can configure the CLI with these env vars:

```bash
# Base44 API endpoint (optional)
export BASE44_API_URL="https://app.base44.com"

# Disable telemetry (optional)
export BASE44_DISABLE_TELEMETRY=1

# Run the CLI
node ./bin/run.js
```

### Verify Deployment

```bash
# Test the CLI works
node ./bin/run.js --help

# Check version
node ./bin/run.js --version

# Run a test
node ./bin/run.js auth whoami
```

### Troubleshooting

**"Cannot find module" error:**
- Make sure `dist/` folder exists and contains `cli/index.js`
- Verify `bin/run.js` points to the correct path

**Node.js version error:**
- Check Node.js version: `node --version` (needs 20.19.0+)
- Update Node.js if needed

**Permission denied:**
- Run with proper permissions: `sudo node ./bin/run.js`
- Or make the script executable: `chmod +x bin/run.js`

### Production Checklist
- ✅ Node.js 20.19.0+ installed
- ✅ `dist/` folder uploaded
- ✅ `bin/run.js` uploaded
- ✅ Run `node ./bin/run.js --help` to verify
- ✅ Configure environment variables if needed
- ✅ Set up auto-restart (systemd, pm2, etc.)

### Docker Alternative
See `Dockerfile` for containerized deployment.
