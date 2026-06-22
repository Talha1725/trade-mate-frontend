import { execFileSync } from 'node:child_process';

try {
  execFileSync('git', ['config', 'core.hooksPath', '.githooks'], {
    stdio: 'ignore',
  });
} catch {
  process.exit(0);
}
