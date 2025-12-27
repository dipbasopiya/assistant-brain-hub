import { useState } from 'react';
import { Plus, Calendar, Clock, Flag, Check, Trash2, Edit2 } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Task } from '@/types/jarvis';

export default function Scheduler() {
  const { tasks, addTask, updateTask, deleteTask } = useJarvisStore();
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as Task['priority'] });

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    addTask({
      ...newTask,
      status: 'pending',
      dueDate: new Date(Date.now() + 86400000),
    });
    setNewTask({ title: '', description: '', priority: 'medium' });
    setShowForm(false);
  };

  const statusOrder = { 'in-progress': 0, pending: 1, completed: 2 };
  const sortedTasks = [...tasks].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary glow-text">Activity Scheduler</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your daily tasks and routines</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-display font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Tasks</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-display font-bold text-primary">{stats.inProgress}</p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-display font-bold text-warning">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-display font-bold text-success">{stats.completed}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
      </div>

      {/* New Task Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h3 className="font-display font-bold mb-4">Add New Task</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title..."
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter description..."
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 h-20 focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Priority</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setNewTask({ ...newTask, priority: p })}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      newTask.priority === p
                        ? p === 'high' ? 'bg-destructive text-destructive-foreground' :
                          p === 'medium' ? 'bg-warning text-warning-foreground' : 'bg-muted text-foreground'
                        : 'bg-muted/30 text-muted-foreground'
                    )}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddTask}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.map(task => (
          <div
            key={task.id}
            className={cn(
              'glass-card p-4 transition-all',
              task.status === 'completed' && 'opacity-60'
            )}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => updateTask(task.id, {
                  status: task.status === 'completed' ? 'pending' : 'completed',
                  completedAt: task.status !== 'completed' ? new Date() : undefined,
                })}
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5',
                  task.status === 'completed'
                    ? 'bg-success border-success text-success-foreground'
                    : 'border-muted-foreground hover:border-primary'
                )}
              >
                {task.status === 'completed' && <Check className="w-4 h-4" />}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={cn('font-medium', task.status === 'completed' && 'line-through text-muted-foreground')}>
                    {task.title}
                  </h3>
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
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      task.status === 'completed' && 'bg-success/20 text-success',
                      task.status === 'in-progress' && 'bg-primary/20 text-primary',
                      task.status === 'pending' && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {task.status}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Created: {format(new Date(task.createdAt), 'PP')}
                  </span>
                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due: {format(new Date(task.dueDate), 'PP')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {task.status !== 'completed' && (
                  <button
                    onClick={() => updateTask(task.id, { status: task.status === 'in-progress' ? 'pending' : 'in-progress' })}
                    className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-primary"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
