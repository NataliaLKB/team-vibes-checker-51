
import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface CommentsProps {
  onCommentChange: (comment: string) => void;
}

export const Comments = ({ onCommentChange }: CommentsProps) => {
  return (
    <Card className="p-6 animate-scale-in border-gray-200 shadow-md bg-gray-50">
      <h3 className="text-xl font-semibold mb-4 text-primary">Why? *</h3>
      <Textarea
        placeholder="Tell us why you feel this way... (required)"
        onChange={(e) => onCommentChange(e.target.value)}
        className="mb-4 border-gray-200 focus-visible:ring-primary bg-white text-gray-800"
        required
      />
    </Card>
  );
};
