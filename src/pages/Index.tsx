
import { useState } from 'react';
import NoteCard from '@/components/NoteCard';
import CreateNoteModal from '@/components/CreateNoteModal';
import { Note } from '@/types/noteTypes';
import { useNoteStore } from '@/store/noteStore';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const { notes, addNote, updateNote, deleteNote } = useNoteStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  
  const handleCreateNote = () => {
    setEditingNote(undefined);
    setIsModalOpen(true);
  };
  
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };
  
  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    toast.success('Note deleted');
  };
  
  const handleSaveNote = (noteData: Partial<Note>) => {
    if (noteData.id) {
      updateNote(noteData.id, noteData);
      toast.success('Note updated');
    } else {
      addNote(noteData);
      toast.success('Note created');
    }
  };
  
  // Filter notes based on search query
  const filteredNotes = searchQuery
    ? notes.filter((note) => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-keeper-purple">Keeper Notes</h1>
          <Button onClick={handleCreateNote} className="bg-keeper-purple hover:bg-keeper-purple-dark">
            <Plus className="mr-1 h-4 w-4" />
            New Note
          </Button>
        </div>
        
        <div className="relative max-w-md mx-auto sm:max-w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search notes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            {searchQuery ? (
              <>
                <p className="text-lg font-medium">No matching notes found</p>
                <p className="text-sm">Try a different search term</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">No notes yet</p>
                <p className="text-sm mb-4">Create your first note to get started</p>
                <Button onClick={handleCreateNote} className="bg-keeper-purple hover:bg-keeper-purple-dark">
                  <Plus className="mr-1 h-4 w-4" />
                  New Note
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
                onEdit={handleEditNote}
              />
            ))}
          </div>
        )}
      </div>
      
      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        editingNote={editingNote}
      />
    </div>
  );
};

export default Index;
