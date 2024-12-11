import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface HealthCheckInputProps {
  title: string;
  description: string;
  onSelect: (mood: string, value: number) => void;
}

export const HealthCheckInput = ({ title, description, onSelect }: HealthCheckInputProps) => {
  const moods = [
    { mood: "Very Low", value: 20 },
    { mood: "Low", value: 40 },
    { mood: "Neutral", value: 60 },
    { mood: "Good", value: 80 },
    { mood: "Excellent", value: 100 },
  ];

  return (
    <Card className="bg-white p-6 rounded-lg shadow-md space-y-6 animate-scale-in">
      <CardHeader className="p-0">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-wrap gap-2">
          {moods.map(({ mood, value }) => (
            <Button
              key={mood}
              variant="outline"
              onClick={() => onSelect(mood, value)}
              className="flex-1 min-w-[120px]"
            >
              {mood}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};