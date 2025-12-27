import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Alert, Device, ControlLog, WeatherData, ConfidenceMetrics, DecisionGate, Season } from '@/types/jarvis';

interface JarvisState {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Alerts
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  acknowledgeAlert: (id: string) => void;
  clearAlerts: () => void;
  
  // Devices
  devices: Device[];
  toggleDevice: (id: string) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  
  // Logs
  controlLogs: ControlLog[];
  addLog: (log: Omit<ControlLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  
  // Weather
  weather: WeatherData | null;
  setWeather: (weather: WeatherData) => void;
  
  // Metrics
  confidence: ConfidenceMetrics;
  updateConfidence: () => void;
  
  // Decision Gate
  decision: DecisionGate | null;
  evaluateDecision: () => void;
  
  // Season
  currentSeason: Season;
  setSeason: (season: Season) => void;
  
  // Attention
  isAttentive: boolean;
  setAttentive: (value: boolean) => void;
  attentionWarnings: number;
  incrementAttentionWarning: () => void;
  resetAttentionWarnings: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialDevices: Device[] = [
  { id: '1', name: 'Living Room Light', type: 'light', status: 'off', icon: 'Lightbulb', lastUpdated: new Date() },
  { id: '2', name: 'Bedroom Fan', type: 'fan', status: 'off', icon: 'Fan', lastUpdated: new Date() },
  { id: '3', name: 'Air Conditioner', type: 'ac', status: 'off', icon: 'Snowflake', lastUpdated: new Date() },
  { id: '4', name: 'Security System', type: 'security', status: 'on', icon: 'Shield', lastUpdated: new Date() },
  { id: '5', name: 'Smart Lock', type: 'security', status: 'on', icon: 'Lock', lastUpdated: new Date() },
  { id: '6', name: 'Garage Door', type: 'other', status: 'off', icon: 'DoorClosed', lastUpdated: new Date() },
];

const initialTasks: Task[] = [
  { id: '1', title: 'Complete project documentation', status: 'in-progress', priority: 'high', createdAt: new Date(), dueDate: new Date(Date.now() + 86400000) },
  { id: '2', title: 'Review system architecture', status: 'pending', priority: 'medium', createdAt: new Date(), dueDate: new Date(Date.now() + 172800000) },
  { id: '3', title: 'Test all modules', status: 'pending', priority: 'high', createdAt: new Date(), dueDate: new Date(Date.now() + 259200000) },
  { id: '4', title: 'Prepare presentation slides', status: 'completed', priority: 'medium', createdAt: new Date(Date.now() - 86400000), completedAt: new Date() },
];

export const useJarvisStore = create<JarvisState>()(
  persist(
    (set, get) => ({
      // Tasks
      tasks: initialTasks,
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: generateId(), createdAt: new Date() }]
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      
      // Alerts
      alerts: [],
      addAlert: (alert) => set((state) => ({
        alerts: [{ ...alert, id: generateId(), timestamp: new Date() }, ...state.alerts].slice(0, 50)
      })),
      acknowledgeAlert: (id) => set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a)
      })),
      clearAlerts: () => set({ alerts: [] }),
      
      // Devices
      devices: initialDevices,
      toggleDevice: (id) => {
        const device = get().devices.find(d => d.id === id);
        if (device) {
          const newStatus = device.status === 'on' ? 'off' : 'on';
          set((state) => ({
            devices: state.devices.map(d => d.id === id ? { ...d, status: newStatus, lastUpdated: new Date() } : d)
          }));
          get().addLog({
            action: `Turned ${newStatus.toUpperCase()}`,
            target: device.name,
            status: 'success',
            details: `Device ${device.name} was turned ${newStatus}`
          });
        }
      },
      updateDevice: (id, updates) => set((state) => ({
        devices: state.devices.map(d => d.id === id ? { ...d, ...updates, lastUpdated: new Date() } : d)
      })),
      
      // Logs
      controlLogs: [],
      addLog: (log) => set((state) => ({
        controlLogs: [{ ...log, id: generateId(), timestamp: new Date() }, ...state.controlLogs].slice(0, 100)
      })),
      clearLogs: () => set({ controlLogs: [] }),
      
      // Weather
      weather: null,
      setWeather: (weather) => set({ weather }),
      
      // Metrics
      confidence: { taskCompletion: 0, timeliness: 0, consistency: 0, overallScore: 0 },
      updateConfidence: () => {
        const tasks = get().tasks;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const total = tasks.length;
        
        const taskCompletion = total > 0 ? (completed / total) * 100 : 0;
        
        const onTime = tasks.filter(t => 
          t.status === 'completed' && t.completedAt && t.dueDate && 
          new Date(t.completedAt) <= new Date(t.dueDate)
        ).length;
        const timeliness = completed > 0 ? (onTime / completed) * 100 : 0;
        
        const consistency = Math.min(100, 60 + (completed * 5));
        
        const overallScore = Math.round((taskCompletion * 0.4) + (timeliness * 0.35) + (consistency * 0.25));
        
        set({ confidence: { taskCompletion, timeliness, consistency, overallScore } });
      },
      
      // Decision Gate
      decision: null,
      evaluateDecision: () => {
        const { confidence, alerts, tasks } = get();
        const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
        const criticalAlerts = unacknowledgedAlerts.filter(a => a.severity === 'critical');
        const pendingHighPriority = tasks.filter(t => t.status === 'pending' && t.priority === 'high');
        
        let status: DecisionGate['status'] = 'proceed';
        const reasoning: string[] = [];
        const recommendations: string[] = [];
        
        if (criticalAlerts.length > 0) {
          status = 'high-risk';
          reasoning.push(`${criticalAlerts.length} critical alert(s) require immediate attention`);
          recommendations.push('Address all critical alerts before proceeding');
        } else if (confidence.overallScore < 40) {
          status = 'reschedule';
          reasoning.push('Overall confidence score is below acceptable threshold');
          recommendations.push('Focus on completing pending tasks to improve confidence');
        } else if (unacknowledgedAlerts.length > 3 || pendingHighPriority.length > 2) {
          status = 'attention';
          reasoning.push('Multiple items require attention');
          if (unacknowledgedAlerts.length > 3) recommendations.push('Review and acknowledge pending alerts');
          if (pendingHighPriority.length > 2) recommendations.push('Prioritize high-priority pending tasks');
        } else {
          reasoning.push('All systems operating normally');
          reasoning.push(`Confidence score: ${confidence.overallScore}%`);
          recommendations.push('Continue with scheduled activities');
        }
        
        set({ decision: { status, reasoning, recommendations, timestamp: new Date() } });
      },
      
      // Season
      currentSeason: 'summer',
      setSeason: (season) => set({ currentSeason: season }),
      
      // Attention
      isAttentive: true,
      setAttentive: (value) => set({ isAttentive: value }),
      attentionWarnings: 0,
      incrementAttentionWarning: () => set((state) => ({ attentionWarnings: state.attentionWarnings + 1 })),
      resetAttentionWarnings: () => set({ attentionWarnings: 0 }),
    }),
    {
      name: 'jarvis-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        devices: state.devices,
        controlLogs: state.controlLogs,
      }),
    }
  )
);
