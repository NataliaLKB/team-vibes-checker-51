import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Trash2, Info } from 'lucide-react';
import type { HealthCheck } from '@/types/health-check';

interface HealthCheckCardProps {
  healthCheck: HealthCheck;
  onDelete: (id: string) => void;
}

export const HealthCheckCard = ({ healthCheck, onDelete }: HealthCheckCardProps) => {
  return (
    <Card className="bg-white p-6 rounded-lg shadow-md space-y-6 animate-scale-in">
      <CardHeader className="flex justify-between items-center border-b pb-4 p-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{healthCheck.name}'s Feedback</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(healthCheck.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(healthCheck.timestamp).toLocaleTimeString()}
        </span>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium">Team Morale</h3>
            <Progress value={healthCheck.morale.value} className="w-full" />
            <p className="text-sm text-gray-600">{healthCheck.morale.mood}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Communication</h3>
            <Progress value={healthCheck.communication.value} className="w-full" />
            <p className="text-sm text-gray-600">{healthCheck.communication.mood}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Productivity</h3>
            <Progress value={healthCheck.productivity.value} className="w-full" />
            <p className="text-sm text-gray-600">{healthCheck.productivity.mood}</p>
          </div>

          {healthCheck.why && (
            <div className="space-y-2 bg-secondary/50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Additional Comments</h3>
              </div>
              <p className="text-gray-600">{healthCheck.why}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};