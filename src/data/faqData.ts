import faqMarkdown from '../content/faq.md?raw';
import { parseFaqMarkdown } from './contentParsers';

const parsedFaq = parseFaqMarkdown(faqMarkdown);

export const faqMeta = parsedFaq.meta;
export const faqData = parsedFaq.categories;
