
import { create } from 'zustand';
import { Note, NoteType, generateId } from '@/types/noteTypes';
import { persist } from 'zustand/middleware';

interface NoteState {
  notes: Note[];
  addNote: (note: Partial<Note>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  clearNotes: () => void;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      
      addNote: (noteData) => {
        const now = new Date();
        const newNote: Note = {
          id: generateId(),
          title: noteData.title || 'Untitled Note',
          content: noteData.content || '',
          type: noteData.type || 'text',
          color: noteData.color,
          imageUrl: noteData.imageUrl,
          language: noteData.language,
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          notes: [newNote, ...state.notes],
        }));
        
        return newNote;
      },
      
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) => 
            note.id === id 
              ? { ...note, ...updates, updatedAt: new Date() } 
              : note
          ),
        }));
      },
      
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },
      
      getNoteById: (id) => {
        return get().notes.find((note) => note.id === id);
      },
      
      clearNotes: () => {
        set({ notes: [] });
      },
    }),
    {
      name: 'keeperApp-notes',
    }
  )
);
