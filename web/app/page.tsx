"use client";

import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Templates from "./components/Templates";
import Footer from "./components/Footer";

interface BuildResult {
  success: boolean;
  output?: string;
  error?: string;
  command?: string;
  generatedWith?: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BuildResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleViewProject = () => {
    if (!result?.output) return;
    
    // Escape HTML function
    const escapeHtml = (text: string): string => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    };
    
    // Create a new window with the project view
    const projectWindow = window.open("", "_blank");
    if (projectWindow) {
      // Parse the config
      const config = result.output;
      const escapedConfig = escapeHtml(config);
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${escapeHtml(result.command || 'App')} - Base44 Project</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              color: #333;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: white;
              border-radius: 12px;
              padding: 24px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .header h1 {
              font-size: 28px;
              color: #333;
            }
            .header .subtitle {
              color: #666;
              margin-top: 8px;
              font-size: 14px;
            }
            .actions {
              display: flex;
              gap: 12px;
            }
            .btn {
              padding: 10px 20px;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.3s;
            }
            .btn-primary {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .btn-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
            }
            .btn-secondary {
              background: white;
              color: #667eea;
              border: 2px solid #667eea;
            }
            .btn-secondary:hover {
              background: #f8f9ff;
            }
            .editor {
              background: white;
              border-radius: 12px;
              padding: 24px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .tabs {
              display: flex;
              gap: 8px;
              border-bottom: 2px solid #f0f0f0;
              margin-bottom: 20px;
            }
            .tab {
              padding: 12px 16px;
              background: none;
              border: none;
              cursor: pointer;
              font-weight: 600;
              color: #999;
              border-bottom: 3px solid transparent;
              transition: all 0.3s;
            }
            .tab.active {
              color: #667eea;
              border-bottom-color: #667eea;
            }
            .content {
              display: none;
            }
            .content.active {
              display: block;
            }
            .preview {
              background: #f8f9ff;
              border-radius: 8px;
              padding: 16px;
              margin-top: 12px;
              font-size: 14px;
              line-height: 1.6;
              border-left: 4px solid #667eea;
            }
            pre {
              background: #2d3748;
              color: #e2e8f0;
              padding: 16px;
              border-radius: 8px;
              overflow-x: auto;
              font-size: 13px;
              line-height: 1.5;
            }
            code {
              font-family: 'Courier New', monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div>
                <h1>🚀 ${escapeHtml(result.command || 'Your App')}</h1>
                <p class="subtitle">AI-generated Base44 Application</p>
              </div>
              <div class="actions">
                <button class="btn btn-secondary" onclick="window.close()">Close</button>
              </div>
            </div>
            
            <div class="editor">
              <div class="tabs">
                <button class="tab active" onclick="switchTab('json')">Configuration</button>
                <button class="tab" onclick="switchTab('preview')">Preview</button>
              </div>
              
              <div id="json" class="content active">
                <pre><code>${escapedConfig}</code></pre>
              </div>
              
              <div id="preview" class="content">
                <div class="preview">
                  <h3>Project Structure</h3>
                  <p><strong>Name:</strong> ${escapeHtml(result.command || 'Untitled')}</p>
                  <p><strong>Generated with:</strong> ${escapeHtml(result.generatedWith || 'Base44 AI')}</p>
                  <p><strong>Configuration Size:</strong> ${config.length} characters</p>
                  <hr style="margin: 12px 0; border: none; border-top: 1px solid #ddd;">
                  <p style="margin-top: 12px;">Your application configuration has been generated successfully. You can now:</p>
                  <ul style="margin-left: 20px; margin-top: 8px;">
                    <li>Copy the JSON configuration</li>
                    <li>Deploy to your Base44 instance</li>
                    <li>Modify and customize as needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <script>
            function switchTab(tabName) {
              const contents = document.querySelectorAll('.content');
              const tabs = document.querySelectorAll('.tab');
              
              contents.forEach(c => c.classList.remove('active'));
              tabs.forEach(t => t.classList.remove('active'));
              
              document.getElementById(tabName).classList.add('active');
              event.target.classList.add('active');
            }
          </script>
        </body>
        </html>
      `;
      projectWindow.document.write(html);
      projectWindow.document.close();
    }
  };

  const handleBuildApp = async (description: string) => {
    setLoading(true);
    setShowResult(false);
    setResult(null);

    try {
      const cliUrl = process.env.NEXT_PUBLIC_CLI_API_URL || "http://localhost:3001";
      const response = await fetch(`${cliUrl}/api/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: description }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setResult({
          success: false,
          error: `Server error (${response.status}): ${errorData.error || "Unknown error"}`,
        });
        setShowResult(true);
        return;
      }

      const data: BuildResult = await response.json();
      setResult(data);
      setShowResult(true);
    } catch (error) {
      setResult({
        success: false,
        error: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero onBuild={handleBuildApp} loading={loading} />
      <Templates />

      {/* Results Section */}
      {showResult && result && (
        <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div
              className={`rounded-2xl border-2 overflow-hidden ${
                result.success
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              {/* Header */}
              <div
                className={`px-8 py-6 ${
                  result.success ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`text-2xl ${
                      result.success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.success ? "✓" : "✕"}
                  </div>
                  <h3
                    className={`text-xl font-bold ${
                      result.success ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {result.success ? "Project Created Successfully!" : "Build Failed"}
                  </h3>
                </div>
              </div>

              {/* Output */}
              <div className="px-8 py-6">
                {result.command && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                      Command
                    </p>
                    <code className="text-sm font-mono bg-gray-900 text-green-400 p-4 rounded-lg block overflow-x-auto">
                      {result.command}
                    </code>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                    Output
                  </p>
                  <pre className="text-sm font-mono bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto max-h-96 leading-relaxed whitespace-pre-wrap break-words">
                    {result.output || result.error}
                  </pre>
                </div>
              </div>

              {/* Actions */}
              <div className="px-8 py-6 bg-gray-100 flex gap-4">
                <button
                  onClick={() => setShowResult(false)}
                  className="btn-primary text-sm"
                >
                  Build Another
                </button>
                <button
                  onClick={handleViewProject}
                  className="btn-secondary text-sm"
                  disabled={!result?.success}
                  title={!result?.success ? "Only available for successful builds" : "Download project configuration"}
                >
                  View Project
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
