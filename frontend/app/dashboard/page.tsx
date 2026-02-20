'use client';

import { useState, useEffect } from 'react';
import { getLiveMetrics, getIncidents } from '@/lib/api';
import MetricCard from '@/components/MetricCard';
import ChartPanel from '@/components/ChartPanel';
import IncidentTable from '@/components/IncidentTable';

interface Metrics {
  status: string;
  cpu: number;
  ram: number;
  response_time: number;
  error_rate: number;
  db_latency: number;
  timestamp: string;
}

interface ChartData {
  time: string;
  value: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [incidents, setIncidents] = useState([]);
  const [chartData, setChartData] = useState<{
    cpu: ChartData[];
    ram: ChartData[];
    responseTime: ChartData[];
    errorRate: ChartData[];
  }>({
    cpu: [],
    ram: [],
    responseTime: [],
    errorRate: [],
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [metricsData, incidentsData] = await Promise.all([
        getLiveMetrics(),
        getIncidents(),
      ]);

      setMetrics(metricsData);
      setIncidents(incidentsData.slice(0, 10));

      // Update charts (keep last 30 readings)
      const now = new Date().toISOString();
      setChartData((prev) => ({
        cpu: [...prev.cpu.slice(-29), { time: now, value: metricsData.cpu }],
        ram: [...prev.ram.slice(-29), { time: now, value: metricsData.ram }],
        responseTime: [...prev.responseTime.slice(-29), { time: now, value: metricsData.response_time }],
        errorRate: [...prev.errorRate.slice(-29), { time: now, value: metricsData.error_rate }],
      }));
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'good';
      case 'degraded':
        return 'warning';
      case 'down':
      case 'maintenance':
        return 'danger';
      default:
        return 'good';
    }
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Real-time server health monitoring</p>
      </div>

      {/* Status Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">System Status</h2>
            <p className="text-sm text-gray-600">Current operational status</p>
          </div>
          <div className={`px-6 py-3 rounded-lg font-semibold ${
            metrics.status === 'operational' 
              ? 'bg-green-100 text-green-800'
              : metrics.status === 'degraded'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {metrics.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Server Status"
          value={metrics.status}
          status={getStatusColor(metrics.status)}
          icon="🖥️"
        />
        <MetricCard
          title="CPU Usage"
          value={metrics.cpu.toFixed(1)}
          unit="%"
          status={metrics.cpu > 80 ? 'danger' : metrics.cpu > 60 ? 'warning' : 'good'}
          icon="⚡"
        />
        <MetricCard
          title="RAM Usage"
          value={metrics.ram.toFixed(1)}
          unit="%"
          status={metrics.ram > 85 ? 'danger' : metrics.ram > 70 ? 'warning' : 'good'}
          icon="💾"
        />
        <MetricCard
          title="Response Time"
          value={metrics.response_time.toFixed(0)}
          unit="ms"
          status={metrics.response_time > 1200 ? 'danger' : metrics.response_time > 500 ? 'warning' : 'good'}
          icon="⏱️"
        />
        <MetricCard
          title="Error Rate"
          value={metrics.error_rate.toFixed(2)}
          unit="%"
          status={metrics.error_rate > 5 ? 'danger' : metrics.error_rate > 2 ? 'warning' : 'good'}
          icon="⚠️"
        />
        <MetricCard
          title="DB Latency"
          value={metrics.db_latency.toFixed(0)}
          unit="ms"
          status={metrics.db_latency > 100 ? 'danger' : metrics.db_latency > 50 ? 'warning' : 'good'}
          icon="🗄️"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPanel
          title="CPU Usage Over Time"
          data={chartData.cpu}
          dataKey="value"
          color="#3b82f6"
          unit="%"
        />
        <ChartPanel
          title="RAM Usage Over Time"
          data={chartData.ram}
          dataKey="value"
          color="#10b981"
          unit="%"
        />
        <ChartPanel
          title="Response Time Over Time"
          data={chartData.responseTime}
          dataKey="value"
          color="#f59e0b"
          unit="ms"
        />
        <ChartPanel
          title="Error Rate Over Time"
          data={chartData.errorRate}
          dataKey="value"
          color="#ef4444"
          unit="%"
        />
      </div>

      {/* Incidents */}
      <IncidentTable incidents={incidents} />
    </div>
  );
}
