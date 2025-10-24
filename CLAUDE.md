# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Convex component template** for building reusable Convex components. It uses:
- **Bun** for package management, testing, and development
- **Biome** for linting and formatting
- **convex-test** for testing Convex functions
- TypeScript with strict mode enabled

## Key Commands

### Development
```sh
bun run dev                  # Start both backend and frontend (with build watcher)
bun run dev:backend          # Start Convex dev server with live component sources and typechecking
bun run dev:frontend         # Start example frontend (Bun.serve with hot reload)
bun run build                # Build TypeScript for distribution
bun run build:watch          # Watch and rebuild on changes
```

### Testing
```sh
bun test                     # Run all tests
bun test --watch             # Watch mode for continuous testing
bun test --coverage          # Generate code coverage reports
bun test --bail              # Stop after first failure
bun test -t "pattern"        # Filter tests by name pattern
CLAUDECODE=1 bun test        # AI-friendly quiet output (only shows failures)
```

### Linting and Formatting
```sh
bun run lint                 # Lint the codebase (Biome)
bun run lint:fix             # Auto-fix linting issues
bun run format               # Format code with Biome
bun run check                # Run both lint and format checks
bun run check:fix            # Auto-fix both lint and format issues
```

### Versioning and Releases
```sh
bun run changeset            # Add a new changeset (run when making user-facing changes)
bun run ci:version           # Update versions and changelogs (usually automated by GitHub Actions)
bun run ci:publish           # Publish to npm (usually automated by GitHub Actions)
```

## Project Structure

```
src/
  component/               # The Convex component source code
    convex.config.ts       # Component configuration (exported via package.json)
    schema.ts              # Convex schema definition
    lib.ts                 # Component functions (queries, mutations)
    _generated/            # Auto-generated Convex types (gitignored)

  client/                  # Client library (runs in app context, not component)
    index.ts               # Helper class for easier component interaction
    types.ts               # Type utilities for component API

  react/                   # React hooks and components (optional)
    index.ts               # React hooks for using the component

test/
  component/               # Component tests (separate from source to avoid bundling)
    setup.test.ts          # Test setup with module auto-discovery
    *.test.ts              # Unit tests for the component

  client/                  # Client library tests
    setup.test.ts          # Test setup that registers the component
    *.test.ts              # Unit tests for the client library

example/
  convex/                  # Example app that uses the component
    convex.config.ts       # Example app configuration that imports the component
    schema.ts              # Example app schema
    example.ts             # Example usage of the client library
    _generated/            # Auto-generated Convex types (gitignored)

  src/                     # Example frontend (Bun.serve + React)
    index.tsx              # Bun server with hot reload
    frontend.tsx           # React entry point
    App.tsx                # Main React component
```

## Architecture

### Convex Component Pattern
This project follows the **Convex component architecture** with a three-layer structure:

1. **Component Layer** (`src/component/`):
   - Defines the component with `defineComponent("shardedCounter")`
   - Contains the actual Convex functions (queries, mutations, actions)
   - Has isolated tables, file storage, and scheduled functions
   - Exported via package.json `"./convex.config"` with `@convex-dev/component-source` condition

2. **Client Library Layer** (`src/client/`):
   - Runs in the **app context** (not the component)
   - Provides a helper class that wraps component API calls
   - Can access `process.env` and `ctx.auth` from the app
   - Exported via package.json `"."` (main entry point)
   - Example: `ShardedCounter` class with `.add()` and `.count()` methods

3. **React Layer** (`src/react/`):
   - Optional React hooks and components
   - Uses the client library internally
   - Provides optimistic updates and loading states
   - Exported via package.json `"./react"`
   - Example: `useShardedCounter()` hook

