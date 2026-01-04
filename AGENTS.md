# AI Agent Guidelines for Base44 CLI Development

This document provides essential context and guidelines for AI agents working on the Base44 CLI project.

## Project Overview

The Base44 CLI is a **monorepo** containing a TypeScript-based command-line tool built with:
- **Turborepo** - Monorepo build system
- **Yarn Workspaces** - Package dependency management
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

#### Monorepo Folder Structure
```
cli/
├── packages/
│   ├── core/                    # @base44/cli-core package
│   │   ├── src/
│   │   │   ├── api/            # API client code
│   │   │   ├── config/         # Configuration management
│   │   │   ├── schemas/        # Zod schemas
│   │   │   ├── utils/          # Utility functions
│   │   │   ├── types/          # TypeScript type definitions
│   │   │   └── index.ts        # Core package exports
│   │   ├── dist/               # Build output
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── cli/                     # base44 package (main CLI)
│       ├── src/
│       │   ├── commands/       # Command implementations
│       │   │   └── [feature]/  # Grouped by feature (auth, entities, etc.)
│       │   └── index.ts        # Main CLI entry point
│       ├── dist/               # Build output
│       ├── package.json
│       └── tsconfig.json
├── package.json                 # Root package.json (base44-cli)
├── turbo.json                   # Turborepo configuration
├── tsconfig.json                # Base TypeScript configuration
└── README.md
```

#### Command Implementation Pattern
```typescript
import { Command } from 'commander';
import { prompt } from '@clack/prompts';
import { z } from 'zod';

export const loginCommand = new Command('login')
  .description('Authenticate with Base44')
  .action(async () => {
    // Implementation using @clack/prompts and Zod validation
  });
```

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
- **Use Yarn** for all package management operations
- Install dependencies: `yarn install`
- Add dependencies: `yarn add <package>`
- Add dev dependencies: `yarn add -D <package>`

### Build Process
- **Root level**: Use `yarn build` to build all packages with Turborepo
- **Package level**: Navigate to `packages/cli` and use `yarn build` for CLI only
- Use `yarn dev` from root for development with watch mode (all packages)
- Use `yarn start` from `packages/cli` to run the compiled CLI
- Always build before testing
- Turborepo handles dependency order (core builds before cli)

### Command Testing
- Test commands by running: `node packages/cli/dist/index.js <command>`
- Or use `yarn dev` from root for direct TypeScript execution
- Or navigate to `packages/cli` and use `yarn dev` for CLI-specific development
- Verify help text: `base44 <command> --help`

## Important Rules

1. **Use Yarn** for all package management - never npm
2. **Monorepo structure** - Core package contains shared code, CLI package contains commands
3. **Package dependencies** - CLI package depends on `@base44/cli-core` via workspace protocol
4. **Zod validation is required** for all external data
5. **@clack/prompts for all user interaction** - no raw `readline` or `inquirer`
6. **TypeScript strict mode** - maintain type safety
7. **Commander.js for commands** - follow the established pattern
8. **Turborepo for builds** - use Turborepo, not esbuild or tsup
9. **TypeScript project references** - Use composite mode and project references
10. **Test commands** after implementation to ensure they're registered

## Common Patterns

### Adding a New Command
1. Create command file in `packages/cli/src/commands/[feature]/[command].ts`
2. Import and register in main `packages/cli/src/index.ts`
3. Use Commander.js Command class
4. Add Zod validation for inputs (schemas should be in `packages/core/src/schemas/`)
5. Use @clack/prompts for user interaction
6. Import shared utilities from `@base44/cli-core` package

### API Integration
1. Define Zod schema in `packages/core/src/schemas/`
2. Create API client function in `packages/core/src/api/`
3. Export from `packages/core/src/index.ts`
4. Import and use in CLI commands from `@base44/cli-core`
5. Validate response with Zod schema
6. Handle errors gracefully
7. Use @clack/prompts for loading states

### Configuration Management
1. Define Zod schema in `packages/core/src/schemas/`
2. Create config management functions in `packages/core/src/config/`
3. Export from `packages/core/src/index.ts`
4. Import and use in CLI commands from `@base44/cli-core`
5. Read config file
6. Validate with Zod schema
7. Provide type-safe access via inferred types

## Dependencies Reference

### Core (Required)
- `commander` - CLI framework
- `@clack/prompts` - User prompts
- `zod` - Schema validation
- `typescript` - Language

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
- **Root config**: `cli/turbo.json` - Turborepo configuration
- **Core package source**: `cli/packages/core/src/` - Shared utilities, API, schemas, config
- **CLI package source**: `cli/packages/cli/src/` - CLI commands and entry point
- **Core build output**: `cli/packages/core/dist/` - Compiled core package
- **CLI build output**: `cli/packages/cli/dist/` - Compiled CLI package

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
- All commands must be registered in `packages/cli/src/index.ts`
- Build process compiles TypeScript to JavaScript in each package's `dist/` folder
- Turborepo handles build order (core builds before cli)
- Commands should be testable independently
- Shared code (API, schemas, config, utils) goes in `packages/core`
- CLI-specific code (commands) goes in `packages/cli`
- Import from `@base44/cli-core` in CLI commands for shared functionality
- Error handling should be user-friendly with clear messages
- Use @clack/prompts for all user-facing interactions (no console.log for prompts)

