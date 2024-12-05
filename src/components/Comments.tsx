import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export const Comments = () => {
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      toast({
        title: "Feedback submitted!",
        description: "Thank you for your input! 🎉",
      });
      setComment('');
    }
  };

  return (
    <Card className="p-6 animate-scale-in">
      <h3 className="text-xl font-semibold mb-4">Additional Comments</h3>
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder="Any other thoughts? Feel free to use emojis! 😊"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mb-4"
        />
        <Button type="submit">Submit Feedback</Button>
      </form>
    </Card>
  );
};