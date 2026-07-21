import issuesContent from '../content/issues.md?raw';

type Issue = {
  title: string;
  description: string;
  principle: string[];
};

type IssueRecord = {
  facilities: string;
  type: string;
  introduction: string;
  sensitivity: string;
  group: string;
  habitat: string[];
  species: string[];
  issues: Issue[];
};

const splitList = (value: string) =>
  value.split('、').map(item => item.trim()).filter(Boolean);

const fieldValue = (line: string, label: string) => {
  const prefix = `- ${label}：`;
  return line.startsWith(prefix) ? line.slice(prefix.length).trim() : undefined;
};

const parseIssues = (content: string): IssueRecord[] => {
  const records: IssueRecord[] = [];
  let record: IssueRecord | undefined;
  let issue: Issue | undefined;
  let readingPrinciples = false;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (line.startsWith('## ')) {
      const [facilities, type] = line.slice(3).split('｜').map(value => value.trim());
      if (!facilities || !type) continue;

      record = {
        facilities,
        type,
        introduction: '',
        sensitivity: '',
        group: '',
        habitat: [],
        species: [],
        issues: [],
      };
      records.push(record);
      issue = undefined;
      readingPrinciples = false;
      continue;
    }

    if (!record) continue;

    if (line.startsWith('### ')) {
      issue = { title: line.slice(4).trim(), description: '', principle: [] };
      record.issues.push(issue);
      readingPrinciples = false;
      continue;
    }

    if (line === '#### 生態保育原則') {
      readingPrinciples = true;
      continue;
    }

    if (issue) {
      const description = fieldValue(line, '議題說明');
      if (description !== undefined) issue.description = description;
      else if (readingPrinciples && line.startsWith('- ')) issue.principle.push(line.slice(2).trim());
      continue;
    }

    const introduction = fieldValue(line, '設施簡介');
    const sensitivity = fieldValue(line, '敏感程度');
    const group = fieldValue(line, '關注團體');
    const habitat = fieldValue(line, '棲地');
    const species = fieldValue(line, '物種');

    if (introduction !== undefined) record.introduction = introduction;
    else if (sensitivity !== undefined) record.sensitivity = sensitivity;
    else if (group !== undefined) record.group = group;
    else if (habitat !== undefined) record.habitat = splitList(habitat);
    else if (species !== undefined) record.species = splitList(species);
  }

  return records;
};

export const issuesData = parseIssues(issuesContent);
