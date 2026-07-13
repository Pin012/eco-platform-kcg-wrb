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
    type: string;
    tags: string[];
    summary: string;
    maintenance: string;
  }>;
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
  return lines.find((line) => line.startsWith(prefix))?.slice(prefix.length).trim() ?? '';
};

export const parseFaqMarkdown = (content: string) => {
  const { data, body } = parseFrontmatter(content);
  const categories: FAQCategory[] = [];
  const categoryBlocks = body.split(/\n(?=## )/g).filter(Boolean);

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

export const parsePlantMarkdown = (content: string) => {
  const { data, body } = parseFrontmatter(content);
  const groups: PlantRecommendationGroup[] = body
    .split(/\n(?=## )/g)
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n');
      const title = lines[0].replace(/^##\s+/, '').trim();
      const firstPlantIndex = lines.findIndex((line) => line.startsWith('### '));
      const metaLines = firstPlantIndex === -1 ? lines : lines.slice(0, firstPlantIndex);
      const plantText = firstPlantIndex === -1 ? '' : lines.slice(firstPlantIndex).join('\n');
      const plants = plantText
        .split(/\n(?=### )/g)
        .filter(Boolean)
        .map((plantBlock) => {
          const plantLines = plantBlock.split('\n');
          return {
            name: plantLines[0].replace(/^###\s+/, '').trim(),
            image: readMetaValue(plantLines, '- image'),
            type: readMetaValue(plantLines, '- type'),
            tags: readMetaValue(plantLines, '- tags').split('、').map((tag) => tag.trim()).filter(Boolean),
            summary: readMetaValue(plantLines, '- summary'),
            maintenance: readMetaValue(plantLines, '- maintenance'),
          };
        });

      return {
        id: readMetaValue(metaLines, 'id'),
        title,
        altitude: readMetaValue(metaLines, 'altitude'),
        sunlight: readMetaValue(metaLines, 'sunlight'),
        soil: readMetaValue(metaLines, 'soil'),
        plants,
      };
    });

  return { meta: data, groups };
};
