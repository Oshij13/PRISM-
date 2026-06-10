import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
}

export function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-accent rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {change && (
          <span
            className={`text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-semibold mb-2">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
}
