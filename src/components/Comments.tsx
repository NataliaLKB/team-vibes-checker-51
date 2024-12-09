import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentsProps {
  onCommentSubmit: (comment: string) => void;
}

export const Comments = ({ onCommentSubmit }: CommentsProps) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onCommentSubmit(comment);
      setComment('');
    }
  };

  return (
    <Card className="p-6 animate-scale-in">
      <h3 className="text-xl font-semibold mb-4">Why?</h3>
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder="Tell us why you feel this way..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mb-4"
        />
        <Button type="submit">Submit</Button>
      </form>
    </Card>
  );
};