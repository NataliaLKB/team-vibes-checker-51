
import React from 'react';
import { HealthCheck } from '@/types/health-check';

interface TeamHealthGraphProps {
  healthChecks: HealthCheck[];
}

const TeamHealthGraph = ({ healthChecks }: TeamHealthGraphProps) => {
  // Calculate averages for the given set of health checks
  const calculateAverages = () => {
    if (!healthChecks.length) return null;
    
    return {
      morale: healthChecks.reduce((sum, check) => sum + check.morale.value, 0) / healthChecks.length,
      communication: healthChecks.reduce((sum, check) => sum + check.communication.value, 0) / healthChecks.length,
      productivity: healthChecks.reduce((sum, check) => sum + check.productivity.value, 0) / healthChecks.length,
    };
  };

  const getEmoji = (value: number) => {
    if (value >= 80) return '😄';
    if (value >= 60) return '🙂';
    if (value >= 40) return '😐';
    if (value >= 20) return '🙁';
    return '😢';
  };

  const getColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-blue-500';
    if (value >= 40) return 'text-yellow-500';
    if (value >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  const averages = calculateAverages();

  if (!averages) {
    return (
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30">
        <p className="text-gray-600 dark:text-gray-300">No health check data available for this period</p>
      </div>
    );
  }

  const metrics = [
    { name: 'Morale', value: averages.morale },
    { name: 'Communication', value: averages.communication },
    { name: 'Productivity', value: averages.productivity },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30 space-y-4">
      <h2 className="text-xl font-semibold text-center dark:text-white">Team Health Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="text-center p-4 bg-secondary dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium mb-2 dark:text-white">{metric.name}</h3>
            <div className="text-4xl mb-2">{getEmoji(metric.value)}</div>
            <div className={`font-bold ${getColor(metric.value)}`}>
              {Math.round(metric.value)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamHealthGraph;
