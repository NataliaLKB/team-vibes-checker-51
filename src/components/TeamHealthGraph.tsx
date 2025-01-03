import React from 'react';
import { HealthCheck } from '@/types/health-check';

interface TeamHealthGraphProps {
  healthChecks: HealthCheck[];
  date?: string;
}

const TeamHealthGraph = ({ healthChecks, date }: TeamHealthGraphProps) => {
  const calculateAverages = () => {
    if (!healthChecks.length) return null;
    
    const targetDate = date || new Date().toLocaleDateString();
    const dateChecks = healthChecks.filter(check => {
      const checkDate = new Date(check.timestamp);
      const checkDateString = new Date(
        checkDate.getFullYear(),
        checkDate.getMonth(),
        checkDate.getDate()
      ).toLocaleDateString();
      
      const targetDateObj = new Date(targetDate);
      const targetDateString = new Date(
        targetDateObj.getFullYear(),
        targetDateObj.getMonth(),
        targetDateObj.getDate()
      ).toLocaleDateString();

      return checkDateString === targetDateString;
    });

    if (!dateChecks.length) return null;

    // Access the nested value property from the response objects
    return {
      morale: dateChecks.reduce((sum, check) => sum + (check.morale?.value || 0), 0) / dateChecks.length,
      communication: dateChecks.reduce((sum, check) => sum + (check.communication?.value || 0), 0) / dateChecks.length,
      productivity: dateChecks.reduce((sum, check) => sum + (check.productivity?.value || 0), 0) / dateChecks.length,
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
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-600">No health check data available for {date || 'today'}</p>
      </div>
    );
  }

  const metrics = [
    { name: 'Morale', value: averages.morale },
    { name: 'Communication', value: averages.communication },
    { name: 'Productivity', value: averages.productivity },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-center">{date || "Today's"} Team Health Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="text-center p-4 bg-secondary rounded-lg">
            <h3 className="font-medium mb-2">{metric.name}</h3>
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