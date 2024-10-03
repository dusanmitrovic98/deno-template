# Deno Template

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
git clone https://github.com/dusanmitrovic98/deno-template.git
cd deno-template
```

No additional installation steps are needed as Deno handles dependencies automatically!

## 🔧 Available Tasks

- `deno task dev` - Start development server with watch mode
- `deno task build` - Build the project
- `deno task start` - Run the production build
- `deno task lint` - Lint the codebase
- `deno task fmt` - Format the codebase

### Git Workflow Tasks
- `deno task commit` - Commit changes
- `deno task push` - Push changes to remote
- `deno task sync` - Sync with remote repository
- `deno task git` - Run all git tasks (commit, push, sync)

### Version Management Tasks
- `deno task version:major` - Bump major version
- `deno task version:minor` - Bump minor version
- `deno task version:patch` - Bump patch version
- `deno task version:rollback` - Rollback version

### Release Tasks
- `deno task release:major` - Release major version update
- `deno task release:minor` - Release minor version update
- `deno task release:patch` - Release patch version update
- `deno task release` - Quick release (equivalent to patch release)

### Combined Tasks
- `deno task build:git` - Build the project and run all git tasks

This updated documentation now includes all the tasks you've defined in your scripts, including the version management and release tasks. It provides a comprehensive overview of the available commands for development, building, version control, and releasing your project.

Note that I've removed the `test` task from the documentation as it wasn't present in the scripts you provided. If you do have tests in your project, you might want to add a `test` task to your scripts and include it in the documentation.


## 🏗️ Project Structure

```
/
├── .core/          # Core utilities
│   ├── git/        # Git automation scripts
│   │   ├── commit.ts
│   │   ├── push.ts
│   │   └── sync.ts
│   └── version-bump.ts  # Version management script
├── src/            # Source code
├── dist/           # Production build
│   └── bundle.js   # Bundled JavaScript file
├── deno.json       # Deno configuration and scripts
├── index.ts        # Entry point
├── build.ts        # Build script
├── README.md       # Project documentation
├── VERSION_BUMP_GUIDE.md  # Guide for version bumping
└── version-history.json   # Version history tracking
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
- `@std/fs` - Standard library file system operations
- `@std/path` - Standard library path manipulation

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

MIT License

Copyright (c) 2024 Dušan Mitrović

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 📞 Contact

Dušan Mitrović - [@dusanmitrovic98](https://twitter.com/dusanmitrovic98) - dusanmitrovicoffice@gmail.com

Project Link: [https://github.com/dusanmitrovic98/deno-template](https://github.com/dusanmitrovic98/deno-template)