import * as yaml from 'js-yaml';
import { DocMeta } from '@/types';

export function parseMarkdownWithFrontmatter(content: string): { meta: Partial<DocMeta>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (match) {
    try {
      const yamlContent = match[1];
      const markdownContent = match[2];
      const parsedYaml = yaml.load(yamlContent) as any;

      const meta: Partial<DocMeta> = {
        title: parsedYaml.title || '未命名',
        date: parsedYaml.date || new Date().toISOString(),
        description: parsedYaml.description,
        categories: parsedYaml.categories || [],
        summary: parsedYaml.summary,
        slug: parsedYaml.slug,
        id: parsedYaml.id
      };

      return { meta, content: markdownContent };
    } catch (error) {
      console.error('Failed to parse YAML frontmatter:', error);
    }
  }

  return { meta: {}, content };
}

export function formatMarkdownWithFrontmatter(meta: DocMeta, content: string): string {
  const yamlData: any = {
    title: meta.title,
    date: meta.date,
  };

  if (meta.categories && meta.categories.length > 0) {
    yamlData.categories = meta.categories;
  }

  if (meta.summary) {
    yamlData.summary = meta.summary;
  }

  if (meta.slug) {
    yamlData.slug = meta.slug;
  }

  if (meta.description) {
    yamlData.description = meta.description;
  }

  if (meta.id) {
    yamlData.id = meta.id;
  }

  const yamlString = yaml.dump(yamlData, {
    lineWidth: -1,
    quotingType: '"',
    forceQuotes: false,
    styles: {
      '!!seq': 'flow' // 使用 flow style 讓陣列顯示為 ["感性", "鄉愁"] 格式
    }
  });

  return `---\n${yamlString}---\n${content}`;
}