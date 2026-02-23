"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [config, setConfig] = useState<string>("");
  const [command, setCommand] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"config" | "preview">("preview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const configParam = searchParams.get("config");
    const cmdParam = searchParams.get("cmd");
    const buildParam = searchParams.get("build");

    if (configParam) {
      // Loading from existing config
      try {
        setConfig(decodeURIComponent(configParam));
        setCommand(decodeURIComponent(cmdParam || ""));
      } catch (e) {
        console.error("Failed to decode config:", e);
      }
    } else if (buildParam) {
      // Need to build - trigger the build
      const description = decodeURIComponent(buildParam);
      setCommand(description);
      handleBuild(description);
    }
  }, [searchParams]);

  const handleBuild = async (description: string) => {
    setLoading(true);
    setError("");
    setConfig("");

    try {
      const cliUrl = process.env.NEXT_PUBLIC_CLI_API_URL || "http://localhost:3000";
      const response = await fetch(`${cliUrl}/api/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: description }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(`Server error (${response.status}): ${errorData.error || "Unknown error"}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setConfig(data.output);
      } else {
        setError(data.error || "Build failed");
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyConfig = () => {
    if (config) {
      navigator.clipboard.writeText(config);
      alert("Configuration copied to clipboard!");
    }
  };

  const handleDownloadConfig = () => {
    if (config) {
      const blob = new Blob([config], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${command || "app"}-config.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handlePublish = () => {
    alert("Publish feature coming soon! Use the Download button to save your config.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                🚀 {command || "Your App"}
              </h1>
              <p className="text-sm text-slate-600">AI Generated Configuration</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePublish}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center space-y-6">
              <div className="inline-block">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <div>
                <p className="text-slate-600 text-lg font-medium">Building your app...</p>
                <p className="text-slate-500 text-sm mt-2">Creating {command}</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-slate-900 text-lg font-semibold mb-2">Build Failed</p>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : !config ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-slate-600 text-lg">No configuration loaded</p>
              <button
                onClick={() => router.back()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Editor */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex-1 px-6 py-4 font-medium transition ${
                      activeTab === "preview"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("config")}
                    className={`flex-1 px-6 py-4 font-medium transition ${
                      activeTab === "config"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Configuration
                  </button>
                </div>

                {/* Content */}
                <div className="p-8">
                  {activeTab === "preview" ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-8 border border-blue-200">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                          {command}
                        </h2>
                        <p className="text-slate-600 mb-6">
                          Your application has been generated with AI. The configuration
                          contains all the necessary information to deploy and customize
                          your application.
                        </p>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 text-slate-700">
                            <span className="text-xl">📦</span>
                            <span>
                              Configuration Size: {config.length} characters
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <span className="text-xl">⚡</span>
                            <span>Ready to deploy</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <span className="text-xl">✨</span>
                            <span>AI-Generated with Base44</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-4">Next Steps</h3>
                        <ol className="space-y-3 text-slate-700 text-sm">
                          <li className="flex gap-3">
                            <span className="font-bold text-blue-600 flex-shrink-0">
                              1
                            </span>
                            <span>Download your configuration JSON file</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-bold text-blue-600 flex-shrink-0">
                              2
                            </span>
                            <span>Review and customize the generated config</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-bold text-blue-600 flex-shrink-0">
                              3
                            </span>
                            <span>Deploy to your Base44 instance</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-bold text-blue-600 flex-shrink-0">
                              4
                            </span>
                            <span>Launch your application</span>
                          </li>
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 flex gap-2">
                        <button
                          onClick={handleCopyConfig}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-medium transition text-sm"
                        >
                          📋 Copy
                        </button>
                        <button
                          onClick={handleDownloadConfig}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
                        >
                          ⬇️ Download
                        </button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 rounded-xl p-6 overflow-x-auto text-xs leading-6 max-h-96">
                        <code>{config}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8 space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Actions</h3>
                  <button
                    onClick={handleDownloadConfig}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-orange-500 hover:shadow-lg text-white rounded-lg font-medium transition mb-2"
                  >
                    Download Config
                  </button>
                  <button
                    onClick={handleCopyConfig}
                    className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium transition"
                  >
                    Copy to Clipboard
                  </button>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">Info</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">Type:</span> Generated
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span className="text-green-600">Ready</span>
                    </p>
                    <p>
                      <span className="font-medium">Version:</span> 1.0
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.back()}
                  className="w-full px-4 py-2 text-slate-600 hover:text-slate-900 rounded-lg font-medium transition border border-slate-200 hover:border-slate-300"
                >
                  Back to Build
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <EditorContent />
    </Suspense>
  );
}