**Usage Flow**:
```typescript
// 1. App mounts the component (example/convex/convex.config.ts)
import component from "@samhoque/convex-component-template/convex.config"
app.use(component)

// 2. App creates client wrapper (example/convex/example.ts)
import { ShardedCounter } from "@samhoque/convex-component-template"
const counter = new ShardedCounter(components.shardedCounter)
export const { add, count } = counter.api()

// 3. React component uses the hook (example/src/App.tsx)
import { useShardedCounter } from "@samhoque/convex-component-template/react"
const { count, add } = useShardedCounter(api.example, "myCounter")
```

### Testing Pattern
This project uses `convex-test` with Bun's test runner. **Tests are kept separate from the component source** to prevent Convex from trying to bundle them during development.

#### Component Tests (`test/component/`)
Tests the component functions in isolation.

**Setup** (`test/component/setup.test.ts`):
- Auto-discovers all `.ts` files from `src/component/` using `Bun.Glob`
- Creates a `modules` map for convex-test
- Exports a `convexTest()` helper function
- Preloaded by Bun (configured in `bunfig.toml`)

**Example**:
```ts
import { test, expect } from "bun:test";
import { api } from "../../src/component/_generated/api";
import { convexTest } from "./setup.test";

test("component function works", async () => {
  const t = convexTest();
  const result = await t.query(api.lib.greet, { name: "Alice" });
  expect(result).toBe("Hello, Alice!");
});
```

#### Client Library Tests (`test/client/`)
Tests the client library that wraps the component. This is more complex because it requires **registering the component**.

**Setup** (`test/client/setup.test.ts`):
- Auto-discovers client test files from `test/client/`
- Auto-discovers component files from `src/component/`
- Exports `initConvexTest()` that creates a test instance and registers the component
- Exports a mock `components` object for type-safe testing

**Example**:
```ts
import { test, expect } from "bun:test";
import { ShardedCounter } from "../../src/client/index.js";
import { components, initConvexTest } from "./setup.test.js";

test("client library works", async () => {
  const t = initConvexTest();
  const counter = new ShardedCounter(components.shardedCounter);

  await t.run(async (ctx) => {
    await counter.add(ctx, "test");
    const count = await counter.count(ctx, "test");
    expect(count).toBe(1);
  });
});
```

**Key difference**: Client tests use `t.registerComponent()` to mount the component within the test environment, simulating the real app usage pattern.

## Code Style

### Biome Configuration
- **Indentation**: Tabs (not spaces)
- **Quotes**: Double quotes for JavaScript/TypeScript
- **Imports**: Auto-organized via Biome assist
- **Ignores**: `_generated` directories are excluded from linting/formatting

### TypeScript Configuration
- Strict mode enabled with additional checks:
  - `noUncheckedIndexedAccess: true`
  - `noImplicitOverride: true`
  - `noFallthroughCasesInSwitch: true`
- Module resolution: `bundler` mode
- JSX: `react-jsx` (automatic runtime)

## Important Notes

- **Generated files**: Never edit files in `_generated/` directories - they are auto-generated by Convex
- **Test files**: Place all test files in `test/component/` directory (separate from `src/component/`) to prevent Convex from bundling them during development
- **Component name**: Currently set to `"shardedCounter"` in convex.config.ts - change this for your component
- **Live reloading**: The `--live-component-sources` flag enables hot-reloading during development
- **Build exclusion**: Test files are also excluded from the TypeScript build via `tsconfig.build.json`

## Release Workflow (Changesets)

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing automation.

### When to Add a Changeset

Add a changeset whenever you make user-facing changes:
- ✅ New features (minor bump)
- ✅ Bug fixes (patch bump)
- ✅ Breaking changes (major bump)
- ✅ API changes
- ✅ Dependency updates that affect consumers

Don't add a changeset for:
- ❌ Documentation-only changes
- ❌ Test-only changes
- ❌ Internal refactoring with no API changes
- ❌ CI/build configuration updates
- ❌ Dev dependency updates

### Adding a Changeset (For Contributors)

1. Make your code changes
2. Run the changeset command:
   ```sh
   bun run changeset
   ```
