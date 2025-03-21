
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  onImageChange: (file: File | null) => void;
  previewUrl: string | null;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ onImageChange, previewUrl }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      onImageChange(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const removeImage = () => {
    onImageChange(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <Avatar className="h-24 w-24 cursor-pointer border-4 border-background shadow-md group-hover:opacity-75 transition-opacity">
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Profile picture" />
          ) : (
            <AvatarFallback className="bg-primary/10">
              <UserCircle className="h-12 w-12 text-primary" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div 
          {...getRootProps()} 
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-full transition-colors",
            isDragActive && "bg-primary/20"
          )}
        >
          <input {...getInputProps()} />
          {!previewUrl && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="h-8 w-8 text-primary" />
            </div>
          )}
        </div>
        
        {previewUrl && (
          <button 
            onClick={(e) => { e.stopPropagation(); removeImage(); }} 
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
      
      <div className="mt-2 text-center">
        <p className="text-sm text-muted-foreground">Upload a profile picture</p>
        <p className="text-xs text-muted-foreground/70">Max file size: 5MB</p>
      </div>
    </div>
  );
};

export default AvatarUpload;
