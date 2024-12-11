import type { HealthCheck, GroupedHealthChecks } from '@/types/health-check';

export const groupHealthChecksByDate = (checks: HealthCheck[]): GroupedHealthChecks => {
  return checks.reduce((groups: GroupedHealthChecks, check) => {
    const date = new Date(check.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(check);
    return groups;
  }, {});
};