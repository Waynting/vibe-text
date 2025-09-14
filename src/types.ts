export interface DocMeta {
  id: string;
  title: string;
  date: string;
  wordCount: number;
  description?: string;
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


export interface ScreenshotSettings {
  format: 'png' | 'jpeg'; // 圖片格式
  quality?: number; // JPEG 品質 (0-100)
  includeTitle: boolean; // 是否包含標題
  currentPageOnly: boolean; // 只截取當前頁面
}