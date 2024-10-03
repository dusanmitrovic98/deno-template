# Version Bump Usage Guide

## Prerequisites
Ensure you have a `package.json` in your project root with a version field:
```json
{
  "name": "your-project-name",
  "version": "1.0.0"
}
```

## Basic Usage

### 1. Patch Version (for bug fixes)
Increments the third number (1.0.0 -> 1.0.1)
```bash
deno task version:patch
```

### 2. Minor Version (for new features)
Increments the second number and resets patch (1.0.1 -> 1.1.0)
```bash
deno task version:minor
```

### 3. Major Version (for breaking changes)
Increments the first number and resets others (1.1.0 -> 2.0.0)
```bash
deno task version:major
```

### 4. Rollback (if you made a mistake)
Reverts to the previous version
```bash
deno task version:rollback
```

## Example Workflow

1. Starting point: 1.0.0

2. Add a new feature:
   ```bash
   deno task version:minor
   # Version bumped from 1.0.0 to 1.1.0
   ```

3. Fix a bug in that feature:
   ```bash
   deno task version:patch
   # Version bumped from 1.1.0 to 1.1.1
   ```

4. Oops, that was unnecessary:
   ```bash
   deno task version:rollback
   # Version rolled back to 1.1.0
   ```

5. Make breaking changes:
   ```bash
   deno task version:major
   # Version bumped from 1.1.0 to 2.0.0
   ```

## Release Workflow
The `release` task will bump the patch version and run your build and git tasks:
```bash
deno task release
# This will:
# 1. Bump patch version
# 2. Run build
# 3. Commit and push changes
```

## Notes
- Version history is stored in `.version-history.json` in your project root
- The history keeps track of the last 5 versions
- The version is always synchronized between `package.json` and `.version-history.json`

## Common Patterns

1. For regular bug fixes:
   ```bash
   deno task version:patch
   ```

2. For new features:
   ```bash
   deno task version:minor
   ```

3. For breaking changes:
   ```bash
   deno task version:major
   ```

4. For a complete release:
   ```bash
   deno task release
   ```