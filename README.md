# Deno Project

A modern TypeScript project using Deno runtime.

## 🚀 Features

- Fast development with watch mode
- Automated Git workflow
- Build system for production
- Type safety with TypeScript

## 📋 Prerequisites

- [Deno](https://deno.land/) version 1.37 or higher

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

No additional installation steps are needed as Deno handles dependencies automatically!

## 🏃‍♂️ Running the Project

Start the development server:
```bash
deno task dev
```

This will run the project in watch mode, automatically reloading when files change.

## 📦 Building for Production

Build the project:
```bash
deno task build
```

To build and automatically commit, push, and sync changes:
```bash
deno task build:git
```

Run the production build:
```bash
deno task start
```

## 🔧 Available Tasks

- `deno task dev` - Start development server with watch mode
- `deno task build` - Build the project
- `deno task start` - Run the production build
- `deno task test` - Run tests
- `deno task lint` - Lint the codebase
- `deno task fmt` - Format the codebase

### Git Workflow Tasks
- `deno task commit` - Commit changes
- `deno task push` - Push changes to remote
- `deno task sync` - Sync with remote repository
- `deno task git` - Run all git tasks (commit, push, sync)

## 🏗️ Project Structure

```
/
├── .core/          # Core utilities
│   └── git/        # Git automation scripts
├── src/            # Source code
├── tests/          # Test files
├── dist/           # Production build
├── deno.json       # Deno configuration
├── index.ts        # Entry point
└── build.ts        # Build script
```

## 🧪 Testing

Run the test suite:
```bash
deno task test
```

## 📝 Code Style

This project uses Deno's built-in formatter and linter. 

Format your code:
```bash
deno task fmt
```

Lint your code:
```bash
deno task lint
```

## 📚 Dependencies

All dependencies are managed through Deno's import system. Key dependencies include:

- `@std/assert` - Standard library assertions

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

[Choose an appropriate license and include it here]

## 📞 Contact

[Your Name] - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/your-repo-name](https://github.com/yourusername/your-repo-name)