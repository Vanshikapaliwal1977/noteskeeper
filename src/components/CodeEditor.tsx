
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { codeLanguages } from '@/types/noteTypes';
import { Textarea } from '@/components/ui/textarea';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
}

const CodeEditor = ({ code, language, onChange, onLanguageChange }: CodeEditorProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {codeLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono text-sm bg-note-code p-3 min-h-[200px]"
        placeholder="// Write your code here"
      />
    </div>
  );
};

export default CodeEditor;
