"use client";

import { useEffect, useRef, useState } from "react";

export default function Templates() {
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

  const templates = [
    {
      name: "Analytics Dashboard",
      description: "Real-time data visualization and business intelligence",
      icon: "📊",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Gaming Platform",
      description: "Multiplayer gaming with scores, leaderboards & profiles",
      icon: "🎮",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Onboarding Portal",
      description: "User registration, profile setup & team collaboration",
      icon: "👥",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "E-Commerce Store",
      description: "Product catalog, shopping cart & secure checkout",
      icon: "🛍️",
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Project Manager",
      description: "Task tracking, timelines & team communication",
      icon: "✓",
      color: "from-indigo-500 to-blue-500",
    },
    {
      name: "Social Network",
      description: "User profiles, feeds, messaging & notifications",
      icon: "💬",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-4 bg-white relative">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Popular Templates
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with pre-built templates or describe your own ideas. Our AI handles the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <div
              key={template.name}
              className={`card-hover group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>

              {/* Content */}
              <div className="relative p-8">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition duration-300">
                  {template.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {template.name}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {template.description}
                </p>

                {/* Action button */}
                <button className="mt-6 w-full py-2 px-4 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition duration-300">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -inset-20 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 -right-1/4 w-1/2 h-1/2 bg-gradient-accent opacity-5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
