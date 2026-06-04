import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';

// Fix the issue where copying from AI/terminals adds 1 leading space to every single line
function fixGlobalIndentation(text: string): string {
  const lines = text.split('\n');
  const nonEmptyLines = lines.filter(l => l.trim().length > 0);
  if (nonEmptyLines.length === 0) return text;
  
  // Check if ALL non-empty lines start with at least one space
  const allIndented = nonEmptyLines.every(l => l.startsWith(' '));
  if (allIndented) {
    return lines.map(l => l.startsWith(' ') ? l.substring(1) : l).join('\n');
  }
  return text;
}

// AST Plugin to join hard-wrapped lines inside paragraphs
function unwrapParagraphs() {
  return (tree: any) => {
    visit(tree, 'paragraph', (node: any) => {
      visit(node, 'text', (textNode: any) => {
        // Replace internal newlines in paragraph text with spaces
        textNode.value = textNode.value.replace(/\n/g, ' ');
      });
    });
  };
}

export async function cleanMarkdown(input: string): Promise<string> {
  const preProcessed = fixGlobalIndentation(input.replace(/\r\n/g, '\n'));

  const processor = unified()
    .use(remarkParse)
    .use(unwrapParagraphs)
    .use(remarkStringify, {
      bullet: '*',
      emphasis: '*',
      strong: '*',
      listItemIndent: 'one',
      rule: '-',
    });

  const file = await processor.process(preProcessed);
  return String(file).trim() + '\n';
}

import remarkHtml from 'remark-html';

export async function renderHtml(input: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkHtml, { sanitize: false });
  const file = await processor.process(input);
  return String(file);
}
