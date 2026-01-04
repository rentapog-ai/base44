# Base44 CLI

A unified command-line interface for managing Base44 applications, entities, functions, deployments, and related services.

## Installation

```bash
# Using Yarn
yarn install

# Build the project
yarn build

# Run the CLI (multiple ways)
yarn start                    # Using node directly
yarn base44                   # Using yarn (runs node_modules/.bin/base44)
./dist/index.js              # Run executable directly
```

## Development

```bash
# Run in development mode with watch
yarn dev

# Build the project
yarn build

# Clean build artifacts
yarn clean
```

## Commands

### Authentication
- `base44 login` - Authenticate with Base44
- `base44 whoami` - Display current authenticated user
- `base44 logout` - Logout from current device

## Project Structure

This is a **monorepo** using Turborepo and Yarn workspaces:

```
cli/
├── packages/
│   ├── cli/                    # Main CLI package (base44)
│   │   ├── src/
│   │   │   ├── commands/       # Command implementations
│   │   │   │   └── auth/       # Authentication commands
│   │   │   └── index.ts        # Main CLI entry point
│   │   ├── dist/               # Build output (compiled JavaScript)
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── core/                    # Core shared package (@base44/cli-core)
│       ├── src/
│       │   ├── api/            # API client code
│       │   ├── config/         # Configuration management
│       │   ├── schemas/        # Zod schemas
│       │   ├── utils/          # Utility functions
│       │   └── index.ts        # Core package exports
│       ├── dist/               # Build output
│       ├── package.json
│       └── tsconfig.json
├── package.json                 # Root package.json (monorepo config)
├── turbo.json                   # Turborepo configuration
├── tsconfig.json                # Base TypeScript configuration
└── README.md
```

## Technologies

- **TypeScript** - Primary language
- **Commander.js** - CLI framework
- **@clack/prompts** - Interactive user prompts
- **Zod** - Schema validation

## License

ISC

