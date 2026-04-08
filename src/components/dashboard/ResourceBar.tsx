interface ResourceBarProps { label: string; used: number; total: number; unit: string; color?: string; }

const ResourceBar = ({ label, used, total, unit, color = "bg-primary" }: ResourceBarProps) => {
  const percentage = Math.round((used / total) * 100);
  const barColor = percentage > 85 ? "bg-destructive" : percentage > 65 ? "bg-yellow-500" : color;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{used} / {total} {unit}<span className="text-muted-foreground ml-2">({percentage}%)</span></span>
      </div>
      <div className="resource-bar"><div className={`resource-bar-fill ${barColor}`} style={{ width: `${percentage}%` }} /></div>
    </div>
  );
};

export default ResourceBar;