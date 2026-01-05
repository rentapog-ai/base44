# CLI Implementation Plan

## Overview
Generate a comprehensive CLI tool that provides a unified interface for managing Base44 applications, entities, functions, deployments, and related services.

## Core Architecture

### Monorepo Structure
- **Root Package**: `base44-cli` - Monorepo root with Turborepo configuration
- **Packages**:
  - `@base44/cli-core` - Shared utilities, API clients, schemas, and configuration management (internal package)
  - `base44` - Main CLI package (exported to npm, depends on `@base44/cli-core`)
- **Build System**: Turborepo for fast, cached builds across packages
- **Package Manager**: npm workspaces for monorepo dependency management

### CLI Framework
- **Technology**: TypeScript with Commander.js for CLI framework
- **Structure**: Command-based architecture with subcommands
- **CLI Name**: `base44`
- **User Prompts**: Use `@clack/prompts` for interactive user prompts
- **Package Distribution**: Support for multiple package managers
  - Homebrew (brew) - macOS/Linux
  - Scoop - Windows
  - npm - Node.js ecosystem (package published to npm as `base44`)

## Feature Implementation Plan

### 1. Authentication & Identity
- **`base44 login`**
  - Device-based authentication
  - OAuth flow implementation
  - Token storage and management
  - Session persistence
  
- **`base44 whoami`**
  - Display current authenticated user
  - Show account information
  - Display active session details

- **`base44 logout`**
  - Clear authentication tokens
  - Remove session data
  - Logout from current device

### 2. Entities Management
- **`base44 entities`**
  - List all entities in the project
  - Display entity hierarchy (e.g., entities → auth.group)
  
- **`base44 entities pull`**
  - Read schemas from remote
  - Sync entity definitions
  - Download entity configurations
  - **Validate downloaded schemas using Zod** - Ensure schema integrity
  
- **`base44 entities push`**
  - Write schemas to remote
  - Upload entity definitions
  - **Validate before pushing using Zod schemas** - Local validation before upload
  - Schema structure verification

### 3. Functions Management
- **`base44 functions`**
  - List all functions
  - Display function hierarchy (e.g., functions → hello.IT)
  - Show function metadata
  
- **`base44 functions [function-name]`**
  - View specific function details
  - Show function code, triggers, and configuration

- **Cron Jobs Support**
  - Schedule management
  - **Zod validation for cron expressions** - Validate cron syntax
  - Job listing and status

### 4. Development Environment
- **`base44 dev`**
  - Start local development server
  - Hot reload for functions
  - Local testing environment
  
- **`base44 dev --functions`**
  - Development mode with function support
  - Function hot-reloading

### 5. Deployment
- **`base44 deploy`**
  - Deploy entire application
  - Environment selection (staging/production)
  
- **`base44 deploy --client`**
  - Deploy client-side application only
  - Frontend build and deployment
  
- **`base44 deploy --fullstack`**
  - Deploy full-stack application
  - Backend + Frontend deployment
  - Database migrations

### 6. Project Initialization
- **`base44 new`** / **`base44 init`** / **`base44 create`**
  - Initialize new Base44 project
  - Project scaffolding
  
- **`base44 new --blank`**
  - Create blank project template
  - Minimal project structure
  
- **`base44 new --example`**
  - Create project from example template
  - Pre-configured starter project

### 7. Linking & Integration
- **`base44 link`**
  - Link local project to remote Base44 project
  - Establish connection between local and cloud
  - Configure project association

### 8. AI Features
- **`base44 ai`**
  - AI-powered assistance
  - Code generation and suggestions
  
- **`base44 ai does [prompt]`**
  - Execute AI commands
  - Natural language to CLI actions
  - Intelligent task automation

### 9. Secrets Management
- **`base44 secrets`**
  - List all secrets
  - Display secret metadata (not values)
  
- **`base44 secrets get [key]`**
  - Retrieve specific secret value
  - Secure secret retrieval
  - Environment variable export option
  
- **`base44 secrets set [key] [value]`**
  - Set or update secret value
  - Secure secret storage
  - **Zod validation for secret keys and values** - Ensure proper format
  - Encryption
  - Interactive prompts for secret input using `@clack/prompts`

### 10. Domains Management
- **`base44 domains`**
  - List configured domains
  - Show domain status and configuration
  - Display SSL certificate information
  
- **`base44 domains add [domain]`**
  - Add new domain
  - **Zod validation for domain format** - Ensure valid domain structure
  - DNS configuration assistance
  - Interactive domain setup using `@clack/prompts`
  
- **`base44 domains remove [domain]`**
  - Remove domain configuration

## Implementation Phases

### Phase 0: Skeleton
**Goal**: Set up the basic project structure and create placeholder commands for authentication.

