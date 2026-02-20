'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status?: 'good' | 'warning' | 'danger';
  icon?: string;
}

export default function MetricCard({ title, value, unit = '', status = 'good', icon }: MetricCardProps) {
  const statusColors = {
    good: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    danger: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${statusColors[status]} transition-all hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium opacity-80">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-3xl font-bold">
        {value}
        {unit && <span className="text-lg ml-1">{unit}</span>}
      </div>
    </div>
  );
}
