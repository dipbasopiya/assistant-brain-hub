import { useEffect } from 'react';
import { GitBranch, CheckCircle, AlertTriangle, Clock, XCircle } from 'lucide-react';
import { useJarvisStore } from '@/stores/jarvisStore';
import { cn } from '@/lib/utils';

const statusConfig = {
  proceed: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'PROCEED' },
  attention: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'NEEDS ATTENTION' },
  reschedule: { icon: Clock, color: 'text-primary', bg: 'bg-primary/10', label: 'RESCHEDULE' },
  'high-risk': { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'HIGH RISK' },
};

export function DecisionGateCard() {
  const { decision, evaluateDecision, updateConfidence } = useJarvisStore();

  useEffect(() => {
    updateConfidence();
    evaluateDecision();
  }, []);

  if (!decision) return null;

  const config = statusConfig[decision.status];
  const Icon = config.icon;

  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground">Decision Gate</h3>
      </div>

      {/* Status Badge */}
      <div className={cn('p-4 rounded-xl mb-4', config.bg)}>
        <div className="flex items-center gap-3">
          <Icon className={cn('w-8 h-8', config.color)} />
          <div>
            <p className={cn('text-lg font-display font-bold', config.color)}>{config.label}</p>
            <p className="text-xs text-muted-foreground">AI Decision Analysis</p>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Analysis</p>
        <ul className="space-y-1">
          {decision.reasoning.map((reason, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="p-3 rounded-lg bg-muted/30">
        <p className="text-xs text-muted-foreground mb-2">Recommendations</p>
        <ul className="space-y-1">
          {decision.recommendations.map((rec, i) => (
            <li key={i} className="text-sm text-primary flex items-start gap-2">
              <span className="mt-1">→</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