1. **Project Structure Setup**
   - Create monorepo folder structure:
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
     │       │   ├── commands/
     │       │   │   └── auth/
     │       │   │       ├── login.ts
     │       │   │       ├── whoami.ts
     │       │   │       └── logout.ts
     │       │   ├── utils/          # CLI-specific utilities
     │       │   │   ├── index.ts
     │       │   │   ├── packageVersion.ts
     │       │   │   └── runCommand.ts
     │       │   └── index.ts        # Main CLI entry point (with shebang)
     │       ├── dist/               # Build output
     │       ├── package.json
     │       └── tsconfig.json
     ├── package.json                 # Root package.json (base44-cli)
     ├── turbo.json                   # Turborepo configuration
     ├── tsconfig.json                # Base TypeScript configuration
     ├── .gitignore
     └── README.md
     ```

2. **Build Process & Configuration**
   - Set up root TypeScript configuration (`tsconfig.json`) with project references
   - Configure Turborepo (`turbo.json`) for monorepo builds
   - Set up package-specific TypeScript configurations with composite mode
   - Configure workspace dependencies (cli depends on core)
   - Set up source maps for debugging
   - Configure output directory structure for each package
   - **ES Modules**: All packages use `"type": "module"` for ES module support
   - **Development**: Use `tsx` for development/watch mode (not just `tsc`)
   - **Production**: Use `tsc` for production builds

3. **Package.json Setup**
  - **Root package.json** (`base44-cli`):
    - Configure npm workspaces for monorepo
    - Install Turborepo as dev dependency
    - Set up root-level scripts for building all packages
   - **Core package** (`@base44/cli-core`):
     - Install shared dependencies:
       - `zod` - Schema validation
     - Set up build scripts (`tsc` for build, `tsx watch` for dev)
   - **CLI package** (`base44`):
     - Install CLI-specific dependencies:
       - `commander` - CLI framework
       - `@clack/prompts` - User prompts and UI components
       - `chalk` - Terminal colors (Base44 brand color: #E86B3C)
       - `@base44/cli-core` - npm workspace dependency on core package (using `*` protocol)
     - Set up bin entry point for CLI executable (`./dist/index.js`)
     - Set up build and dev scripts
     - **Shebang**: Main entry point (`src/index.ts`) includes `#!/usr/bin/env node`

4. **Authentication Commands (Implemented)**
   - Create `base44 login` command
     - Use Commander.js to register command
     - Use `@clack/prompts` tasks for async operations
     - Store auth data using `writeAuth` from `@base44/cli-core`
     - Wrap with `runCommand` utility for consistent branding
   - Create `base44 whoami` command
     - Use Commander.js to register command
     - Read auth data using `readAuth` from `@base44/cli-core`
     - Display user information using `@clack/prompts` log
     - Wrap with `runCommand` utility for consistent branding
   - Create `base44 logout` command
     - Use Commander.js to register command
     - Delete auth data using `deleteAuth` from `@base44/cli-core`
     - Wrap with `runCommand` utility for consistent branding
   - Ensure all commands are properly registered in main CLI entry point
   - Test that commands are accessible and show help text

5. **Import Structure**
   - Set up proper ES module imports/exports (`.js` extensions in imports)
   - Create barrel exports for command modules if needed
   - Ensure TypeScript path resolution works correctly
   - Use ES module syntax throughout (`import`/`export`)

**Deliverables**:
- ✅ Complete folder structure
- ✅ Working build process (tsc for production, tsx for development)
- ✅ Package.json with all scripts
- ✅ Three auth commands (login, whoami, logout) fully implemented
- ✅ CLI can be run and commands respond with help text
- ✅ Base44 branding via `runCommand` utility wrapper

### Phase 1: Foundation
1. ✅ Implement Commander.js command framework
2. ✅ Integrate `@clack/prompts` for user interactions
3. ✅ Set up Zod schema validation infrastructure
   - ✅ Create base schemas for auth data (`AuthDataSchema`)
   - ✅ Create config file schemas
   - ✅ Set up validation utilities
4. ✅ Create authentication system (`base44 login`, `base44 whoami`, `base44 logout`)
   - ✅ Auth data stored in `~/.base44/auth/auth.json`
   - ✅ Zod validation for auth data
   - ✅ Cross-platform file system utilities
   - ✅ Error handling with user-friendly messages
5. Package manager distribution setup (npm, brew, scoop)

### Phase 2: Core Features
1. Entities management (`base44 entities`, `pull`, `push`)
2. Functions listing and management
3. Project initialization (`base44 new`, `base44 init`, `base44 create`)
4. Linking functionality (`base44 link`)

### Phase 3: Development & Deployment
1. Development server (`base44 dev`)
2. Deployment commands (`base44 deploy --client`, `base44 deploy --fullstack`)
3. Cron job management integration

