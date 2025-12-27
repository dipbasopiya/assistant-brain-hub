import { useEffect } from 'react';
import { TrendingUp, Target, Clock, CheckCircle2, BarChart3 } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';

export default function Progress() {
  const { tasks, confidence, updateConfidence } = useJarvisStore();

  useEffect(() => {
    updateConfidence();
  }, [tasks]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Performance';
    if (score >= 60) return 'Good Progress';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical - Take Action';
  };

  const getAIFeedback = () => {
    if (confidence.overallScore >= 80) {
      return "Outstanding work! You're maintaining excellent productivity levels. Continue with your current approach.";
    }
    if (confidence.overallScore >= 60) {
      return "Good progress overall. Consider focusing on completing pending high-priority tasks to boost your score.";
    }
    if (confidence.overallScore >= 40) {
      return "Your productivity needs attention. Try breaking down larger tasks and setting smaller, achievable goals.";
    }
    return "Immediate action required. Review your pending tasks and prioritize the most critical ones. Consider delegating or rescheduling non-essential items.";
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-primary glow-text">Work Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your productivity and confidence metrics</p>
      </div>

      {/* Main Score Display */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-6">Confidence Score</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-56 h-56">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${confidence.overallScore * 2.64} 264`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="50%" stopColor="hsl(var(--secondary))" />
                    <stop offset="100%" stopColor="hsl(var(--success))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn('text-6xl font-display font-bold', getScoreColor(confidence.overallScore))}>
                  {Math.round(confidence.overallScore)}
                </span>
                <span className="text-sm text-muted-foreground mt-2">{getScoreLabel(confidence.overallScore)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-6">Task Distribution</h3>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Pending */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--warning))"
                  strokeWidth="16"
                  strokeDasharray={`${(stats.pending / stats.total) * 251.2 || 0} 251.2`}
                  strokeDashoffset="0"
                />
                {/* In Progress */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="16"
                  strokeDasharray={`${(stats.inProgress / stats.total) * 251.2 || 0} 251.2`}
                  strokeDashoffset={`-${(stats.pending / stats.total) * 251.2 || 0}`}
                />
                {/* Completed */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="16"
                  strokeDasharray={`${(stats.completed / stats.total) * 251.2 || 0} 251.2`}
                  strokeDashoffset={`-${((stats.pending + stats.inProgress) / stats.total) * 251.2 || 0}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-bold">{stats.total}</span>
                <span className="text-xs text-muted-foreground">Total Tasks</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Completed ({stats.completed})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Active ({stats.inProgress})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">Pending ({stats.pending})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown */}
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Task Completion</p>
              <p className="text-2xl font-display font-bold">{Math.round(confidence.taskCompletion)}%</p>
            </div>
          </div>
          <div className="progress-bar h-3">
            <div className="progress-bar-fill" style={{ width: `${confidence.taskCompletion}%` }} />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Timeliness</p>
              <p className="text-2xl font-display font-bold">{Math.round(confidence.timeliness)}%</p>
            </div>
          </div>
          <div className="progress-bar h-3">
            <div className="progress-bar-fill" style={{ width: `${confidence.timeliness}%` }} />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-secondary/10">
              <BarChart3 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consistency</p>
              <p className="text-2xl font-display font-bold">{Math.round(confidence.consistency)}%</p>
            </div>
          </div>
          <div className="progress-bar h-3">
            <div className="progress-bar-fill" style={{ width: `${confidence.consistency}%` }} />
          </div>
        </div>
      </div>

      {/* AI Feedback */}
      <div className="glass-card p-6 border-l-4 border-l-primary">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg mb-2">AI Productivity Feedback</h3>
            <p className="text-muted-foreground">{getAIFeedback()}</p>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="glass-card p-6">
        <h3 className="font-display font-bold mb-6">Weekly Progress</h3>
        <div className="h-48 flex items-end gap-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const value = 40 + Math.random() * 50;
            const isToday = i === new Date().getDay() - 1;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'w-full rounded-t transition-all duration-500',
                    isToday ? 'bg-primary' : 'bg-primary/40'
                  )}
                  style={{ height: `${value}%` }}
                />
                <span className={cn('text-xs', isToday ? 'text-primary font-bold' : 'text-muted-foreground')}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
