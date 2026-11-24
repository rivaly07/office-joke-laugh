#!/usr/bin/env node
import { spawnSync } from 'child_process';
import { mkdirSync, rmSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { createHash } from 'crypto';

const JOKE = 'My open-door policy is working — since I moved my desk to the doorway, nobody walks in anymore.';

function runOnce(dir) {
  const env = { ...process.env, MAKEFUN_OUTPUT_DIR: dir };
  const result = spawnSync('node', ['--experimental-strip-types', 'main.ts'], {
    cwd: process.cwd(),
    env,
    encoding: 'utf8',
  });
  return result;
}

function checkFile(path) {
  const content = readFileSync(path, 'utf8');
  const checks = {
    exists: true,
    utf8Valid: true,
    lengthOk: content.length >= 1 && content.length <= 199,
    notWhitespace: content.trim().length > 0,
    noNewline: !content.includes('\n'),
    contentMatches: content === JOKE,
  };
  return { content, checks };
}

const tmp1 = join(tmpdir(), `mf-verify-${Date.now()}-1`);
const tmp2 = join(tmpdir(), `mf-verify-${Date.now()}-2`);

mkdirSync(tmp1, { recursive: true });
mkdirSync(tmp2, { recursive: true });

try {
  console.log('Running first execution...');
  const r1 = runOnce(tmp1);
  if (r1.status !== 0) {
    console.error('FAIL: First run exited with code', r1.status);
    console.error(r1.stderr);
    process.exit(1);
  }

  console.log('Running second execution...');
  const r2 = runOnce(tmp2);
  if (r2.status !== 0) {
    console.error('FAIL: Second run exited with code', r2.status);
    console.error(r2.stderr);
    process.exit(1);
  }

  const f1 = join(tmp1, 'entry.txt');
  const f2 = join(tmp2, 'entry.txt');

  const { content: c1, checks: ch1 } = checkFile(f1);
  const { content: c2, checks: ch2 } = checkFile(f2);

  const hash1 = createHash('sha256').update(c1).digest('hex');
  const hash2 = createHash('sha256').update(c2).digest('hex');
  const byteIdentical = hash1 === hash2;

  const allChecks = [
    { name: 'File exists (run 1)', pass: ch1.exists },
    { name: 'File exists (run 2)', pass: ch2.exists },
    { name: 'UTF-8 valid (run 1)', pass: ch1.utf8Valid },
    { name: 'UTF-8 valid (run 2)', pass: ch2.utf8Valid },
    { name: 'Length 1-199 (run 1)', pass: ch1.lengthOk },
    { name: 'Length 1-199 (run 2)', pass: ch2.lengthOk },
    { name: 'Not only whitespace (run 1)', pass: ch1.notWhitespace },
    { name: 'Not only whitespace (run 2)', pass: ch2.notWhitespace },
    { name: 'No newline (run 1)', pass: ch1.noNewline },
    { name: 'No newline (run 2)', pass: ch2.noNewline },
    { name: 'Content matches JOKE (run 1)', pass: ch1.contentMatches },
    { name: 'Content matches JOKE (run 2)', pass: ch2.contentMatches },
    { name: 'Two runs byte-identical', pass: byteIdentical },
  ];

  console.log('\n=== Verification Results ===');
  let allPass = true;
  for (const c of allChecks) {
    const status = c.pass ? 'PASS' : 'FAIL';
    if (!c.pass) allPass = false;
    console.log(`  ${status}: ${c.name}`);
  }

  console.log(`\nRun 1: ${c1.length} chars, SHA256: ${hash1}`);
  console.log(`Run 2: ${c2.length} chars, SHA256: ${hash2}`);

  if (allPass) {
    console.log('\n=== ALL 13 CHECKS PASS ===');
    process.exit(0);
  } else {
    console.log('\n=== SOME CHECKS FAILED ===');
    process.exit(1);
  }
} finally {
  rmSync(tmp1, { recursive: true, force: true });
  rmSync(tmp2, { recursive: true, force: true });
}