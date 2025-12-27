import { Lightbulb, Fan, Snowflake, Shield, Lock, DoorClosed, Power, Settings, Activity } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const iconMap: Record<string, React.ElementType> = {
  Lightbulb,
  Fan,
  Snowflake,
  Shield,
  Lock,
  DoorClosed,
};

const typeColors: Record<string, string> = {
  light: 'bg-warning/10 text-warning border-warning/30',
  fan: 'bg-primary/10 text-primary border-primary/30',
  ac: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  security: 'bg-success/10 text-success border-success/30',
  sensor: 'bg-secondary/10 text-secondary border-secondary/30',
  other: 'bg-muted text-muted-foreground border-border',
};

export default function Devices() {
  const { devices, toggleDevice, controlLogs } = useJarvisStore();

  const onlineCount = devices.filter(d => d.status === 'on').length;
  const recentLogs = controlLogs.slice(0, 5);

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-primary glow-text">Device Control</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and monitor connected devices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Power className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{devices.length}</p>
              <p className="text-xs text-muted-foreground">Total Devices</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Activity className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-success">{onlineCount}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Power className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{devices.length - onlineCount}</p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Settings className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{controlLogs.length}</p>
              <p className="text-xs text-muted-foreground">Actions Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="glass-card p-6">
        <h3 className="font-display font-bold mb-6">Connected Devices</h3>
        <div className="grid grid-cols-3 gap-4">
          {devices.map(device => {
            const Icon = iconMap[device.icon] || Power;
            const isOn = device.status === 'on';
            const colorClass = typeColors[device.type];

            return (
              <div
                key={device.id}
                className={cn(
                  'p-6 rounded-xl border-2 transition-all duration-300',
                  isOn
                    ? colorClass
                    : 'bg-muted/20 border-border'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    'p-3 rounded-xl',
                    isOn ? 'bg-card/50' : 'bg-muted/30'
                  )}>
                    <Icon className={cn('w-8 h-8', isOn ? '' : 'text-muted-foreground')} />
                  </div>
                  <button
                    onClick={() => toggleDevice(device.id)}
                    className={cn(
                      'relative w-14 h-7 rounded-full transition-colors',
                      isOn ? 'bg-success' : 'bg-muted'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-1 w-5 h-5 rounded-full bg-card shadow transition-all',
                        isOn ? 'left-8' : 'left-1'
                      )}
                    />
                  </button>
                </div>
                <h4 className="font-medium mb-1">{device.name}</h4>
                <div className="flex items-center justify-between">
                  <span className={cn('text-sm', isOn ? '' : 'text-muted-foreground')}>
                    {isOn ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">{device.type}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last: {format(new Date(device.lastUpdated), 'HH:mm')}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h3 className="font-display font-bold mb-4">Recent Activity</h3>
        {recentLogs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-2">
            {recentLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    log.status === 'success' ? 'bg-success' : 'bg-destructive'
                  )} />
                  <div>
                    <p className="text-sm font-medium">{log.action} - {log.target}</p>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {format(new Date(log.timestamp), 'HH:mm:ss')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* IoT Integration Notice */}
      <div className="glass-card p-6 border-l-4 border-l-secondary">
        <div className="flex items-start gap-4">
          <Settings className="w-6 h-6 text-secondary mt-1" />
          <div>
            <h3 className="font-display font-bold mb-1">IoT Integration Ready</h3>
            <p className="text-sm text-muted-foreground">
              This control panel is designed for future integration with ESP32 microcontrollers and smart home APIs. 
              Device actions are logged and can be extended to trigger real hardware controls via MQTT, HTTP, or WebSocket protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
