# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Moved `convex` and `react` to `peerDependencies` to prevent version conflicts

### Added
- Added `@arethetypeswrong/cli` for package validation
- Added `attw` script for validating package exports

## [0.1.0] - 2025-10-24

### Added
- Initial release of the Convex component template
- Sharded counter component implementation
- React hooks for component integration (`useShardedCounter`, `useIncrementCounter`, `useCounterValue`)
- Complete Convex component architecture with example app
- GitHub Actions workflow with `pkg.pr.new` integration
- Lefthook for automated pre-commit checks
- Biome for linting and formatting
- Comprehensive test suite using `convex-test`
- TypeScript support with strict mode
- Bun-based development workflow
- Live component sources for hot-reloading during development

### Documentation
- README with setup and usage instructions
- CLAUDE.md for AI-assisted development guidance
- Example app demonstrating component usage

[Unreleased]: https://github.com/samhoque/convex-component-template/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/samhoque/convex-component-template/releases/tag/v0.1.0
