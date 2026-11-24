const fs = require('fs');
const crypto = require('crypto');

// The office joke — exactly 95 characters including the em dash (U+2014)
const JOKE = 'My open-door policy is working — since I moved my desk to the doorway, nobody walks in anymore.';

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

try {
  fs.mkdirSync(outDir, { recursive: true });
} catch (err) {
  console.error(`Failed to create output directory ${outDir}:`, err.message);
  process.exit(1);
}

const outPath = `${outDir}/entry.txt`;

try {
  // Write without trailing newline (writeFileSync does not append one)
  fs.writeFileSync(outPath, JOKE, 'utf8');
} catch (err) {
  console.error(`Failed to write ${outPath}:`, err.message);
  process.exit(1);
}

const hash = crypto.createHash('sha256').update(JOKE).digest('hex');
console.log(`Wrote: ${outPath}`);
console.log(`Chars: ${JOKE.length}`);
console.log(`SHA256: ${hash}`);