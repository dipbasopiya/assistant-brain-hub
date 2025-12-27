import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { ConfidenceCard } from '@/components/dashboard/ConfidenceCard';
import { TaskOverview } from '@/components/dashboard/TaskOverview';
import { AlertsCard } from '@/components/dashboard/AlertsCard';
import { DeviceStatusCard } from '@/components/dashboard/DeviceStatusCard';
import { DecisionGateCard } from '@/components/dashboard/DecisionGateCard';
import { SeasonalCard } from '@/components/dashboard/SeasonalCard';
import { QuickStats } from '@/components/dashboard/QuickStats';

export default function Dashboard() {
  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-primary glow-text">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back. All systems operational.</p>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          <WeatherCard />
          <SeasonalCard />
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <ConfidenceCard />
          <TaskOverview />
        </div>

        {/* Column 3 */}
        <div className="space-y-6">
          <DecisionGateCard />
          <AlertsCard />
        </div>
      </div>

      {/* Device Control */}
      <DeviceStatusCard />
    </div>
  );
}
