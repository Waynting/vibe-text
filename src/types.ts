export interface DocMeta {
  id: string;
  title: string;
  date: string;
  wordCount: number;
  description?: string;
  categories?: string[];
  summary?: string;
  slug?: string;
}

export interface DocumentState {
  meta: DocMeta;
  content: string;
  filePath?: string;
  fileName?: string;
  isDirty: boolean;
}

export interface ExportOptions {
  type: 'png' | 'jpeg';
  scale: number;
  quality?: number;
}

export type TextDirection = 'rtl' | 'ltr'; // Right-to-Left or Left-to-Right

export interface ViewSettings {
  direction: TextDirection; // 文字方向
}


