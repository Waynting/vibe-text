import { DocumentState } from '@/types';
import { parseTaggedContent, formatTaggedContent } from '@/hooks/useWordCount';
import { parseMarkdownWithFrontmatter, formatMarkdownWithFrontmatter } from './markdownOperations';

// Check if running in Tauri environment
const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__;

// Lazy load Tauri APIs
const getTauriApis = async () => {
  if (isTauri) {
    const { open, save } = await import('@tauri-apps/api/dialog');
    const { readTextFile, writeTextFile } = await import('@tauri-apps/api/fs');
    return { open, save, readTextFile, writeTextFile };
  }
  throw new Error('Tauri APIs not available');
};

export async function openFile(): Promise<{ content: string; filePath: string; meta: Partial<{ id: string; title: string; date: string; description: string }> } | null> {
  try {
    if (isTauri) {
      const { open, readTextFile } = await getTauriApis();
      
      const filePath = await open({
        title: '開啟文件',
        filters: [
          {
            name: 'Markdown Files',
            extensions: ['md']
          },
          {
            name: 'Text Files',
            extensions: ['txt']
          },
          {
            name: 'All Files',
            extensions: ['*']
          }
        ],
        multiple: false
      });

      if (!filePath || Array.isArray(filePath)) {
        return null;
      }

      const fileContent = await readTextFile(filePath);
      
      let parsedResult;
      if (filePath.endsWith('.md')) {
        parsedResult = parseMarkdownWithFrontmatter(fileContent);
      } else {
        parsedResult = parseTaggedContent(fileContent);
      }
      
      const { meta, content } = parsedResult;

      return {
        content,
        filePath,
        meta
      };
    } else {
      // Fallback for web environment
      const result = await openTextFileInput();
      if (!result) return null;
      
      let parsedResult;
      if (result.filename.endsWith('.md')) {
        parsedResult = parseMarkdownWithFrontmatter(result.content);
      } else {
        parsedResult = parseTaggedContent(result.content);
      }
      
      const { meta, content } = parsedResult;
      return {
        content,
        filePath: `web:${result.filename}`, // 標記為瀏覽器檔案，不是真實路徑
        meta
      };
    }
  } catch (error) {
    console.error('Failed to open file:', error);
    throw new Error(`開啟檔案失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
  }
}

export async function saveFile(
  document: DocumentState, 
  useTaggedFormat: boolean = false,
  customFileName?: string,
  format: 'txt' | 'md' = 'md'
): Promise<string | null> {
  try {
    // Prepare content for saving
    let contentToSave = document.content;
    
    if (format === 'md') {
      contentToSave = formatMarkdownWithFrontmatter(
        document.meta,
        document.content
      );
    } else if (useTaggedFormat) {
      contentToSave = formatTaggedContent(
        {
          id: document.meta.id,
          title: document.meta.title,
          date: document.meta.date,
          description: document.meta.description
        },
        document.content
      );
    }

    if (isTauri) {
      const { save, writeTextFile } = await getTauriApis();
      let filePath = document.filePath;

      // If no existing file path, show save dialog
      if (!filePath) {
        const defaultName = customFileName || document.fileName || document.meta.title || 'untitled';
        const selectedPath = await save({
          title: '儲存文件',
          filters: [
            {
              name: 'Markdown Files',
              extensions: ['md']
            },
            {
              name: 'Text Files',
              extensions: ['txt']
            }
          ],
          defaultPath: `${defaultName}.${format}`
        });

        if (!selectedPath) {
          return null; // User cancelled
        }

        filePath = selectedPath;
      }

      // Write file
      await writeTextFile(filePath, contentToSave);
      
      console.log(`File saved successfully to: ${filePath}`);
      return filePath;
    } else {
      // Fallback for web environment
      const defaultName = customFileName || document.fileName || document.meta.title || 'untitled';
      const filename = document.filePath || `${defaultName}.${format}`;
      downloadTextFile(contentToSave, filename);
      return filename;
    }

  } catch (error) {
    console.error('Failed to save file:', error);
    throw new Error(`儲存檔案失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
  }
}

export async function saveAsFile(
  document: DocumentState,
  useTaggedFormat: boolean = false,
  customFileName?: string,
  format: 'txt' | 'md' = 'md'
): Promise<string | null> {
  try {
    // Prepare content for saving
    let contentToSave = document.content;
    
    if (format === 'md') {
      contentToSave = formatMarkdownWithFrontmatter(
        document.meta,
        document.content
      );
    } else if (useTaggedFormat) {
      contentToSave = formatTaggedContent(
        {
          id: document.meta.id,
          title: document.meta.title,
          date: document.meta.date,
          description: document.meta.description
        },
        document.content
      );
    }

    if (isTauri) {
      const { save, writeTextFile } = await getTauriApis();
      
      const filePath = await save({
        title: '另存文件',
        filters: [
          {
            name: 'Markdown Files',
            extensions: ['md']
          },
          {
            name: 'Text Files',
            extensions: ['txt']
          }
        ],
        defaultPath: `${customFileName || document.fileName || document.meta.title || 'untitled'}.${format}`
      });

      if (!filePath) {
        return null; // User cancelled
      }

      // Write file
      await writeTextFile(filePath, contentToSave);
      
      console.log(`File saved as: ${filePath}`);
      return filePath;
    } else {
      // Fallback for web environment
      const filename = `${customFileName || document.fileName || document.meta.title || 'untitled'}.${format}`;
      downloadTextFile(contentToSave, filename);
      return filename;
    }

  } catch (error) {
    console.error('Failed to save file as:', error);
    throw new Error(`另存檔案失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
  }
}

// Fallback file operations for non-Tauri environments
export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function openTextFileInput(): Promise<{ content: string; filename: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve({
          content,
          filename: file.name
        });
      };
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    };

    input.click();
  });
}