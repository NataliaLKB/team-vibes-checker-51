import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2 } from 'lucide-react';
import { HealthCheck } from '@/types/health-check';

interface HealthCheckCardProps {
  check: HealthCheck;
  onDelete: (id: string) => void;
}

const HealthCheckCard = ({ check, onDelete }: HealthCheckCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6 animate-scale-in">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{check.name}'s Feedback</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(check.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(check.timestamp).toLocaleTimeString()}
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <h3 className="font-medium">How are you feeling this week?</h3>
          <Progress value={check.morale.value} className="w-full" />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Communication</h3>
          <Progress value={check.communication.value} className="w-full" />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Productivity</h3>
          <Progress value={check.productivity.value} className="w-full" />
        </div>

        {check.why && (
          <div className="space-y-2">
            <h3 className="font-medium">Why?</h3>
            <p className="text-gray-600">{check.why}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCheckCard;