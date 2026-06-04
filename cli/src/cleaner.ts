import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';

function preProcessMarkdown(text: string): string {
  text = text.replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  let inFenced = false;
  const processed: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('```') || line.trim().startsWith('~~~')) {
      inFenced = !inFenced;
      processed.push(line);
      continue;
    }
    
    if (inFenced) {
      processed.push(line);
      continue;
    }
    
    const trimmed = line.trimStart();
    if (trimmed === '') {
      processed.push('');
      continue;
    }
    
    const isListItem = /^(\*|-|\d+\.)\s/.test(trimmed);
    const isHeading = /^#+\s/.test(trimmed);
    const isBlockquote = /^>\s/.test(trimmed);
    const isHtml = /^<[a-zA-Z\/]/.test(trimmed);
    
    const prevLine = processed.length > 0 ? processed[processed.length - 1] : '';
    const prevIsHeading = /^#+\s/.test(prevLine.trimStart());
    const prevIsEmpty = prevLine.trim() === '';
    const prevIsListItem = /^(\*|-|\d+\.)\s/.test(prevLine.trimStart());
    
    if (!isListItem && !isHeading && !isBlockquote && !isHtml) {
      if (!prevIsEmpty && !prevIsHeading) {
        processed[processed.length - 1] += ' ' + trimmed;
      } else {
        processed.push(trimmed);
      }
    } else if (isListItem) {
      if (!prevIsListItem && !prevIsEmpty && !prevIsHeading) {
         processed.push('');
      }
      const indentMatch = line.match(/^\s+/);
      const indentStr = indentMatch ? indentMatch[0] : '';
      const safeIndent = indentStr.replace(/    /g, '  ');
      processed.push(safeIndent + trimmed);
    } else {
      processed.push(trimmed);
    }
  }
  
  return processed.join('\n');
}

export function fixIndentedCodeBlocks(tree: any, file: any) {
  const fileContent = String(file.value);

  function walk(node: any, parent: any, index: number) {
    if (node.type === 'code' && !node.lang && node.position) {
      const startOffset = node.position.start.offset;
      const endOffset = node.position.end.offset;
      const originalText = fileContent.substring(startOffset, endOffset);
      
      if (!originalText.trimStart().startsWith('```') && !originalText.trimStart().startsWith('~~~')) {
        const parsed = unified().use(remarkParse).parse(node.value);
        fixIndentedCodeBlocks(parsed, { value: node.value });
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

export async function cleanMarkdown(input: string): Promise<string> {
  const preProcessed = preProcessMarkdown(input);

  const processor = unified()
    .use(remarkParse)
    .use(() => (tree: any) => {
      fixIndentedCodeBlocks(tree, { value: preProcessed });
    })
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
