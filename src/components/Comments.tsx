import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
interface CommentsProps {
  onCommentChange: (comment: string) => void;
}
export const Comments = ({
  onCommentChange
}: CommentsProps) => {
  return <Card className="p-6 animate-scale-in border-gray border-2 shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30">
      <h3 className="text-xl font-semibold mb-4 text-darkBlue-DEFAULT dark:text-white">Why? *</h3>
      <Textarea placeholder="Tell us why you feel this way... (required)" onChange={e => onCommentChange(e.target.value)} required className="mb-4 border-grey focus-visible:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400" />
    </Card>;
};