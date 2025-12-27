import { useEffect } from 'react';
import { GitBranch, CheckCircle, AlertTriangle, Clock, XCircle, RefreshCw, Brain, Activity } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const statusConfig = {
  proceed: { 
    icon: CheckCircle, 
    color: 'text-success', 
    bg: 'bg-success/10', 
    border: 'border-success/30',
    label: 'PROCEED',
    description: 'All systems nominal. Safe to continue with planned activities.'
  },
  attention: { 
    icon: AlertTriangle, 
    color: 'text-warning', 
    bg: 'bg-warning/10', 
    border: 'border-warning/30',
    label: 'NEEDS ATTENTION',
    description: 'Some items require review before proceeding.'
  },
  reschedule: { 
    icon: Clock, 
    color: 'text-primary', 
    bg: 'bg-primary/10', 
    border: 'border-primary/30',
    label: 'RESCHEDULE',
    description: 'Current conditions suggest postponing planned activities.'
  },
  'high-risk': { 
    icon: XCircle, 
    color: 'text-destructive', 
    bg: 'bg-destructive/10', 
    border: 'border-destructive/30',
    label: 'HIGH RISK',
    description: 'Critical issues detected. Immediate action required.'
  },
};

export default function DecisionGate() {
  const { decision, evaluateDecision, updateConfidence, tasks, alerts, confidence } = useJarvisStore();

  useEffect(() => {
    updateConfidence();
    evaluateDecision();
  }, [tasks, alerts]);

  const handleReEvaluate = () => {
    updateConfidence();
    evaluateDecision();
  };

  if (!decision) return null;

  const config = statusConfig[decision.status];
  const Icon = config.icon;

  const inputMetrics = [
    { label: 'Task Completion', value: `${Math.round(confidence.taskCompletion)}%`, status: confidence.taskCompletion >= 60 },
    { label: 'Confidence Score', value: `${Math.round(confidence.overallScore)}%`, status: confidence.overallScore >= 60 },
    { label: 'Pending Tasks', value: tasks.filter(t => t.status === 'pending').length.toString(), status: tasks.filter(t => t.status === 'pending').length <= 3 },
    { label: 'Active Alerts', value: alerts.filter(a => !a.acknowledged).length.toString(), status: alerts.filter(a => !a.acknowledged).length <= 2 },
    { label: 'Critical Alerts', value: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length.toString(), status: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length === 0 },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary glow-text">Decision Gate System</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered decision analysis and recommendations</p>
        </div>
        <button
          onClick={handleReEvaluate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30 font-medium hover:bg-primary/30 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Re-evaluate
        </button>
      </div>

      {/* Main Decision Display */}
      <div className={cn('glass-card p-8 border-2', config.border)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={cn('p-6 rounded-2xl', config.bg)}>
              <Icon className={cn('w-16 h-16', config.color)} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Decision Status</p>
              <h2 className={cn('text-4xl font-display font-bold mb-2', config.color)}>
                {config.label}
              </h2>
              <p className="text-muted-foreground max-w-md">{config.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Last evaluated</p>
            <p className="font-mono text-sm">{format(new Date(decision.timestamp), 'PPpp')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Analysis Inputs */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold">Analysis Inputs</h3>
          </div>
          <div className="space-y-3">
            {inputMetrics.map((metric, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">{metric.label}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold">{metric.value}</span>
                  <div className={cn('w-2 h-2 rounded-full', metric.status ? 'bg-success' : 'bg-destructive')} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-secondary" />
            <h3 className="font-display font-bold">AI Analysis</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Reasoning</p>
              <ul className="space-y-2">
                {decision.reasoning.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Recommendations</p>
              <ul className="space-y-2">
                {decision.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 text-sm">
                    <span className="text-primary">→</span>
                    <span className="text-primary">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Flow Diagram */}
      <div className="glass-card p-6">
        <h3 className="font-display font-bold mb-6">Decision Flow</h3>
        <div className="flex items-center justify-center gap-4">
          {/* Inputs */}
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-muted/30 text-center text-sm">Tasks</div>
            <div className="p-3 rounded-lg bg-muted/30 text-center text-sm">Alerts</div>
            <div className="p-3 rounded-lg bg-muted/30 text-center text-sm">Confidence</div>
          </div>
          
          {/* Arrow */}
          <div className="text-primary text-2xl">→</div>
          
          {/* Processing */}
          <div className="p-6 rounded-xl bg-secondary/10 border border-secondary/30">
            <GitBranch className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="text-sm font-medium text-center">AI Decision Engine</p>
          </div>
          
          {/* Arrow */}
          <div className="text-primary text-2xl">→</div>
          
          {/* Outputs */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const StatusIcon = cfg.icon;
              const isActive = key === decision.status;
              return (
                <div
                  key={key}
                  className={cn(
                    'p-3 rounded-lg border text-center transition-all',
                    isActive ? cfg.bg + ' ' + cfg.border : 'bg-muted/20 border-transparent opacity-50'
                  )}
                >
                  <StatusIcon className={cn('w-5 h-5 mx-auto mb-1', isActive ? cfg.color : 'text-muted-foreground')} />
                  <p className={cn('text-xs', isActive ? cfg.color : 'text-muted-foreground')}>{cfg.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
