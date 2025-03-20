
import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface CommentsProps {
  onCommentChange: (comment: string) => void;
}

export const Comments = ({ onCommentChange }: CommentsProps) => {
  return (
    <Card className="p-6 animate-scale-in border-primary shadow-md bg-white dark:bg-darkBlue-light dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-darkBlue-DEFAULT dark:text-white">Why? *</h3>
      <Textarea
        placeholder="Tell us why you feel this way... (required)"
        onChange={(e) => onCommentChange(e.target.value)}
        className="mb-4 border-primary focus-visible:ring-primary dark:bg-darkBlue-DEFAULT dark:text-white"
        required
      />
    </Card>
  );
};
