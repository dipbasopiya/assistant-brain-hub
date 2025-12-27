import { useState } from 'react';
import { FileText, Download, Trash2, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function Logs() {
  const { controlLogs, clearLogs } = useJarvisStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');

  const filteredLogs = controlLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const exportLogs = () => {
    const data = controlLogs.map(log => ({
      timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      action: log.action,
      target: log.target,
      status: log.status,
      details: log.details || '',
    }));
    
    const csv = [
      'Timestamp,Action,Target,Status,Details',
      ...data.map(row => `"${row.timestamp}","${row.action}","${row.target}","${row.status}","${row.details}"`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarvis-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const stats = {
    total: controlLogs.length,
    success: controlLogs.filter(l => l.status === 'success').length,
    failed: controlLogs.filter(l => l.status === 'failed').length,
    pending: controlLogs.filter(l => l.status === 'pending').length,
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary glow-text">Control Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete history of system actions and events</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30 font-medium hover:bg-primary/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={clearLogs}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/20 text-destructive border border-destructive/30 font-medium hover:bg-destructive/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Logs</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-success">{stats.success}</p>
              <p className="text-xs text-muted-foreground">Successful</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-destructive">{stats.failed}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-warning">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(['all', 'success', 'failed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                filterStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Timestamp</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Target</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No logs found</p>
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-mono text-sm">
                    {format(new Date(log.timestamp), 'PP HH:mm:ss')}
                  </td>
                  <td className="p-4 font-medium">{log.action}</td>
                  <td className="p-4">{log.target}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        log.status === 'success' && 'bg-success/20 text-success',
                        log.status === 'failed' && 'bg-destructive/20 text-destructive',
                        log.status === 'pending' && 'bg-warning/20 text-warning'
                      )}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                    {log.details || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
