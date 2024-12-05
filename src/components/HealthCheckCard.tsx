import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface HealthCheckCardProps {
  title: string;
  description: string;
  onSelect: (mood: string) => void;
}

export const HealthCheckCard = ({ title, description, onSelect }: HealthCheckCardProps) => {
  const [progress, setProgress] = useState<number>(0);

  const handleProgressChange = (value: number) => {
    setProgress(value);
    // Map progress value to mood
    let mood = 'sad';
    if (value >= 70) {
      mood = 'happy';
    } else if (value >= 40) {
      mood = 'neutral';
    }
    onSelect(mood);
  };

  return (
    <Card className="p-6 animate-scale-in">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="space-y-4">
        <Progress 
          value={progress} 
          className="w-full cursor-pointer" 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.round((x / rect.width) * 100);
            handleProgressChange(Math.max(0, Math.min(100, percentage)));
          }}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Not Great</span>
          <span>Okay</span>
          <span>Amazing!</span>
        </div>
      </div>
    </Card>
  );
};