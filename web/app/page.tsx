"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BuildResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleViewProject = () => {
    if (!result?.output) return;
    
    const encodedConfig = encodeURIComponent(result.output);
    const encodedCmd = encodeURIComponent(result.command || "");
    router.push(`/editor?config=${encodedConfig}&cmd=${encodedCmd}`);
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
