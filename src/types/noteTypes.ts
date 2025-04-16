
export type NoteType = 'text' | 'code' | 'image';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  color?: string;
  imageUrl?: string;
  language?: string; // For code notes
  createdAt: Date;
  updatedAt: Date;
}

// Generate a unique ID for notes
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Generate a share URL for a note
export const getShareUrl = (noteId: string): string => {
  return `${window.location.origin}/view/${noteId}`;
};

// Available note colors
export const noteColors = [
  undefined,
  'purple',
  'blue', 
  'yellow',
  'orange',
  'green',
  'pink',
];

// Available code languages
export const codeLanguages = [
  'javascript',
  'typescript',
  'html',
  'css',
  'python',
  'java',
  'rust',
  'go',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
];
