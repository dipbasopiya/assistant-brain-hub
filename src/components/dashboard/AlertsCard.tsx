import { Bell, AlertTriangle, Info, XCircle, Check } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const severityConfig = {
  info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  critical: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
};

export function AlertsCard() {
  const { alerts, acknowledgeAlert } = useJarvisStore();
  const recentAlerts = alerts.slice(0, 5);
  const unacknowledged = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">Recent Alerts</h3>
        </div>
        {unacknowledged > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs font-medium">
            {unacknowledged} new
          </span>
        )}
      </div>

      {recentAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Bell className="w-10 h-10 mb-2 opacity-30" />
          <p className="text-sm">No alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentAlerts.map(alert => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={cn(
                  'p-3 rounded-lg border transition-all',
                  config.bg,
                  config.border,
                  alert.acknowledged && 'opacity-60'
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn('w-5 h-5 mt-0.5', config.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">{alert.title}</p>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="p-1 rounded hover:bg-muted/50 transition-colors"
                          title="Acknowledge"
                        >
                          <Check className="w-4 h-4 text-success" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
