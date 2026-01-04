import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Get the package version from package.json
 * @returns The version string from package.json
 */
export function getPackageVersion(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // Resolve package.json relative to the dist folder (where this will be compiled)
  // In monorepo, we need to go up to packages/cli/package.json
  // From core/dist/utils -> packages/cli/package.json
  // __dirname will be core/dist/utils, so: .. -> core/dist, .. -> core, .. -> packages, then cli/package.json
  const packageJsonPath = join(__dirname, '..', '..', '..', 'cli', 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}

