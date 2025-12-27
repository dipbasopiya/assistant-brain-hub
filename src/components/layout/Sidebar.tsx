import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Thermometer,
  Bell,
  CalendarCheck,
  TrendingUp,
  GitBranch,
  ToggleLeft,
  FileText,
  ChevronLeft,
  ChevronRight,
  Bot,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/temperature', label: 'Temperature', icon: Thermometer },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/scheduler', label: 'Scheduler', icon: CalendarCheck },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
  { path: '/decision-gate', label: 'Decision Gate', icon: GitBranch },
  { path: '/devices', label: 'Devices', icon: ToggleLeft },
  { path: '/logs', label: 'Control Logs', icon: FileText },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center pulse-glow">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-sidebar" />
          </div>
          {!collapsed && (
            <div className="fade-in">
              <h1 className="font-display font-bold text-lg text-primary glow-text">JARVIS</h1>
              <p className="text-xs text-muted-foreground">AI Assistant</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 transition-all',
                  isActive ? 'text-primary' : 'group-hover:text-primary'
                )}
              />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Status Bar */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="glass-card p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">System Status</span>
              <span className="text-success font-medium">Online</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: '92%' }} />
            </div>
            <p className="text-xs text-muted-foreground">92% operational</p>
          </div>
        </div>
      )}
    </aside>
  );
}
