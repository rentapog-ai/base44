import express from 'express';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAppCode } from './server-utils/groqService.js';

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

// App generation endpoint powered by Groq AI
app.post('/api/execute', express.json(), async (req, res) => {
  try {
    const { command } = req.body;
    
    // Validate input - now treating 'command' as a description
    if (!command || typeof command !== 'string') {
      return res.status(400).json({ 
        error: 'Description must be a non-empty string',
        success: false
      });
    }

    // Check Groq API key
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Server is not configured with Groq API key. Please contact administrator.'
      });
    }

    // Generate app code using Groq
    const generatedCode = await generateAppCode(command);

    res.json({ 
      success: true,
      command,
      output: generatedCode,
      generatedWith: 'Groq AI (mixtral-8x7b-32768)'
    });
  } catch (error) {
    console.error('Error in /api/execute:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to generate application code'
    });
  }
});

// Serve a simple UI
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Base44 App Generator</title>
      <style>
        body { font-family: Arial; margin: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #333; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        h1 { color: #667eea; margin-top: 0; }
        .status { background: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; border-radius: 4px; margin-bottom: 20px; }
        .status.running { color: #2e7d32; font-weight: bold; }
        .endpoint { background: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; border-radius: 4px; }
        .endpoint strong { color: #667eea; }
        code { background: #fff; padding: 3px 6px; border-radius: 3px; font-family: 'Courier New'; }
        .example { background: #f9f9f9; padding: 12px; margin-top: 10px; border-radius: 4px; }
        .feature-list { list-style: none; padding: 0; }
        .feature-list li { padding: 8px 0; padding-left: 20px; position: relative; }
        .feature-list li:before { content: "✓"; position: absolute; left: 0; color: #4caf50; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Base44 App Generator (Powered by Groq AI)</h1>
        
        <div class="status running">
          ✓ Service is running and ready to generate applications with AI
        </div>
        
        <p>This service uses <strong>Groq's mixtral-8x7b-32768</strong> model to generate complete Base44 applications from natural language descriptions.</p>
        
        <h2>Features</h2>
        <ul class="feature-list">
          <li>AI-powered app generation from descriptions</li>
          <li>Fast response times (Groq - sub-500ms)</li>
          <li>Health monitoring and status checks</li>
          <li>RESTful API endpoints</li>
        </ul>
        
        <h2>Available Endpoints</h2>
        
        <div class="endpoint">
          <strong>GET /health</strong><br>
          Health check endpoint. Returns service status and uptime.
          <div class="example">
            <code>curl https://base44-1.onrender.com/health</code>
          </div>
        </div>
        
        <div class="endpoint">
          <strong>GET /api/help</strong><br>
          Returns CLI help menu
          <div class="example">
            <code>curl https://base44-1.onrender.com/api/help</code>
          </div>
        </div>
        
        <div class="endpoint">
          <strong>POST /api/execute</strong><br>
          Generate a Base44 application from a natural language description.<br>
          Request body: <code>{ "command": "todo app with user authentication" }</code><br>
          Response: <code>{ "success": true, "output": "... generated app config ..." }</code>
          <div class="example">
            <strong>Try it:</strong><br>
            <code>curl -X POST https://base44-1.onrender.com/api/execute \\<br>
            &nbsp;&nbsp;-H "Content-Type: application/json" \\<br>
            &nbsp;&nbsp;-d '{"command": "todo app with user authentication"}'</code>
          </div>
        </div>
        
        <h2>How It Works</h2>
        <ol>
          <li>Send a natural language description to <code>/api/execute</code></li>
          <li>Groq AI generates a complete Base44 app specification</li>
          <li>Receive structured app configuration ready for deployment</li>
        </ol>
        
        <h2>Documentation</h2>
        <p>See <a href="https://github.com/rentapog-ai/base44" target="_blank">GitHub repository</a> for full documentation.</p>
        
        <hr style="margin-top: 40px; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">AI Model: Groq mixtral-8x7b-32768 | Status: ✓ Active | Last Updated: 2025</p>
      </div>
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
