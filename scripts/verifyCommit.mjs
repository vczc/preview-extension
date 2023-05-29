import chalk from 'chalk';
import { readFileSync } from 'fs';
import path from 'path';
import process from 'process';

const msgPath = path.resolve('.git/COMMIT_EDITMSG');
const msg = readFileSync(msgPath, 'utf-8').trim();

const commitRE = /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/;

if (!commitRE.test(msg)) {
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`提交格式无效`)}\n\n` +
      chalk.red(`请根据给出例子的格式编辑commit信息:\n\n`) +
      `    ${chalk.green(`feat: 描述信息`)}\n` +
      `    ${chalk.green(`fix: 描述信息`)}\n\n`
  );
  process.exit(1);
}
