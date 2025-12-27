import { useEffect } from 'react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';

export function ConfidenceCard() {
  const { confidence, updateConfidence } = useJarvisStore();

  useEffect(() => {
    updateConfidence();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="glass-card-hover p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Confidence Score</h3>

      {/* Main Score */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          {/* Outer ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${confidence.overallScore * 2.83} 283`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-4xl font-display font-bold', getScoreColor(confidence.overallScore))}>
              {Math.round(confidence.overallScore)}
            </span>
            <span className="text-xs text-muted-foreground mt-1">{getScoreLabel(confidence.overallScore)}</span>
          </div>
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Task Completion</span>
            <span className="font-mono">{Math.round(confidence.taskCompletion)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${confidence.taskCompletion}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Timeliness</span>
            <span className="font-mono">{Math.round(confidence.timeliness)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${confidence.timeliness}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Consistency</span>
            <span className="font-mono">{Math.round(confidence.consistency)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${confidence.consistency}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
