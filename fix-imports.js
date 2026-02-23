#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "src");

function getRelativeImportPath(fromFile, toFile) {
  const fromDir = path.dirname(fromFile);
  let relativePath = path.relative(fromDir, toFile);
  
  // Ensure it starts with . or ..
  if (!relativePath.startsWith(".")) {
    relativePath = "./" + relativePath;
  }
  
  // Normalize to forward slashes for ESM
  relativePath = relativePath.replace(/\\/g, "/");
  
  return relativePath;
}

function resolveAliasPath(aliasPath) {
  // Remove @/ prefix and resolve against src dir
  const targetPath = aliasPath.replace(/^@\//, "");
  return path.join(srcDir, targetPath);
}

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const originalContent = content;
  
  // Match import/export statements with @/ paths
  content = content.replace(
    /(['"`])(\.\.\/)?@\/([^'"` ]+)(['"`])/g,
    (match, quote1, prevDots, alias, quote2) => {
      if (quote1 !== quote2) return match;
      
      const targetPath = resolveAliasPath(`@/${alias}`);
      const relativePath = getRelativeImportPath(filePath, targetPath);
      
      return `${quote1}${relativePath}${quote2}`;
    }
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✓ Fixed imports in ${path.relative(__dirname, filePath)}`);
    return true;
  }
  
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith(".") && file !== "node_modules" && file !== "dist") {
        fixedCount += walkDir(fullPath);
      }
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      if (fixImports(fullPath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

console.log("🔄 Converting @/ aliases to relative imports...");
const fixed = walkDir(srcDir);
console.log(`✅ Fixed ${fixed} file(s)`);
