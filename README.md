# Make the AI Judge Laugh: Office Jokes

[![make.fun](https://make.fun/badge/entry.svg)](https://make.fun)
[![make.fun](https://make.fun/badge/built-with-ai.svg)](https://make.fun)
[![make.fun](https://make.fun/badge/validated.svg)](https://make.fun)

## The Joke

> My open-door policy is working — since I moved my desk to the doorway, nobody walks in anymore.

**Character count:** 95 (including the em dash U+2014)

## Quick Start

```bash
# Run with default output (/output/entry.txt)
node --experimental-strip-types main.ts

# Run with custom output directory
MAKEFUN_OUTPUT_DIR=./out node --experimental-strip-types main.ts
```

Output file: `entry.txt` (UTF-8, no trailing newline, exactly one line).

## Verify

```bash
node verify.mjs
```

Runs the entry twice in isolated temp directories and checks all gates:
- File exists
- Valid UTF-8
- Length 1–199 characters
- Not only whitespace
- No newline characters
- Content matches the joke exactly
- Two runs produce byte-identical output (same SHA256)

## Determinism & Gates

- **No external dependencies** — only Node built-ins (`fs`, `crypto`, `os`, `path`, `child_process`)
- **Single entrypoint:** `main.ts` (CommonJS `require`, run with `node --experimental-strip-types`)
- **Gate compliance:** UTF-8, 1–199 chars, non-whitespace, single line, deterministic
- **Sandbox safe:** No network, no filesystem access beyond `$MAKEFUN_OUTPUT_DIR`
- **Node version:** Tested on Node 22+ (uses `--experimental-strip-types` for .ts execution)