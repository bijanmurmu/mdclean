import { unified } from 'unified';
import remarkParse from 'remark-parse';

const messy = 'Line 1  \nLine 2';

const tree = unified().use(remarkParse).parse(messy);
console.log(JSON.stringify(tree, null, 2));