3. Follow the prompts:
   - Select version bump type (patch, minor, or major)
   - Write a summary of your changes
4. A markdown file will be created in `.changeset/` directory
5. Commit both your code changes AND the changeset file:
   ```sh
   git add .
   git commit -m "feat: your feature description"
   ```

**Changeset Summary Guidelines:**
- Write clear, concise descriptions
- Focus on **what** changed and **why**
- Include migration instructions for breaking changes
- Use markdown formatting for readability

**Example changeset file** (`.changeset/brave-lions-dance.md`):
```markdown
---
"@samhoque/convex-component-template": minor
---

Added `useResetCounter` hook for resetting counter values.

You can now reset counters to zero:
\`\`\`tsx
const resetCounter = useResetCounter();
await resetCounter("myCounter");
\`\`\`
```

### Automated Release Process

The release workflow is fully automated via GitHub Actions:

1. **Developer adds changeset** and pushes to a feature branch
2. **PR is created** → `test-and-lint.yml` workflow runs
3. **PR is merged to main** → `release.yml` workflow runs
4. **Release workflow detects changesets** and creates a "Version Packages" PR
5. **Version PR is reviewed** → Check version bumps and CHANGELOG updates
6. **Version PR is merged** → Package is automatically published to npm
7. **GitHub release is created** with release notes

### Manual Release (If Needed)

If you need to publish manually (bypassing automation):

```sh
# 1. Update versions and changelogs from all changesets
bun run ci:version

# 2. Review changes to package.json and CHANGELOG.md
git diff

# 3. Commit the version changes
git add .
git commit -m "chore: version packages"
git push

# 4. Publish to npm (runs tests, build, and validation)
bun run ci:publish
```

### Configuration Files

- **`.changeset/config.json`**: Changesets configuration
  - `access: "public"` - Package is published publicly to npm
  - `changelog: "@changesets/changelog-github"` - Generates changelogs with PR links and contributor attribution
  - `baseBranch: "main"` - Git branch for comparisons

- **`.github/workflows/release.yml`**: GitHub Actions workflow for automated releases
  - Triggers on push to `main` branch
  - Creates version PRs when changesets exist
  - Publishes to npm when version PR is merged
  - Requires `NPM_TOKEN` secret in repository settings

### Setting Up NPM Publishing (One-Time Setup)

For the automated release workflow to publish packages, you need to configure an npm token:

1. Go to [npmjs.com](https://npmjs.com) → Account Settings → Access Tokens
2. Generate a new **Automation** token (bypasses 2FA for CI/CD)
3. Copy the token
4. In GitHub repository: Settings → Secrets and variables → Actions
5. Create new secret named `NPM_TOKEN` with the token value
6. Ensure GitHub Actions has write permissions:
   - Settings → Actions → General → Workflow permissions
   - Select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"

### Viewing Published Versions

After publishing:
- **npm**: `https://www.npmjs.com/package/@samhoque/convex-component-template`
- **GitHub Releases**: `https://github.com/samhoque/convex-component-template/releases`
- **Changelog**: `CHANGELOG.md` in the repository root

### Troubleshooting

**Changesets not detected?**
- Ensure `.changeset/` files are committed and pushed
- Check that changeset files have `.md` extension
- Verify YAML frontmatter is properly formatted

**Version PR not created?**
- Check GitHub Actions tab for workflow errors
- Ensure `GITHUB_TOKEN` has sufficient permissions
- Verify no merge conflicts in the version PR

**Publishing failed?**
- Verify `NPM_TOKEN` is correctly set in repository secrets
- Check npm token hasn't expired (max 90 days for granular tokens)
- Ensure package name isn't already taken on npm
- Run `bun run preversion` locally to catch test/lint failures

**Multiple changesets in one PR?**
- This is fine! All changesets will be consolidated in the version PR
- Each changeset contributes to the overall version bump (highest semver wins)
