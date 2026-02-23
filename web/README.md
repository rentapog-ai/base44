# Base44 Web UI

Modern, responsive web interface for Base44 CLI. Built with Next.js, React, and Tailwind CSS.

## Features

- ✨ Beautiful, responsive UI inspired by base44.com
- 🚀 Real-time app building via CLI integration
- 📱 Mobile-first responsive design
- 🎨 Smooth animations and transitions
- 🌙 Modern gradient design system
- 📦 Template showcase with quick-start examples

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

```bash
cd web
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CLI_API_URL=http://localhost:3001
```

For production (Render):

```env
NEXT_PUBLIC_CLI_API_URL=https://base44-cli-xxxx.onrender.com
```

## Project Structure

```
web/
├── app/
│   ├── components/
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Hero.tsx         # Main input section
│   │   ├── Templates.tsx    # Template showcase
│   │   └── Footer.tsx       # Footer
│   ├── globals.css          # Global styles & animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── public/                  # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS config
└── tsconfig.json          # TypeScript config
```

## How It Works

1. User enters app description in the hero section
2. Form submits to the CLI API endpoint (`/api/execute`)
3. CLI processes the request and returns results
4. Results are displayed in an elegant card with syntax highlighting
5. User can build another or view the project

## Styling

Uses Tailwind CSS with custom animations:

- `animate-fade-in-up` - Fade and slide up animation
- `animate-slide-in-left` - Slide from left animation
- `animate-pulse-slow` - Slow pulse effect
- `animate-spin-slow` - Slow rotation

Gradient colors:
- Primary: Orange to Red (`#ff6b35` → `#f97316`)
- Blue to Cyan background
- Gray scale for text

## Deployment

### Deploy to Render

1. Push code to GitHub
2. Create new Web Service in Render dashboard
3. Connect to this repository
4. Set environment variables:
   ```
   NEXT_PUBLIC_CLI_API_URL=https://base44-cli-xxxx.onrender.com
   NODE_ENV=production
   ```
5. Build command: `npm install && npm run build`
6. Start command: `npm start`
7. Deploy! → URL: `https://base44-web-xxxx.onrender.com`

## API Integration

Connects to Base44 CLI service at `NEXT_PUBLIC_CLI_API_URL`:

- `POST /api/execute` - Execute CLI commands
  - Request: `{ "command": "create app-name" }`
  - Response: `{ "success": true, "output": "..." }` or `{ "success": false, "error": "..." }`

- `GET /health` - Health check
  - Response: `{ "status": "OK", "service": "Base44 CLI", ... }`

## Technologies

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS 3.3
- **Language**: TypeScript 5
- **Animation**: CSS animations + Intersection Observer

## Performance

- ⚡ Server-side rendering
- 🎯 Optimized images
- 📦 Code splitting per route
- 🚀 Fast refresh during development

## Contributing

Pull requests welcome! Check current issues and PRs before starting work.

## License

MIT © 2024 Base44
