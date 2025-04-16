
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ImageUploadProps {
  onImageUpload: (imageDataUrl: string) => void;
  existingImage?: string;
}

const ImageUpload = ({ onImageUpload, existingImage }: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(existingImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    // Convert to data URL (base64)
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewUrl(dataUrl);
      onImageUpload(dataUrl);
    };
    
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full flex flex-col items-center gap-3">
      {previewUrl ? (
        <div className="relative w-full max-h-80 overflow-hidden">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full object-contain rounded-md"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-md p-8 w-full flex flex-col items-center justify-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-1">Click to upload an image</p>
          <p className="text-xs text-gray-400">JPEG, PNG, GIF, WEBP (max 5MB)</p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
