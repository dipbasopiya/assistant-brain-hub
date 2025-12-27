import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';

export function TaskOverview() {
  const { tasks } = useJarvisStore();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const recentTasks = tasks.slice(0, 4);

  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Task Overview</h3>
        <span className="text-xs font-mono text-primary">{completionRate}% Complete</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <ListTodo className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-mono font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-success/10">
          <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-success" />
          <p className="text-lg font-mono font-bold text-success">{stats.completed}</p>
          <p className="text-xs text-muted-foreground">Done</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-primary/10">
          <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-lg font-mono font-bold text-primary">{stats.inProgress}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-warning/10">
          <AlertCircle className="w-5 h-5 mx-auto mb-1 text-warning" />
          <p className="text-lg font-mono font-bold text-warning">{stats.pending}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground mb-2">Recent Tasks</p>
        {recentTasks.map(task => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
          >
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                task.status === 'completed' && 'bg-success',
                task.status === 'in-progress' && 'bg-primary',
                task.status === 'pending' && 'bg-warning'
              )}
            />
            <span className="flex-1 text-sm truncate">{task.title}</span>
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded',
                task.priority === 'high' && 'bg-destructive/20 text-destructive',
                task.priority === 'medium' && 'bg-warning/20 text-warning',
                task.priority === 'low' && 'bg-muted text-muted-foreground'
              )}
            >
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
