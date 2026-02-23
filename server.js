import express from 'express';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Base44 CLI',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// CLI help endpoint
app.get('/api/help', (req, res) => {
  try {
    const result = execSync('node ./bin/run.js --help', {
      encoding: 'utf-8',
      timeout: 10000,
      cwd: __dirname
    });
    res.json({ 
      success: true,
      output: result 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Generic CLI command executor
app.post('/api/execute', express.json(), (req, res) => {
  try {
    const { command } = req.body;
    
    // Security: validate command
    if (!command || typeof command !== 'string') {
      return res.status(400).json({ 
        error: 'Command must be a non-empty string' 
      });
    }
    
    // Prevent dangerous commands
    if (command.includes(';') || command.includes('&&') || command.includes('|')) {
      return res.status(400).json({ 
        error: 'Command chaining not allowed' 
      });
    }

    const result = execSync(`node ./bin/run.js ${command}`, {
      encoding: 'utf-8',
      timeout: 30000,
      cwd: __dirname
    });

    res.json({ 
      success: true,
      command,
      output: result 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      stderr: error.stderr?.toString()
    });
  }
});

// Serve a simple UI
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Base44 CLI Service</title>
      <style>
        body { font-family: Arial; margin: 40px; }
        h1 { color: #333; }
        .endpoint { background: #f0f0f0; padding: 10px; margin: 10px 0; border-left: 4px solid #007bff; }
        code { background: #fff; padding: 2px 5px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <h1>🚀 Base44 CLI Service</h1>
      <p>Service is running and ready to handle CLI commands.</p>
      
      <h2>Available Endpoints</h2>
      
      <div class="endpoint">
        <strong>GET /health</strong><br>
        Health check endpoint. Returns service status and uptime.
      </div>
      
      <div class="endpoint">
        <strong>GET /api/help</strong><br>
        Returns CLI help menu (equivalent to <code>base44 --help</code>)
      </div>
      
      <div class="endpoint">
        <strong>POST /api/execute</strong><br>
        Execute a CLI command<br>
        Request body: <code>{ "command": "create --help" }</code><br>
        Response: <code>{ "success": true, "output": "..." }</code>
      </div>
      
      <h2>Examples</h2>
      
      <p><strong>Check health:</strong></p>
      <code>curl https://base44-cli-xxxx.onrender.com/health</code>
      
      <p><strong>Get help:</strong></p>
      <code>curl https://base44-cli-xxxx.onrender.com/api/help</code>
      
      <p><strong>Run a command:</strong></p>
      <code>curl -X POST https://base44-cli-xxxx.onrender.com/api/execute \\<br>
      &nbsp;&nbsp;-H "Content-Type: application/json" \\<br>
      &nbsp;&nbsp;-d '{"command": "create --help"}'</code>
      
      <h2>Documentation</h2>
      <p>See <a href="https://github.com/rentapog-ai/base44">GitHub repository</a> for full documentation.</p>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Base44 CLI Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Help endpoint: http://localhost:${PORT}/api/help`);
  console.log(`📍 Web UI: http://localhost:${PORT}`);
});
