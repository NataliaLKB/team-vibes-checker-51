import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HealthCheck } from '@/types/health-check';

interface TeamHealthGraphProps {
  healthChecks: HealthCheck[];
}

const TeamHealthGraph = ({ healthChecks }: TeamHealthGraphProps) => {
  // Calculate averages for today's metrics
  const calculateAverages = () => {
    if (!healthChecks.length) return [];
    
    const today = new Date().toLocaleDateString();
    const todayChecks = healthChecks.filter(check => 
      new Date(check.timestamp).toLocaleDateString() === today
    );

    if (!todayChecks.length) return [];

    const averages = {
      name: "Team Average",
      morale: todayChecks.reduce((sum, check) => sum + check.morale.value, 0) / todayChecks.length,
      communication: todayChecks.reduce((sum, check) => sum + check.communication.value, 0) / todayChecks.length,
      productivity: todayChecks.reduce((sum, check) => sum + check.productivity.value, 0) / todayChecks.length,
    };

    return [averages];
  };

  const data = calculateAverages();

  if (!data.length) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-600">No health check data available for today</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-center">Today's Team Health Overview</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="morale" name="Morale" fill="#8B5CF6" />
            <Bar dataKey="communication" name="Communication" fill="#6366F1" />
            <Bar dataKey="productivity" name="Productivity" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeamHealthGraph;