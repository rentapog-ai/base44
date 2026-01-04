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

```
cli/
├── src/
│   ├── commands/        # Command implementations
│   │   └── auth/       # Authentication commands
│   ├── lib/            # Shared libraries
│   │   ├── api/        # API client code
│   │   ├── config/     # Configuration management
│   │   ├── schemas/    # Zod schemas
│   │   └── utils/      # Utility functions
│   ├── index.ts        # Main CLI entry point
│   └── types/          # TypeScript type definitions
├── dist/               # Build output (compiled JavaScript)
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies

- **TypeScript** - Primary language
- **Commander.js** - CLI framework
- **@clack/prompts** - Interactive user prompts
- **Zod** - Schema validation

## License

ISC

