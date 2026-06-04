import { unified } from 'unified';
import remarkParse from 'remark-parse';

const messy = '* This is a long list item that\nwas hard-wrapped by the terminal.';

const tree = unified().use(remarkParse).parse(messy);
console.log(JSON.stringify(tree, null, 2));
