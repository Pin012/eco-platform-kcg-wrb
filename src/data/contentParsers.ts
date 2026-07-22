export interface MarkdownFrontmatter {
  [key: string]: string;
}

export interface FAQCategory {
  id: string;
  title: string;
  count: number;
  description: string;
  items: Array<{ question: string; answer: string }>;
}

export interface EcoPlanSection {
  title: string;
  items: string[];
}

export interface EcoPlanMeasure {
  title: string;
  sections: EcoPlanSection[];
}

export const parseFrontmatter = (content: string) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  const data: MarkdownFrontmatter = {};
  if (!match) return { data, body: content.trim() };

  match[1].split('\n').forEach((line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) return;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (key) data[key] = value;
  });

  return { data, body: content.slice(match[0].length).trim() };
};

const readMetaValue = (lines: string[], key: string) => {
  const prefix = `${key}:`;
  const line = lines.find((item) => item.replace(/^[-*]\s+/, '').startsWith(prefix));
  return line?.replace(/^[-*]\s+/, '').slice(prefix.length).trim() ?? '';
};

export const parseFaqMarkdown = (content: string) => {
  const { data, body } = parseFrontmatter(content);
  const categories: FAQCategory[] = [];
  // Content files include a plain-language maintenance guide before the first data block.
  // Only level-2 blocks with an `id` field are data records; guide headings are ignored.
  const categoryBlocks = body
    .split(/\n(?=## )/g)
    .filter((block) => block.startsWith('## ') && /^id:\s*\S+/m.test(block));

  categoryBlocks.forEach((block) => {
    const lines = block.split('\n');
    const title = lines[0].replace(/^##\s+/, '').trim();
    const id = readMetaValue(lines, 'id');
    const description = readMetaValue(lines, 'description');
    const questionsText = block.slice(block.indexOf('\n\n') + 2).trim();
    const items = questionsText
      .split(/\n(?=### )/g)
      .filter((itemBlock) => itemBlock.startsWith('### '))
      .map((itemBlock) => {
        const [questionLine, ...answerLines] = itemBlock.split('\n');
        return {
          question: questionLine.replace(/^###\s+/, '').trim(),
          answer: answerLines.join('\n').trim(),
        };
      });

    categories.push({ id, title, description, items, count: items.length });
  });

  return { meta: data, categories };
};

export const parseEcoPlanMarkdown = (content: string) => {
  const { data, body } = parseFrontmatter(content);
  const pageTitle = body.match(/^#\s+(.+)$/m)?.[1].trim() ?? '';
  const measures: EcoPlanMeasure[] = body
    .split(/\n(?=## )/g)
    .filter((block) => block.startsWith('## '))
    .map((block) => {
      const [heading, ...contentLines] = block.split('\n');
      const sections: EcoPlanSection[] = [];
      let currentSection: EcoPlanSection | undefined;

      contentLines.forEach((line) => {
        if (line.startsWith('### ')) {
          currentSection = { title: line.replace(/^###\s+/, '').trim(), items: [] };
          sections.push(currentSection);
        } else if (currentSection && /^[-*]\s+/.test(line)) {
          currentSection.items.push(line.replace(/^[-*]\s+/, '').trim());
        }
      });

      return { title: heading.replace(/^##\s+/, '').trim(), sections };
    });

  return { meta: data, pageTitle, measures };
};
