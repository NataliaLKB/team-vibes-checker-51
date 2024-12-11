export interface HealthCheckResponse {
  mood: string;
  value: number;
}

export interface HealthCheck {
  id: string;
  name: string;
  morale: HealthCheckResponse;
  communication: HealthCheckResponse;
  productivity: HealthCheckResponse;
  why: string | null;
  timestamp: string;
}

export interface GroupedHealthChecks {
  [date: string]: HealthCheck[];
}