
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2 } from 'lucide-react';
import { HealthCheck } from '@/types/health-check';

interface HealthCheckCardProps {
  check?: HealthCheck;
  onDelete?: (id: string) => void;
  title?: string;
  description?: string;
  onSelect?: (mood: string, value: number) => void;
}

const HealthCheckCard = ({ check, onDelete, title, description, onSelect }: HealthCheckCardProps) => {
  const [localValue, setLocalValue] = React.useState(0);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    const clampedValue = Math.min(Math.max(percentage, 0), 100);
    setLocalValue(clampedValue);
    onSelect?.('mood', clampedValue);
  };

  // If we have a check object, render the results view
  if (check) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30 space-y-6 animate-scale-in">
        <div className="flex justify-between items-center border-b dark:border-gray-700 pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold dark:text-white">{check.name}'s Feedback</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(check.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 dark:text-destructive dark:hover:bg-destructive/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(check.timestamp).toLocaleTimeString()}
          </span>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium dark:text-gray-200">How are you feeling this week?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Share your overall mood and energy level with the team</p>
            <Progress value={check.morale.value} className="w-full" />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium dark:text-gray-200">Communication</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Rate the effectiveness of team communication this week</p>
            <Progress value={check.communication.value} className="w-full" />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium dark:text-gray-200">Productivity</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">How productive do you feel you've been this week?</p>
            <Progress value={check.productivity.value} className="w-full" />
          </div>

          {check.why && (
            <div className="space-y-2">
              <h3 className="font-medium dark:text-gray-200">Why?</h3>
              <p className="text-gray-600 dark:text-gray-300">{check.why}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Otherwise, render the input view
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
      
      <div className="space-y-4">
        <Progress 
          value={localValue} 
          className="w-full cursor-pointer hover:bg-secondary/80 dark:hover:bg-gray-700 transition-colors" 
          onClick={handleProgressClick}
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckCard;
