import { execFileSync } from 'node:child_process';

const output = execFileSync('git', ['ls-files'], { encoding: 'utf8' });
const matches = output
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((file) => /(^|\/)(yarn\.lock|package-lock\.json)$/.test(file));

if (matches.length > 0) {
  console.error(
    [
      'Do not commit package manager lockfiles in this repo:',
      ...matches.map((file) => `- ${file}`),
      '',
      'Remove them from the index before committing.',
    ].join('\n')
  );
  process.exit(1);
}
