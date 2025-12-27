import { TrendingUp, Activity, Zap, Target } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';

export function QuickStats() {
  const { tasks, devices, alerts, confidence } = useJarvisStore();

  const stats = [
    {
      label: 'Productivity',
      value: `${Math.round(confidence.overallScore)}%`,
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10',
      trend: '+12%',
    },
    {
      label: 'Active Tasks',
      value: tasks.filter(t => t.status === 'in-progress').length.toString(),
      icon: Activity,
      color: 'text-primary',
      bg: 'bg-primary/10',
      trend: null,
    },
    {
      label: 'Devices Online',
      value: `${devices.filter(d => d.status === 'on').length}/${devices.length}`,
      icon: Zap,
      color: 'text-warning',
      bg: 'bg-warning/10',
      trend: null,
    },
    {
      label: 'Active Alerts',
      value: alerts.filter(a => !a.acknowledged).length.toString(),
      icon: Target,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      trend: null,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card-hover p-4 slide-in" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="flex items-center justify-between mb-3">
            <div className={cn('p-2 rounded-lg', stat.bg)}>
              <stat.icon className={cn('w-5 h-5', stat.color)} />
            </div>
            {stat.trend && (
              <span className="text-xs text-success font-medium">{stat.trend}</span>
            )}
          </div>
          <p className="text-2xl font-display font-bold mb-1">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
