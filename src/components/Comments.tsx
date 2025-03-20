
import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface CommentsProps {
  onCommentChange: (comment: string) => void;
}

export const Comments = ({ onCommentChange }: CommentsProps) => {
  return (
    <Card className="p-6 animate-scale-in border-primary-light shadow-md bg-darkBlue-light">
      <h3 className="text-xl font-semibold mb-4 text-primary">Why? *</h3>
      <Textarea
        placeholder="Tell us why you feel this way... (required)"
        onChange={(e) => onCommentChange(e.target.value)}
        className="mb-4 border-primary-light focus-visible:ring-primary bg-darkBlue-DEFAULT text-white"
        required
      />
    </Card>
  );
};
