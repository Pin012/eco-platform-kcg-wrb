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

export interface PlantRecommendationGroup {
  id: string;
  title: string;
  altitude: string;
  sunlight: string;
  soil: string;
  plants: Array<{
    name: string;
    image: string;
    imageFile: string;
    type: string;
    tags: string[];
    summary: string;
    maintenance: string;
  }>;
}

export interface EcologicalMeasure {
  id: string;
  title: string;
  execution: string[];
  design: string[];
  photos: Array<{ fileName: string; caption: string }>;
}

const parseBulletSection = (block: string, heading: string) => {
  const section = block.match(new RegExp(`^### ${heading}\\s*\\n([\\s\\S]*?)(?=^### |(?![\\s\\S]))`, 'm'))?.[1] ?? '';
  return section
    .split('\n')
    .map((line) => line.match(/^[-*]\s+(.+)$/)?.[1].trim())
    .filter((item): item is string => Boolean(item));
};

export const parseEcoplanMarkdown = (content: string): EcologicalMeasure[] => content
  .split(/\n(?=## )/g)
  .filter((block) => block.startsWith('## '))
  .map((block, index) => {
    const title = block.split('\n', 1)[0].replace(/^##\s+/, '').trim();
    const photos = parseBulletSection(block, '參考照片')
      .map((item) => {
        const [fileName, ...caption] = item.split('｜');
        return { fileName: fileName.trim(), caption: caption.join('｜').trim() };
      })
      .filter((photo) => photo.fileName);

    return {
      id: `measure-${index + 1}`,
      title,
      execution: parseBulletSection(block, '執行重點'),
      design: parseBulletSection(block, '設計建議'),
      photos,
    };
  });

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
