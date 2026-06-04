#!/usr/bin/env node

import { program } from 'commander';
import clipboardy from 'clipboardy';
import { cleanMarkdown } from './cleaner.js';
import * as readline from 'readline';

function wrapText(text: string, maxLen: number): string[] {
  const lines: string[] = [];
  for (const line of text.split('\n')) {
    if (line.length <= maxLen) {
      lines.push(line);
    } else {
      let current = line;
      while (current.length > maxLen) {
        lines.push(current.substring(0, maxLen));
        current = current.substring(maxLen);
      }
      lines.push(current);
    }
  }
  return lines;
}

function drawBox(title: string, content: string) {
  const termWidth = process.stdout.columns || 80;
  const contentLines = content.split('\n');
  const maxContentLen = Math.max(title.length, ...contentLines.map(l => l.length));
  const width = Math.min(termWidth, Math.max(50, maxContentLen + 4));
  const innerWidth = width - 4;

  const wrappedLines = wrapText(content, innerWidth);

  const top = '┌' + '─'.repeat(width - 2) + '┐';
  const titlePadded = '│ ' + title.padEnd(innerWidth, ' ').substring(0, innerWidth) + ' │';
  const mid = '├' + '─'.repeat(width - 2) + '┤';
  const bottom = '└' + '─'.repeat(width - 2) + '┘';

  console.log(top);
  console.log(titlePadded);
  console.log(mid);
  for (const line of wrappedLines) {
    console.log('│ ' + line.padEnd(innerWidth, ' ') + ' │');
  }
  console.log(bottom);
}

async function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk: Buffer | string) => data += chunk);
    process.stdin.on('end', () => resolve(data));
  });
}

program
  .name('mdclean')
  .description('Markdown Repair CLI - Fixes messy copied Markdown')
  .version('1.0.0')
  .option('-c, --clipboard', 'Read from clipboard, clean, and write back')
  .option('--ai', 'Special mode for AI CLI output fixer')
  .action(async (options) => {
    try {
      if (!process.stdin.isTTY) {
        // Piped input
        const input = await readStdin();
        if (input.trim()) {
          const cleaned = await cleanMarkdown(input);
          process.stdout.write(cleaned);
          return;
        }
      }

      if (options.clipboard || options.ai) {
        const input = clipboardy.readSync();
        if (!input) {
          console.error('Clipboard is empty.');
          process.exit(1);
        }
        const cleaned = await cleanMarkdown(input);
        clipboardy.writeSync(cleaned);
        console.log('✨ Clipboard markdown cleaned and updated!');
        return;
      }

      // TUI Mode
      const input = clipboardy.readSync();
      if (!input) {
        console.log('Clipboard is empty. Try copying some markdown first or pipe it.');
        return;
      }

      const cleaned = await cleanMarkdown(input);
      drawBox('Original', input);
      console.log('');
      drawBox('Cleaned', cleaned);

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('\nWrite cleaned markdown to clipboard? [Y/n] ', (answer: string) => {
        if (answer.toLowerCase() !== 'n') {
          clipboardy.writeSync(cleaned);
          console.log('✨ Written to clipboard!');
        }
        rl.close();
      });

    } catch (err) {
      console.error('Error:', err);
      process.exit(1);
    }
  });

program.parse();
