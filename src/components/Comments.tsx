import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface CommentsProps {
  onCommentChange: (comment: string) => void;
}

export const Comments = ({ onCommentChange }: CommentsProps) => {
  return (
    <Card className="p-6 animate-scale-in">
      <h3 className="text-xl font-semibold mb-4">Why?</h3>
      <Textarea
        placeholder="Tell us why you feel this way..."
        onChange={(e) => onCommentChange(e.target.value)}
        className="mb-4"
      />
    </Card>
  );
};