import fs from "fs";
import path from "path";
import { fileURLToPath, URL } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export async function resolve(specifier, context, nextResolve) {
  // Handle @/ path aliases
  if (specifier.startsWith("@/")) {
    const modulePathName = specifier.slice(2); // Remove @/
    const resolvedPath = path.join(projectRoot, "dist", modulePathName);
    
    // Try to find the file or directory
    let filePath = null;
    
    // Try exact match first
    if (fs.existsSync(resolvedPath + ".js")) {
      filePath = resolvedPath + ".js";
    } else if (fs.existsSync(resolvedPath + ".ts")) {
      filePath = resolvedPath + ".ts";
    } else if (fs.existsSync(resolvedPath)) {
      const stat = fs.statSync(resolvedPath);
      if (stat.isDirectory()) {
        // Try index.js in the directory
        const indexPath = path.join(resolvedPath, "index.js");
        if (fs.existsSync(indexPath)) {
          filePath = indexPath;
        }
      }
    }
    
    if (filePath) {
      return {
        url: new URL(`file://${filePath.replace(/\\/g, "/")}`).href,
        shortCircuit: true,
      };
    }
  }
  
  return nextResolve(specifier, context);
}
