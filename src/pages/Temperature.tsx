import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, Sun, CloudRain, Cloud, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';

export default function Temperature() {
  const { weather, setWeather, addAlert } = useJarvisStore();
  const [hourlyData, setHourlyData] = useState<number[]>([]);

  useEffect(() => {
    // Simulate hourly temperature data
    const hours = Array.from({ length: 24 }, (_, i) => {
      const base = 28;
      const variation = Math.sin((i - 6) * Math.PI / 12) * 8;
      return Math.round(base + variation + (Math.random() - 0.5) * 3);
    });
    setHourlyData(hours);

    // Set weather if not already set
    if (!weather) {
      setWeather({
        temperature: 32,
        condition: 'sunny',
        humidity: 65,
        windSpeed: 12,
        location: 'New Delhi, India',
        icon: 'sunny',
      });
    }
  }, []);

  const thresholds = {
    high: { temp: 35, message: 'Extreme heat - Stay indoors and hydrated' },
    warm: { temp: 30, message: 'High temperature - Drink water regularly' },
    comfortable: { temp: 20, message: 'Comfortable temperature' },
    cool: { temp: 15, message: 'Cool weather - Light jacket recommended' },
    cold: { temp: 10, message: 'Cold - Wear warm clothing' },
  };

  const getCurrentAdvice = (temp: number) => {
    if (temp >= thresholds.high.temp) return { level: 'critical', ...thresholds.high };
    if (temp >= thresholds.warm.temp) return { level: 'warning', ...thresholds.warm };
    if (temp >= thresholds.comfortable.temp) return { level: 'good', ...thresholds.comfortable };
    if (temp >= thresholds.cool.temp) return { level: 'info', ...thresholds.cool };
    return { level: 'warning', ...thresholds.cold };
  };

  const advice = weather ? getCurrentAdvice(weather.temperature) : null;

  const maxTemp = Math.max(...hourlyData);
  const minTemp = Math.min(...hourlyData);

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-primary glow-text">Temperature Module</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time weather monitoring and smart alerts</p>
      </div>

      {weather && (
        <>
          {/* Main Temperature Display */}
          <div className="glass-card p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                    <Thermometer className="w-16 h-16 text-primary" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-success flex items-center justify-center text-xs font-bold">
                    ●
                  </div>
                </div>
                <div>
                  <div className="flex items-end gap-2">
                    <span className="text-7xl font-display font-bold text-primary glow-text">
                      {weather.temperature}
                    </span>
                    <span className="text-3xl text-muted-foreground mb-3">°C</span>
                  </div>
                  <p className="text-xl text-muted-foreground capitalize">{weather.condition}</p>
                  <p className="text-sm text-muted-foreground">{weather.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30">
                  <Droplets className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-2xl font-mono font-bold">{weather.humidity}%</p>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30">
                  <Wind className="w-6 h-6 text-primary mb-2" />
                  <p className="text-2xl font-mono font-bold">{weather.windSpeed}</p>
                  <p className="text-xs text-muted-foreground">Wind km/h</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30">
                  <TrendingUp className="w-6 h-6 text-destructive mb-2" />
                  <p className="text-2xl font-mono font-bold">{maxTemp}°</p>
                  <p className="text-xs text-muted-foreground">High</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30">
                  <TrendingDown className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-2xl font-mono font-bold">{minTemp}°</p>
                  <p className="text-xs text-muted-foreground">Low</p>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Advisory */}
          {advice && (
            <div
              className={cn(
                'glass-card p-6 border-l-4',
                advice.level === 'critical' && 'border-l-destructive bg-destructive/5',
                advice.level === 'warning' && 'border-l-warning bg-warning/5',
                advice.level === 'good' && 'border-l-success bg-success/5',
                advice.level === 'info' && 'border-l-primary bg-primary/5'
              )}
            >
              <div className="flex items-center gap-4">
                <AlertTriangle
                  className={cn(
                    'w-8 h-8',
                    advice.level === 'critical' && 'text-destructive',
                    advice.level === 'warning' && 'text-warning',
                    advice.level === 'good' && 'text-success',
                    advice.level === 'info' && 'text-primary'
                  )}
                />
                <div>
                  <h3 className="font-display font-bold text-lg">Smart Advisory</h3>
                  <p className="text-muted-foreground">{advice.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Hourly Forecast Chart */}
          <div className="glass-card p-6">
            <h3 className="font-display font-bold mb-6">24-Hour Temperature Forecast</h3>
            <div className="h-48 flex items-end gap-1">
              {hourlyData.map((temp, i) => {
                const height = ((temp - minTemp) / (maxTemp - minTemp)) * 100;
                const isNow = i === new Date().getHours();
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-mono text-muted-foreground">{temp}°</span>
                    <div
                      className={cn(
                        'w-full rounded-t transition-all duration-500',
                        isNow ? 'bg-primary' : 'bg-primary/40'
                      )}
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                    <span className={cn('text-xs', isNow ? 'text-primary font-bold' : 'text-muted-foreground')}>
                      {i.toString().padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Temperature Thresholds */}
          <div className="glass-card p-6">
            <h3 className="font-display font-bold mb-4">Alert Thresholds</h3>
            <div className="space-y-3">
              {Object.entries(thresholds).map(([key, { temp, message }]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full',
                        key === 'high' && 'bg-destructive',
                        key === 'warm' && 'bg-warning',
                        key === 'comfortable' && 'bg-success',
                        key === 'cool' && 'bg-primary',
                        key === 'cold' && 'bg-blue-400'
                      )}
                    />
                    <span className="capitalize font-medium">{key}</span>
                  </div>
                  <span className="font-mono text-sm">{temp}°C</span>
                  <span className="text-sm text-muted-foreground max-w-xs">{message}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
