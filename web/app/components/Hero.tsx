"use client";

import { useState, useRef, useEffect } from "react";

interface HeroProps {
  onBuild: (description: string) => Promise<void>;
  loading: boolean;
}

export default function Hero({ onBuild, loading }: HeroProps) {
  const [input, setInput] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await onBuild(input);
    }
  };

  const templates = [
    { icon: "📊", label: "Dashboard" },
    { icon: "🎮", label: "Gaming" },
    { icon: "👥", label: "Portal" },
  ];

  return (
    <section
      ref={sectionRef}
      className="gradient-blue-to-cyan min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-accent opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 opacity-5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className={`max-w-4xl w-full relative z-10 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl font-bold text-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
          Build Apps in Seconds
        </h1>

        <p className="text-xl md:text-2xl text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Just describe what you need. Our AI turns your ideas into fully-functional applications instantly.
        </p>

        {/* Input form with enhanced styling */}
        <div className="bg-white rounded-2xl shadow-2xl p-2 mb-12 backdrop-blur-xl border border-gray-200/50">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g., Build a task management app with team collaboration features"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-6 py-4 outline-none text-base sm:text-lg placeholder:text-gray-400 rounded-xl disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-accent text-white rounded-full flex items-center justify-center hover:shadow-lg hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 font-bold"
            >
              {loading ? (
                <span className="animate-spin text-2xl">⟳</span>
              ) : (
                <span className="text-2xl">→</span>
              )}
            </button>
          </form>
        </div>

        {/* Quick start templates */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-600 mb-6 font-medium tracking-wide uppercase">
            Popular Examples
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {templates.map((template) => (
              <button
                key={template.label}
                onClick={() => setInput(`Build me a ${template.label} app`)}
                className="card-hover bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl py-4 px-4 text-center hover:border-gray-300 transition duration-300"
              >
                <div className="text-3xl mb-2">{template.icon}</div>
                <div className="font-semibold text-gray-800">{template.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-gray-200/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">10K+</div>
            <div className="text-sm text-gray-600">Apps Built</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
