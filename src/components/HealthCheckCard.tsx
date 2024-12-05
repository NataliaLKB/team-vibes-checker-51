import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Smile, Meh, Frown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthCheckCardProps {
  title: string;
  description: string;
  onSelect: (mood: string) => void;
}

export const HealthCheckCard = ({ title, description, onSelect }: HealthCheckCardProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (mood: string) => {
    setSelected(mood);
    onSelect(mood);
  };

  const MoodButton = ({ mood, icon: Icon, color }: { mood: string; icon: any; color: string }) => (
    <button
      onClick={() => handleSelect(mood)}
      className={cn(
        "p-4 rounded-full transition-all duration-200 hover:scale-110",
        selected === mood ? "ring-2 ring-primary" : ""
      )}
    >
      <Icon className={cn("w-8 h-8", color)} />
    </button>
  );

  return (
    <Card className="p-6 animate-scale-in">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex justify-center gap-6">
        <MoodButton mood="happy" icon={Smile} color="text-green-500" />
        <MoodButton mood="neutral" icon={Meh} color="text-yellow-500" />
        <MoodButton mood="sad" icon={Frown} color="text-red-500" />
      </div>
    </Card>
  );
};