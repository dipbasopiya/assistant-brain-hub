import { Sun, Cloud, CloudRain, Snowflake, Leaf } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';
import { Season } from '@/types/jarvis';

const seasonConfig: Record<Season, { icon: React.ElementType; color: string; bg: string; tips: string[] }> = {
  spring: {
    icon: Leaf,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    tips: ['Perfect weather for outdoor activities', 'Stay hydrated', 'Watch for pollen allergies'],
  },
  summer: {
    icon: Sun,
    color: 'text-warning',
    bg: 'bg-warning/10',
    tips: ['Stay hydrated - drink 8+ glasses of water', 'Avoid outdoor activities 12-4 PM', 'Wear light, breathable clothing'],
  },
  monsoon: {
    icon: CloudRain,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    tips: ['Carry an umbrella', 'Avoid flooded areas', 'Watch for weather warnings'],
  },
  autumn: {
    icon: Cloud,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    tips: ['Layer your clothing', 'Great for outdoor walks', 'Watch for temperature drops'],
  },
  winter: {
    icon: Snowflake,
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
    tips: ['Wear warm layers', 'Keep indoor heating optimal', 'Hot beverages recommended'],
  },
};

export function SeasonalCard() {
  const { currentSeason, setSeason } = useJarvisStore();
  const config = seasonConfig[currentSeason];
  const Icon = config.icon;

  const seasons: Season[] = ['spring', 'summer', 'monsoon', 'autumn', 'winter'];

  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Seasonal Advisory</h3>
        <select
          value={currentSeason}
          onChange={(e) => setSeason(e.target.value as Season)}
          className="text-xs bg-muted border border-border rounded px-2 py-1 focus:outline-none focus:border-primary"
        >
          {seasons.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className={cn('p-4 rounded-xl mb-4', config.bg)}>
        <div className="flex items-center gap-3">
          <Icon className={cn('w-10 h-10', config.color)} />
          <div>
            <p className={cn('text-xl font-display font-bold capitalize', config.color)}>
              {currentSeason}
            </p>
            <p className="text-xs text-muted-foreground">Current Season</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">AI Recommendations</p>
        {config.tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/20">
            <span className="text-primary text-sm">💡</span>
            <p className="text-sm">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
