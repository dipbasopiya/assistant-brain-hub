import { Lightbulb, Fan, Snowflake, Shield, Lock, DoorClosed, Power } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Lightbulb,
  Fan,
  Snowflake,
  Shield,
  Lock,
  DoorClosed,
};

export function DeviceStatusCard() {
  const { devices, toggleDevice } = useJarvisStore();

  const onlineDevices = devices.filter(d => d.status === 'on').length;

  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Power className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">Device Control</h3>
        </div>
        <span className="text-xs font-mono text-primary">
          {onlineDevices}/{devices.length} Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {devices.map(device => {
          const Icon = iconMap[device.icon] || Power;
          const isOn = device.status === 'on';

          return (
            <button
              key={device.id}
              onClick={() => toggleDevice(device.id)}
              className={cn(
                'p-4 rounded-xl border transition-all duration-300 text-left group',
                isOn
                  ? 'bg-primary/10 border-primary/30 hover:border-primary/50'
                  : 'bg-muted/30 border-border hover:border-muted-foreground/30'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isOn ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <div
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    isOn ? 'bg-success animate-pulse' : 'bg-muted-foreground/50'
                  )}
                />
              </div>
              <p className="text-sm font-medium truncate">{device.name}</p>
              <p className={cn('text-xs mt-0.5', isOn ? 'text-primary' : 'text-muted-foreground')}>
                {isOn ? 'ON' : 'OFF'}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
