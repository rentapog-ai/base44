# AI Agent Guidelines for Base44 CLI Development

This document provides essential context and guidelines for AI agents working on the Base44 CLI project.

## Project Overview

The Base44 CLI is a **monorepo** containing a TypeScript-based command-line tool built with:
- **Turborepo** - Monorepo build system
- **npm Workspaces** - Package dependency management
- **Commander.js** - CLI framework for command parsing
- **@clack/prompts** - Interactive user prompts and UI components
- **Zod** - Schema validation for API responses, config files, and user inputs
- **TypeScript** - Primary language

### Monorepo Structure
- **Root Package**: `base44-cli` - Monorepo root with Turborepo configuration
- **Core Package**: `@base44/cli-core` - Shared utilities, API clients, schemas, config (internal)
- **CLI Package**: `base44` - Main CLI package (exported to npm, depends on `@base44/cli-core`)

## Key Technologies & Patterns

### CLI Framework
- Use **Commander.js** for all command definitions
- CLI name is **`base44`** 
- Commands follow the pattern: `base44 <command> [subcommand] [options]`

### User Interaction
- Always use **@clack/prompts** for interactive prompts
- Use `@clack/prompts` for:
  - User input collection
  - Progress indicators
  - Spinners for async operations
  - Confirmation dialogs
  - Selection menus

### Schema Validation
- **Zod is mandatory** for all validation:
  - API response validation
  - Configuration file validation
  - User input validation
  - File schema validation
- Create Zod schemas before implementing features
- Use Zod-inferred types for TypeScript type safety
- Always validate external data before processing

### Code Style & Structure

#### Code Comments
- **Minimal commenting approach**: Only add comments for:
  - Complex algorithms or non-obvious logic
  - Unclear design decisions that need explanation
  - Workarounds or non-standard patterns
- **Avoid commenting**:
  - Self-explanatory code
  - Simple function signatures (TypeScript types provide documentation)
  - Obvious operations (e.g., "// Read the file" when the function is `readFile`)
- **JSDoc comments**: Only use for public APIs that need documentation for external consumers
- Let the code speak for itself - prefer clear naming over comments

#### Monorepo Folder Structure
```
cli/
├── packages/
│   ├── core/                    # @base44/cli-core package (shared code)
│   │   ├── src/
│   │   │   ├── api/            # API client code
│   │   │   ├── config/         # Configuration management
│   │   │   ├── schemas/        # Zod schemas
│   │   │   ├── utils/          # Utility functions
│   │   │   └── index.ts        # Core package exports
│   │   └── dist/               # Build output
│   └── cli/                     # base44 package (main CLI)
│       ├── src/
│       │   ├── commands/        # Command implementations (grouped by feature)
│       │   ├── utils/          # CLI-specific utilities
│       │   └── index.ts        # Main CLI entry point
│       └── dist/               # Build output
├── package.json                 # Root package.json
├── turbo.json                   # Turborepo configuration
└── tsconfig.json                # Base TypeScript configuration
```

#### Command Implementation Pattern
```typescript
import { Command } from 'commander';
import { tasks, log } from '@clack/prompts';
import { runCommand } from '../../utils/index.js';
import { /* shared utilities */ } from '@base44/cli-core';

async function commandFunction(): Promise<void> {
  await tasks([
    {
      title: "Operation description",
      task: async () => {
        // Command logic here
        return "Success message";
      },
    },
  ]);
}

export const commandName = new Command('command-name')
  .description('Command description')
  .action(async () => {
    await runCommand(commandFunction);
  });
```

**Important**: All commands must use `runCommand()` wrapper for consistent Base44 branding.

#### Schema Definition Pattern
```typescript
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
});

export type User = z.infer<typeof UserSchema>;
```

## Development Workflow

### Package Manager
- **Use npm** for all package management operations
- Install dependencies: `npm install`
- Add dependencies: `npm install <package>`
- Add dev dependencies: `npm install -D <package>`

### Build Process
- **Root level**: Use `npm run build` to build all packages with Turborepo
- **Package level**: Navigate to package directory and use `npm run build` for individual packages
- **Development**: Use `npm run dev` from root for development with watch mode
- Always build before testing
- Turborepo handles dependency order (core builds before cli)
- **ES Modules**: All packages use `"type": "module"` - use `.js` extensions in imports
- **CLI Entry Point**: Main entry point includes shebang for direct execution

