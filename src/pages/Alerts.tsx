import { useState } from 'react';
import { Bell, AlertTriangle, Info, XCircle, Check, Trash2, Filter, Flame, Camera, Sun, Thermometer } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';
import { Alert } from '@/types/jarvis';

const typeIcons: Record<string, React.ElementType> = {
  temperature: Thermometer,
  seasonal: Sun,
  fire: Flame,
  attention: Camera,
  system: Bell,
};

const severityConfig = {
  info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  critical: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
};

export default function Alerts() {
  const { alerts, acknowledgeAlert, clearAlerts, addAlert } = useJarvisStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.acknowledged;
    if (filter === 'critical') return alert.severity === 'critical';
    return true;
  });

  const triggerFireAlert = () => {
    addAlert({
      type: 'fire',
      severity: 'critical',
      title: 'FIRE DETECTED!',
      message: 'Smoke/heat detected in Living Room. Evacuate immediately and contact emergency services.',
      acknowledged: false,
    });
  };

  const triggerAttentionAlert = () => {
    addAlert({
      type: 'attention',
      severity: 'warning',
      title: 'Attention Required',
      message: 'User appears to be distracted or away from screen. Please refocus on current task.',
      acknowledged: false,
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary glow-text">Alert Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage system alerts and notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={triggerAttentionAlert}
            className="px-4 py-2 rounded-lg bg-warning/20 text-warning border border-warning/30 text-sm font-medium hover:bg-warning/30 transition-colors"
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Test Attention Alert
          </button>
          <button
            onClick={triggerFireAlert}
            className="px-4 py-2 rounded-lg bg-destructive/20 text-destructive border border-destructive/30 text-sm font-medium hover:bg-destructive/30 transition-colors"
          >
            <Flame className="w-4 h-4 inline mr-2" />
            Test Fire Alert
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{alerts.length}</p>
              <p className="text-xs text-muted-foreground">Total Alerts</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-destructive">
                {alerts.filter(a => a.severity === 'critical').length}
              </p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-warning">
                {alerts.filter(a => !a.acknowledged).length}
              </p>
              <p className="text-xs text-muted-foreground">Unread</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Check className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-success">
                {alerts.filter(a => a.acknowledged).length}
              </p>
              <p className="text-xs text-muted-foreground">Acknowledged</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1">
            {(['all', 'unread', 'critical'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={clearAlerts}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 text-muted-foreground hover:bg-muted/50 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">No alerts to display</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const config = severityConfig[alert.severity];
            const SeverityIcon = config.icon;
            const TypeIcon = typeIcons[alert.type] || Bell;

            return (
              <div
                key={alert.id}
                className={cn(
                  'glass-card p-4 border-l-4 transition-all',
                  config.border,
                  alert.acknowledged && 'opacity-60'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn('p-2 rounded-lg', config.bg)}>
                    <SeverityIcon className={cn('w-6 h-6', config.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <TypeIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground uppercase">{alert.type}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded', config.bg, config.color)}>
                        {alert.severity}
                      </span>
                    </div>
                    <h3 className="font-semibold">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      {format(new Date(alert.timestamp), 'PPpp')} •{' '}
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-success/20 text-success text-sm font-medium hover:bg-success/30 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
