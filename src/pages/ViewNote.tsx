
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNoteStore } from '@/store/noteStore';
import { Note } from '@/types/noteTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Copy, FileText, Code, Image } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const ViewNote = () => {
  const { id } = useParams<{ id: string }>();
  const { getNoteById } = useNoteStore();
  const [note, setNote] = useState<Note | undefined>();
  
  useEffect(() => {
    if (id) {
      const foundNote = getNoteById(id);
      setNote(foundNote);
    }
  }, [id, getNoteById]);
  
  // Determine CSS classes based on note type and color
  const getNoteColorClass = () => {
    if (!note?.color) return '';
    return `bg-note-${note.color}`;
  };
  
  // Copy link to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success('Link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };
  
  if (!note) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mb-4">Note Not Found</h1>
        <p className="text-gray-500 mb-8">The note you're looking for doesn't exist or has been deleted.</p>
        <Link to="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notes
          </Button>
        </Link>
      </div>
    );
  }
  
  // Format content display based on type
  const renderContent = () => {
    switch (note.type) {
      case 'image':
        return (
          <div className="space-y-4">
            {note.imageUrl && (
              <div className="w-full overflow-hidden rounded-md">
                <img 
                  src={note.imageUrl} 
                  alt={note.title} 
                  className="w-full object-contain"
                />
              </div>
            )}
            {note.content && (
              <p className="whitespace-pre-wrap">{note.content}</p>
            )}
          </div>
        );
      case 'code':
        return (
          <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
            <code>{note.content}</code>
          </pre>
        );
      default:
        return (
          <p className="whitespace-pre-wrap">{note.content}</p>
        );
    }
  };
  
  // Get icon based on note type
  const getTypeIcon = () => {
    switch (note.type) {
      case 'code':
        return <Code className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <header className="mb-6 flex justify-between items-center">
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>
        </Link>
        <Button variant="outline" onClick={copyLinkToClipboard} className="gap-2">
          <Copy className="h-4 w-4" />
          Copy Link
        </Button>
      </header>
      
      <Card className={`shadow-lg animate-fade-in ${getNoteColorClass()}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <h1 className="text-2xl font-bold">{note.title}</h1>
          </div>
          <div className="text-sm text-gray-500">
            {note.type === 'code' && note.language && (
              <span className="px-2 py-1 bg-gray-200 rounded text-xs mr-2">
                {note.language}
              </span>
            )}
            Shared on {new Date(note.updatedAt).toLocaleString()}
          </div>
        </CardHeader>
        
        <CardContent className="py-4">
          {renderContent()}
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-gray-500">
            Shared with Keeper Notes
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ViewNote;