### Command Testing
- Test commands by running the compiled CLI or using development mode
- Verify help text: `base44 <command> --help`

## Important Rules

1. **Use npm** for all package management - never yarn
2. **Monorepo structure** - Core package contains shared code, CLI package contains commands
3. **Package dependencies** - CLI package depends on `@base44/cli-core` via npm workspace protocol (`*`)
4. **Zod validation is required** for all external data
5. **@clack/prompts for all user interaction** - no raw `readline` or `inquirer`
6. **TypeScript strict mode** - maintain type safety
7. **Commander.js for commands** - follow the established pattern
8. **Turborepo for builds** - use Turborepo, not esbuild or tsup
9. **TypeScript project references** - Use composite mode and project references
10. **Test commands** after implementation to ensure they're registered
11. **Cross-platform support** - The CLI must work on both Windows and Unix-like systems. Always use `path.join()`, `path.dirname()`, and other `path` module utilities for path operations. Never use string concatenation or hardcoded path separators.
12. **Command wrapper** - All commands must use `runCommand()` utility for consistent Base44 branding
13. **ES Modules** - All packages use `"type": "module"` - always use `.js` extensions in import statements
14. **Shared utilities** - Use cross-platform file utilities and config management from `@base44/cli-core`

## Common Patterns

### Adding a New Command
1. Create command file in commands directory (grouped by feature)
2. Import and register in main CLI entry point
3. Use Commander.js Command class
4. Add Zod validation for inputs (schemas in core package)
5. Use @clack/prompts for user interaction
6. Import shared utilities from `@base44/cli-core` package
7. Wrap command function with `runCommand()` utility

### API Integration
1. Define Zod schema in core package schemas directory
2. Create API client function in core package api directory
3. Export from core package index
4. Import and use in CLI commands from `@base44/cli-core`
5. Validate response with Zod schema
6. Handle errors gracefully
7. Use @clack/prompts for loading states

### Configuration Management
1. Define Zod schema in core package schemas directory
2. Create config management functions in core package config directory
3. Export from core package index
4. Import and use in CLI commands from `@base44/cli-core`
5. Read config file
6. Validate with Zod schema
7. Provide type-safe access via inferred types

## Dependencies Reference

### Core (Required)
- `commander` - CLI framework
- `@clack/prompts` - User prompts and UI components
- `chalk` - Terminal colors
- `zod` - Schema validation
- `typescript` - Language
- `tsx` - TypeScript execution for development/watch mode

### API
- `axios` or `node-fetch` - HTTP client

### Config
- `cosmiconfig` or `conf` - Config management
- `js-yaml` or `toml` - Config parsing

### Security
- `keytar` or `@napi-rs/keyring` - Credential storage

### Utilities
- `fs-extra` - File operations

## File Locations

- **Main plan**: `cli/plan.md` - Full implementation plan
- **This file**: `cli/AGENTS.md` - AI agent guidelines
- **Core package**: `cli/packages/core/src/` - Shared utilities, API, schemas, config
- **CLI package**: `cli/packages/cli/src/` - CLI commands and entry point

## Questions to Ask

If uncertain about implementation:
1. Check `plan.md` for feature requirements
2. Verify command name matches `base44 <command>` pattern
3. Ensure Zod validation is included
4. Confirm @clack/prompts is used for user interaction
5. Check if feature is in current phase scope

## Notes from Development

- **Monorepo structure**: Core package is internal, CLI package is exported
- CLI uses TypeScript with strict type checking and project references
- All commands must be registered in main CLI entry point
- Build process compiles TypeScript to JavaScript in each package's `dist/` folder
- Turborepo handles build order (core builds before cli)
- Commands should be testable independently
- Shared code (API, schemas, config, utils) goes in core package
- CLI-specific code (commands) goes in CLI package
- Import from `@base44/cli-core` in CLI commands for shared functionality
- Error handling should be user-friendly with clear messages
- Use @clack/prompts for all user-facing interactions (no console.log for prompts)
- All commands use `runCommand()` utility for consistent branding
- All packages use ES modules - imports must use `.js` extensions
- Use cross-platform file utilities from `@base44/cli-core` for file operations
- All data validation uses Zod schemas with type inference

