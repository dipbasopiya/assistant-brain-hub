import { useEffect } from 'react';
import { Cloud, Droplets, Wind, MapPin, Thermometer, Sun, CloudRain, Snowflake } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';

const weatherIcons: Record<string, React.ElementType> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
};

export function WeatherCard() {
  const { weather, setWeather, addAlert } = useJarvisStore();

  useEffect(() => {
    // Simulate weather data (in production, use a real API)
    const mockWeather = {
      temperature: 32,
      condition: 'sunny',
      humidity: 65,
      windSpeed: 12,
      location: 'New Delhi, India',
      icon: 'sunny',
    };
    setWeather(mockWeather);

    // Generate temperature-based alerts
    if (mockWeather.temperature > 35) {
      addAlert({
        type: 'temperature',
        severity: 'critical',
        title: 'Extreme Heat Warning',
        message: 'Temperature exceeds 35°C. Stay hydrated and avoid outdoor activities.',
        acknowledged: false,
      });
    } else if (mockWeather.temperature > 30) {
      addAlert({
        type: 'temperature',
        severity: 'warning',
        title: 'High Temperature Alert',
        message: 'Temperature is high. Remember to drink water regularly.',
        acknowledged: false,
      });
    } else if (mockWeather.temperature < 10) {
      addAlert({
        type: 'temperature',
        severity: 'warning',
        title: 'Cold Weather Alert',
        message: 'Temperature is low. Wear warm clothing when going outside.',
        acknowledged: false,
      });
    }
  }, []);

  if (!weather) return null;

  const WeatherIcon = weatherIcons[weather.icon] || Sun;
  const tempColor = weather.temperature > 30 ? 'text-warning' : weather.temperature < 15 ? 'text-blue-400' : 'text-success';

  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Weather</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{weather.location}</span>
          </div>
        </div>
        <div className={cn('p-3 rounded-xl bg-primary/10', weather.icon === 'sunny' && 'bg-warning/10')}>
          <WeatherIcon className={cn('w-8 h-8', weather.icon === 'sunny' ? 'text-warning' : 'text-primary')} />
        </div>
      </div>

      <div className="flex items-end gap-2 mb-6">
        <span className={cn('stat-value', tempColor)}>{weather.temperature}°</span>
        <span className="text-muted-foreground mb-1">C</span>
        <span className="text-sm text-muted-foreground mb-1 capitalize ml-2">{weather.condition}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Droplets className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-sm font-mono font-medium">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Wind className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="text-sm font-mono font-medium">{weather.windSpeed} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
