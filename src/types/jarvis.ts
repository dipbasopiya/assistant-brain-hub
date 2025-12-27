export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
}

export interface Alert {
  id: string;
  type: 'temperature' | 'seasonal' | 'fire' | 'attention' | 'system';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface Device {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'ac' | 'security' | 'sensor' | 'other';
  status: 'on' | 'off' | 'standby';
  icon: string;
  lastUpdated: Date;
}

export interface ControlLog {
  id: string;
  action: string;
  target: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: Date;
  details?: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  icon: string;
}

export interface ConfidenceMetrics {
  taskCompletion: number;
  timeliness: number;
  consistency: number;
  overallScore: number;
}

export interface DecisionGate {
  status: 'proceed' | 'attention' | 'reschedule' | 'high-risk';
  reasoning: string[];
  recommendations: string[];
  timestamp: Date;
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'monsoon';
