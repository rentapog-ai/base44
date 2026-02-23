"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
            B
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Base44
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-12">
          {["Product", "Solutions", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium transition duration-300"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-gray-700 hover:text-gray-900 font-medium transition">
            Sign In
          </button>
          <button className="btn-primary text-sm whitespace-nowrap">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
