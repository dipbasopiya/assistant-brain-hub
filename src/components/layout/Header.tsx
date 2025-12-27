import { useState, useEffect } from 'react';
import { Bell, Search, Mic, User } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { alerts } = useJarvisStore();
  const unreadAlerts = alerts.filter(a => !a.acknowledged).length;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      {/* Left Section - Time & Date */}
      <div className="flex items-center gap-6">
        <div>
          <p className="font-mono text-2xl font-bold text-primary glow-text">
            {formatTime(currentTime)}
          </p>
          <p className="text-xs text-muted-foreground">{formatDate(currentTime)}</p>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search modules, tasks, or commands..."
            className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-12 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors">
            <Mic className="w-3.5 h-3.5 text-primary" />
          </button>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium animate-pulse">
              {unreadAlerts > 9 ? '9+' : unreadAlerts}
            </span>
          )}
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium">Operator</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