### Phase 4: Advanced Features
1. Secrets management (`base44 secrets get`, `base44 secrets set`)
2. Domains management (`base44 domains`)
3. AI integration (`base44 ai`, `base44 ai does`)

### Phase 5: Polish & Distribution
1. Error handling and validation
2. Help documentation and examples
3. Package distribution (brew, scoop, npm via GitHub Actions)
4. Testing and quality assurance

## Technical Considerations

### Configuration
- **Global Auth Config**: Stored in `~/.base44/auth/auth.json` (managed by `@base44/cli-core`)
- Local config file (`.base44/config.json` or similar) - for project-specific settings
- Global config for user preferences
- Environment-specific settings
- **Zod schema validation for all configuration files** - Validate config structure and values
- Type-safe config access using Zod-inferred types
- **File System Utilities**: Cross-platform file operations in `packages/core/src/utils/fs.ts`

### API Integration
- REST API client for Base44 services (using `fetch` or `axios`)
- Authentication token management
- Rate limiting and retry logic
- Error handling and user feedback
- **Zod schema validation for all API responses** - Validate and type-check API responses at runtime
- TypeScript types generated from Zod schemas for type safety

### Build & Distribution
- **Monorepo Structure** - Separated into `core` and `cli` packages
- **Turborepo** - Fast build tool for TypeScript compilation across packages
- **npm Workspaces** - Package manager for monorepo dependency management
- **TypeScript Project References** - Proper dependency graph between packages
- **ES Modules** - All packages use `"type": "module"` for native ES module support
- **Build Tools**:
  - Production: `tsc` (TypeScript compiler) for type-checked builds
  - Development: `tsx` for fast watch mode and direct TypeScript execution
- **CLI Entry Point**: `packages/cli/src/index.ts` includes shebang (`#!/usr/bin/env node`)
- GitHub Actions for automated builds and npm releases (only `base44` package is published)

### Security
- Secure credential storage
- Encrypted secret management
- Token refresh mechanisms
- **Zod-based input validation and sanitization** - Validate all user inputs and CLI arguments
- Schema validation for secrets and sensitive data

### User Experience
- **Base44 Branding**: All commands wrapped with `runCommand` utility showing Base44 intro banner (color: #E86B3C)
- Clear error messages with try-catch error handling
- Progress indicators for long operations using `@clack/prompts` tasks
- Interactive prompts using `@clack/prompts` for better UX
- Comprehensive help system via Commander.js
- Spinners and loading states for async operations
- **Command Wrapper Pattern**: All commands use `runCommand()` utility for consistent branding and error handling

## Schema Validation with Zod

### API Response Validation
- Define Zod schemas for all API endpoints
- Validate API responses before processing
- Type-safe API client with inferred types from Zod schemas
- Clear error messages when API responses don't match expected schema
- Examples:
  - `UserSchema` for authentication responses
  - `EntitySchema` for entity definitions
  - `FunctionSchema` for function metadata
  - `DeploymentSchema` for deployment status
  - `SecretSchema` for secrets management
  - `DomainSchema` for domain configurations

### Configuration File Validation
- Zod schemas for all configuration files:
  - `.base44/config.json` - Project configuration
  - Global config files
  - Entity schema files
  - Function configuration files
- Validate on read to catch configuration errors early
- Type-safe config access throughout the application

### File Schema Validation
- Validate entity schema files before push operations
- Validate function definitions and configurations
- Validate project structure files
- Ensure data integrity before syncing with remote

### Input Validation
- Validate CLI command arguments using Zod
- Validate user input from prompts
- Validate environment variables
- Validate secrets before storage

## Dependencies

### Core CLI
- **commander** - CLI framework for command parsing and help generation
- **@clack/prompts** - Beautiful, accessible prompts and UI components
- **chalk** - Terminal colors (Base44 brand color: #E86B3C)
- **typescript** - TypeScript compiler and type system
- **tsx** - TypeScript execution for development/watch mode

### API & HTTP
- **axios** or **node-fetch** - HTTP client for API communication
- **zod** - **Primary schema validation library** for:
  - API response validation
  - Configuration file validation
  - Input validation
  - File schema validation
  - Type inference for TypeScript

### Configuration
- **cosmiconfig** or **conf** - Configuration file management
- **js-yaml** or **toml** - YAML/TOML parsing for config files

### Security & Storage
- **keytar** or **@napi-rs/keyring** - Secure credential storage (OS keychain)
- **crypto** (Node.js built-in) - Encryption for secrets

### Utilities
- **fs-extra** - Enhanced file system operations

### Development
- **@types/node** - TypeScript definitions for Node.js
- **turbo** - Turborepo build tool for fast compilation

