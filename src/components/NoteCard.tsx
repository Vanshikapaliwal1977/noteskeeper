
import { useState } from 'react';
import { Note, getShareUrl } from '@/types/noteTypes';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card';
import { Copy, Share2, Trash, Code, FileText, Image } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

const NoteCard = ({ note, onDelete, onEdit }: NoteCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine CSS classes based on note type and color
  const getNoteColorClass = () => {
    if (!note.color) return '';
    return `bg-note-${note.color}`;
  };
  
  const getTypeIcon = () => {
    switch (note.type) {
      case 'code':
        return <Code className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Copy note share URL to clipboard
  const handleShare = () => {
    const shareUrl = getShareUrl(note.id);
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast.success('Share URL copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy URL');
      });
  };
  
  // Format content display based on type
  const renderContent = () => {
    switch (note.type) {
      case 'image':
        return note.imageUrl ? (
          <div className="relative w-full h-48 overflow-hidden">
            <img 
              src={note.imageUrl} 
              alt={note.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : null;
      case 'code':
        return (
          <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto max-h-48">
            <code>{note.content}</code>
          </pre>
        );
      default:
        return (
          <p className="whitespace-pre-wrap break-words">
            {note.content.length > 300 
              ? `${note.content.substring(0, 300)}...` 
              : note.content}
          </p>
        );
    }
  };
  
  return (
    <Card 
      className={`note-card animate-fade-in cursor-pointer ${getNoteColorClass()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(note)}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <h3 className="font-medium text-sm truncate">
              {note.title}
            </h3>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(note.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3">
        {renderContent()}
      </CardContent>
      
      {isHovered && (
        <CardFooter className="p-2 border-t flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {note.type === 'code' && note.language && (
              <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                {note.language}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default NoteCard;
