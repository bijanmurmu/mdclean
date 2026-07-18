import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import remarkHtml from 'remark-html';

function fixGlobalIndentation(text: string): string {
  const lines = text.split('\n');
  const nonEmptyLines = lines.filter(l => l.trim().length > 0);
  if (nonEmptyLines.length === 0) return text;
  
  let minIndent = Infinity;
  for (const line of nonEmptyLines) {
    const match = line.match(/^ +/);
    if (match) {
      minIndent = Math.min(minIndent, match[0].length);
    } else {
      minIndent = 0;
      break;
    }
  }

  if (minIndent > 0) {
    return lines.map(l => l.length > 0 ? l.substring(minIndent) : l).join('\n');
  }
  return text;
}

export function fixIndentedCodeBlocks(tree: any, fileContent: string) {
  function walk(node: any, parent: any, index: number) {
    if (node.type === 'code' && !node.lang && node.position) {
      const startOffset = node.position.start.offset;
      const endOffset = node.position.end.offset;
      const originalText = fileContent.substring(startOffset, endOffset);
      
      if (!originalText.trimStart().startsWith('```') && !originalText.trimStart().startsWith('~~~')) {
        const parsed = unified().use(remarkParse).parse(node.value);
        fixIndentedCodeBlocks(parsed, node.value);
        if (parent && parent.children) {
            parent.children.splice(index, 1, ...parsed.children);
            return true;
        }
      }
    }

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        if (walk(node.children[i], node, i)) {
          i--;
        }
      }
    }
    return false;
  }
  
  walk(tree, null, 0);
}

function unwrapParagraphs() {
  return (tree: any) => {
    visit(tree, 'paragraph', (node: any) => {
      visit(node, 'text', (textNode: any) => {
        textNode.value = textNode.value.replace(/\n(?!\s*\|)/g, ' ');
      });
    });
  };
}

export async function cleanMarkdown(input: string): Promise<string> {
  const preProcessed = fixGlobalIndentation(input.replace(/\r\n/g, '\n'));

  const processor = unified()
    .use(remarkParse)
    .use(() => (tree: any) => {
      fixIndentedCodeBlocks(tree, preProcessed);
    })
    .use(remarkGfm)
    .use(unwrapParagraphs)
    .use(remarkStringify, {
      bullet: '*',
      emphasis: '*',
      strong: '*',
      listItemIndent: 'one',
      rule: '-',
    });

  const file = await processor.process(preProcessed);
  return String(file).trim().replace(/\\_/g, '_').replace(/\\\|/g, '|') + '\n';
}

export async function renderHtml(input: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkHtml, { sanitize: false });
  const file = await processor.process(input);
  return String(file);
}
