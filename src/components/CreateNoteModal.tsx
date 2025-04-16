
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import CodeEditor from './CodeEditor';
import ImageUpload from './ImageUpload';
import { Note, NoteType, noteColors } from '@/types/noteTypes';
import { FileText, Code, Image } from 'lucide-react';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  editingNote?: Note;
}

const CreateNoteModal = ({ isOpen, onClose, onSave, editingNote }: CreateNoteModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<NoteType>('text');
  const [color, setColor] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState('');
  const [language, setLanguage] = useState('javascript');
  
  // Reset form or populate with editing note data when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (editingNote) {
        setTitle(editingNote.title);
        setContent(editingNote.content);
        setType(editingNote.type);
        setColor(editingNote.color);
        setImageUrl(editingNote.imageUrl || '');
        setLanguage(editingNote.language || 'javascript');
      } else {
        resetForm();
      }
    }
  }, [isOpen, editingNote]);
  
  const resetForm = () => {
    setTitle('');
    setContent('');
    setType('text');
    setColor(undefined);
    setImageUrl('');
    setLanguage('javascript');
  };
  
  const handleSave = () => {
    const noteData: Partial<Note> = {
      title: title || 'Untitled Note',
      content,
      type,
      color,
      language: type === 'code' ? language : undefined,
      imageUrl: type === 'image' ? imageUrl : undefined,
    };
    
    if (editingNote) {
      noteData.id = editingNote.id;
    }
    
    onSave(noteData);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{editingNote ? 'Edit Note' : 'Create Note'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Input
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />
          
          <Tabs defaultValue={type} onValueChange={(value) => setType(value as NoteType)}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Text</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>Code</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span>Image</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="pt-4">
              <Textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
            </TabsContent>
            
            <TabsContent value="code" className="pt-4">
              <CodeEditor
                code={content}
                language={language}
                onChange={setContent}
                onLanguageChange={setLanguage}
              />
            </TabsContent>
            
            <TabsContent value="image" className="pt-4">
              <div className="space-y-4">
                <ImageUpload 
                  onImageUpload={setImageUrl} 
                  existingImage={imageUrl} 
                />
                <Textarea
                  placeholder="Add a caption or description..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Note Color Selection */}
          <div className="pt-2">
            <p className="text-sm text-gray-500 mb-2">Note Color</p>
            <div className="flex flex-wrap gap-2">
              {[undefined, ...noteColors.filter(Boolean)].map((noteColor) => (
                <button
                  key={noteColor || 'default'}
                  className={`w-6 h-6 rounded-full border ${
                    noteColor ? `bg-note-${noteColor}` : 'bg-white'
                  } ${color === noteColor ? 'ring-2 ring-offset-2 ring-keeper-purple' : ''}`}
                  onClick={() => setColor(noteColor)}
                  title={noteColor || 'Default'}
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingNote ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteModal;
