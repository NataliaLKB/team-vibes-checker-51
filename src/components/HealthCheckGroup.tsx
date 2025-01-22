import React from 'react';
import { HealthCheck } from '@/types/health-check';
import HealthCheckCard from './HealthCheckCard';
import TeamHealthGraph from './TeamHealthGraph';

interface HealthCheckGroupProps {
  date: string;
  checks: HealthCheck[];
  onDelete: (id: string) => void;
}

const HealthCheckGroup = ({ date, checks, onDelete }: HealthCheckGroupProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700">{date}</h2>
      <TeamHealthGraph healthChecks={checks} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((check) => (
          <HealthCheckCard key={check.id} check={check} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default HealthCheckGroup;