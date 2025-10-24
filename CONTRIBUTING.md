# Contributing to Convex Component Template

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- **Bun** (latest stable version)
- **Node.js** 18+ (for Convex CLI)
- **Git**

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```sh
   git clone https://github.com/SamHoque/convex-component-template.git
   cd convex-component-template
   ```

3. Install dependencies:
   ```sh
   bun install
   ```

4. Set up your Convex dev environment:
   ```sh
   bun run dev:backend
   ```

5. In another terminal, run the example app:
   ```sh
   bun run dev:frontend
   ```

## Development Workflow

### Running the Dev Environment

The project uses a multi-process development setup:

```sh
# Start all dev processes (backend, frontend, build watch)
bun run dev

# Or run individually:
bun run dev:backend    # Convex dev server with live component sources
bun run dev:frontend   # Example app with hot reload
bun run build:watch    # TypeScript build in watch mode
```

### Making Changes

1. Create a new branch for your feature or bugfix:
   ```sh
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the [coding standards](#coding-standards)

3. Add tests for your changes in `test/component/`

4. Run the test suite:
   ```sh
   bun test
   ```

5. Run linting and formatting:
   ```sh
   bun run check:fix
   ```

6. Commit your changes with a descriptive message following [Conventional Commits](https://www.conventionalcommits.org/):
   ```sh
   git commit -m "feat: add new counter increment limit"
   ```

### Commit Message Format

We use conventional commit messages with gitmoji:

- `✨ feat:` - New features
- `🐛 fix:` - Bug fixes
- `📝 docs:` - Documentation changes
- `🎨 style:` - Code style/formatting changes
- `♻️ refactor:` - Code refactoring
- `✅ test:` - Test additions or updates
- `🔧 chore:` - Build process or auxiliary tool changes
- `⚡️ perf:` - Performance improvements
- `👷 ci:` - CI/CD changes

## Coding Standards

### TypeScript

- Use **strict mode** TypeScript
- Enable all recommended checks
- Avoid `any` types - use proper typing
- Use `const` over `let` where possible

### Code Style

We use **Biome** for linting and formatting:

- **Indentation**: Tabs (not spaces)
- **Quotes**: Double quotes for strings
- **Line length**: 100 characters (recommended)
- **Semicolons**: Required

Run the following before committing:

```sh
# Check for issues
bun run check

# Auto-fix issues
bun run check:fix
```

### File Organization

- **Component source**: `src/component/`
- **Tests**: `test/component/` (separate from source to avoid bundling)
- **React hooks**: `src/react/`
- **Client utilities**: `src/client/`
- **Example app**: `example/`

### Naming Conventions

- **Files**: camelCase for source files, kebab-case for config files
- **Functions**: camelCase
- **Components**: PascalCase (React)
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

## Testing

### Writing Tests

Place all test files in `test/component/` directory:

```typescript
import { test, expect } from "bun:test";
import { api } from "../../src/component/_generated/api";
import { convexTest } from "./setup.test";

test("my query works", async () => {
	const t = convexTest();
	const result = await t.query(api.lib.myQuery, { arg: "value" });
	expect(result).toBe("expected");
});
```

### Running Tests

```sh
# Run all tests
bun test

# Watch mode
bun test --watch

# With coverage
bun test --coverage

# Filter by name
bun test -t "pattern"

# Stop on first failure
bun test --bail
```

### Testing Authenticated Scenarios

```typescript
test("authenticated query", async () => {
	const t = convexTest();
	const asUser = t.withIdentity({ subject: "user123" });
	const result = await asUser.query(api.lib.userQuery, {});
	expect(result).toBeDefined();
});
```

## Submitting Changes

### Pull Request Process

1. Ensure all tests pass: `bun test`
2. Ensure linting passes: `bun run check`
3. Ensure TypeScript compiles: `bun run typecheck`
4. Ensure package exports are correct: `bun run attw`
5. Update documentation if needed
6. Push your branch to your fork
7. Open a Pull Request against the `main` branch
8. Fill out the PR template with:
   - Description of changes
   - Related issue numbers
   - Testing performed
   - Breaking changes (if any)

### PR Review Process

- At least one maintainer approval is required
- All CI checks must pass
- Code must follow the project's coding standards
- Tests must be included for new features

### What Happens After Your PR is Merged

- Your changes will be included in the next release
- The CHANGELOG will be updated
- You'll be credited as a contributor

## Release Process

This section is for maintainers.

### Version Bumping

The project uses npm version scripts:

```sh
# Alpha release (pre-release)
bun run alpha

# Patch release (0.1.0 -> 0.1.1)
bun run release

# Manual version bump
npm version [major|minor|patch]
```

### What Happens During Release

1. `preversion`: Runs tests, linting, typecheck, and package validation
2. `version`: Updates version, opens CHANGELOG.md for editing, formats it
3. `postversion`: Pushes changes and tags to GitHub

### Publishing

Publishing happens automatically after version bump:

```sh
# For alpha releases
npm publish --tag alpha

# For stable releases
npm publish
```

## Questions?

If you have questions, please:

- Check existing issues and discussions
- Open a new issue for bugs
- Start a discussion for questions

Thank you for contributing!
