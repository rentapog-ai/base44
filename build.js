#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function rmrf(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function build() {
  try {
    console.log("🧹 Cleaning dist...");
    rmrf(path.join(__dirname, "dist"));
    fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });

    console.log("📦 Copying templates...");
    const templatesDir = path.join(__dirname, "templates");
    if (fs.existsSync(templatesDir)) {
      copyDir(templatesDir, path.join(__dirname, "dist", "templates"));
    }

    console.log("🔨 Building with esbuild (bundled)...");
    
    // List of pure ESM packages that must be external
    const externalPackages = new Set([
      "@clack/prompts", "chalk", "commander", "cors", "ejs", "execa", "express",
      "front-matter", "get-port", "globby", "http-proxy-middleware",
      "json-schema-to-typescript", "json5", "ky", "lodash.kebabcase", "msw",
      "nanoid", "open", "p-wait-for", "posthog-node", "strip-ansi", "tar",
      "tmp-promise", "zod", "esbuild", "@biomejs/biome", "@vercel/detect-agent"
    ]);

    const result = await esbuild.build({
      entryPoints: [path.join(__dirname, "src/cli/index.ts")],
      outfile: path.join(__dirname, "dist/cli/index.js"),
      bundle: true,
      minify: false,
      sourcemap: false,
      platform: "node",
      format: "esm",
      target: "es2022",
      external: Array.from(externalPackages),
      tsconfig: path.join(__dirname, "tsconfig.json"),
      resolveExtensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      // Alias @/* to src/*
      alias: {
        "@": path.join(__dirname, "src"),
      },
      logLevel: "warning",
    });

    if (result.errors && result.errors.length > 0) {
      throw new Error(`Build errors: ${result.errors.map(e => e.text).join(", ")}`);
    }

    console.log("✅ Build complete!");
    process.exitCode = 0;
  } catch (error) {
    console.error("❌ Build failed:", error.message);
    process.exitCode = 1;
  }
}

build();
