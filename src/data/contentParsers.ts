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

export interface PlantingSuggestionContent {
  river: string;
  section: string;
  purpose: string;
  habitat: string[];
  native: string[];
  ecosystem: string[];
  condition: string;
  risk: string[];
  cards: Array<{
    title: string;
    imageFile: string;
    type: string;
    spacing: string;
    manage: string;
    note: string;
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

export const parsePlantMarkdown = (content: string) => {
  const { data, body } = parseFrontmatter(content);
  const splitList = (value: string) => value.split('、').map((item) => item.trim()).filter(Boolean);
  const suggestions: PlantingSuggestionContent[] = body
    .split(/\n(?=## )/g)
    // A data heading contains exactly three parts; maintenance-guide headings are ignored.
    .filter((block) => block.startsWith('## ') && block.split('\n', 1)[0].replace(/^##\s+/, '').split('｜').length === 3)
    .map((block) => {
      const lines = block.split('\n');
      const [river, section, purpose] = lines[0].replace(/^##\s+/, '').split('｜').map((value) => value.trim());
      return {
        river,
        section,
        purpose,
        habitat: splitList(readMetaValue(lines, '棲地類型')),
        native: splitList(readMetaValue(lines, '溪濱原生植物舉例')),
        ecosystem: splitList(readMetaValue(lines, '生態系統服務')),
        condition: readMetaValue(lines, '適合環境條件'),
        risk: splitList(readMetaValue(lines, '未來潛在風險')),
        cards: [{
          title: readMetaValue(lines, '卡片標題'),
          imageFile: readMetaValue(lines, '圖片檔名'),
          type: readMetaValue(lines, '綠美化建議植栽類型'),
          spacing: readMetaValue(lines, '栽植間距'),
          manage: readMetaValue(lines, '其他管理措施'),
          note: readMetaValue(lines, '備註'),
        }],
      };
    });

  return { meta: data, suggestions };
};
