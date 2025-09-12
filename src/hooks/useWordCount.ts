import { useMemo } from 'react';

export function useWordCount(text: string): number {
  return useMemo(() => {
    if (!text.trim()) return 0;
    
    // Count CJK characters using Unicode property
    const cjkMatches = text.match(/\p{Script=Han}/gu);
    const cjkCount = cjkMatches ? cjkMatches.length : 0;
    
    // Count Latin words by removing CJK characters first, then matching words
    const latinText = text.replace(/\p{Script=Han}/gu, ' ');
    const wordMatches = latinText.match(/\b\w+\b/g);
    const wordCount = wordMatches ? wordMatches.length : 0;
    
    return cjkCount + wordCount;
  }, [text]);
}

export function parseTaggedContent(content: string): { meta: Partial<{ id: string; title: string; date: string; description?: string }>, content: string } {
  const lines = content.split('\n');
  const firstLine = lines[0];
  
  // Check if first line contains tags
  const tagPattern = /\[(.+?)\]=(.+?)(?:\s*\|\s*|$)/g;
  const matches = Array.from(firstLine.matchAll(tagPattern));
  
  if (matches.length > 0) {
    const meta: Partial<{ id: string; title: string; date: string; description?: string }> = {};
    
    matches.forEach(match => {
      const key = match[1].trim();
      const value = match[2].trim();
      
      if (key === '編號') meta.id = value;
      else if (key === '標題') meta.title = value;
      else if (key === '日期') meta.date = value;
      else if (key === '說明') meta.description = value;
    });
    
    // Skip first line (tags) and separator line if exists
    let contentStartIndex = 1;
    if (lines[1] === '-----') {
      contentStartIndex = 2;
    }
    
    const contentWithoutTags = lines.slice(contentStartIndex).join('\n');
    return { meta, content: contentWithoutTags };
  }
  
  // No tags found, return original content
  return { meta: {}, content };
}

export function formatTaggedContent(meta: { id: string; title: string; date: string; description?: string }, content: string): string {
  let tagLine = `[編號]=${meta.id} | [標題]=${meta.title} | [日期]=${meta.date}`;
  if (meta.description) {
    tagLine += ` | [說明]=${meta.description}`;
  }
  const separator = '-----';
  return `${tagLine}\n${separator}\n${content}`;
}