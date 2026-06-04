import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';

const messy = ` This is a paragraph.
 
 * Bullet 1
   * Bullet 1.1
`;

const processor = unified()
  .use(remarkParse)
  .use(remarkStringify, { bullet: '*' });

processor.process(messy).then((file) => console.log(String(file)));
