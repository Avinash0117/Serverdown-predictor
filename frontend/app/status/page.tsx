'use client';

import { useState, useEffect } from 'react';
import { getLiveMetrics, getMaintenanceStatus, getIncidents } from '@/lib/api';

export default function StatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [maintenance, setMaintenance] = useState<any>(null);
  const [incidents, setIncidents] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (maintenance?.enabled && maintenance?.enabled_at) {
      const calculateTimeRemaining = () => {
        const enabledAt = new Date(maintenance.enabled_at);
        const now = new Date();
        const elapsed = (now.getTime() - enabledAt.getTime()) / 1000 / 60; // minutes
        const remaining = Math.max(0, maintenance.eta_minutes - elapsed);
        setTimeRemaining(Math.ceil(remaining));
      };

      calculateTimeRemaining();
      const timer = setInterval(calculateTimeRemaining, 1000);
      return () => clearInterval(timer);
    }
  }, [maintenance]);

  const loadStatus = async () => {
    try {
      const [metrics, maintenanceData, incidentsData] = await Promise.all([
        getLiveMetrics(),
        getMaintenanceStatus(),
        getIncidents(),
      ]);
      setStatus(metrics);
      setMaintenance(maintenanceData);
      setIncidents(incidentsData.slice(0, 5));
    } catch (error: any) {
      console.error('Failed to load status:', error);
      // Don't set status to null on error, keep showing loading or error state
      if (!status) {
        // Only show error on first load
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'All Systems Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'down':
        return 'Service Unavailable';
      case 'maintenance':
        return 'Under Maintenance';
      default:
        return 'Unknown';
    }
  };

  if (!status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-500 mb-4">Loading status...</div>
          <p className="text-sm text-gray-400">If this persists, ensure the backend is running on http://localhost:8000</p>
        </div>
      </div>
    );
  }

  const progress = maintenance?.enabled && maintenance?.eta_minutes
    ? ((maintenance.eta_minutes - timeRemaining) / maintenance.eta_minutes) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">UptimeGuard AI</h1>
          <p className="text-xl text-gray-600">System Status</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <div className={`inline-block w-24 h-24 rounded-full ${getStatusColor(status.status)} mb-6 animate-pulse`}></div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {getStatusText(status.status)}
            </h2>
            <p className="text-gray-600">Last updated: {new Date(status.timestamp).toLocaleString()}</p>
          </div>

          {/* Maintenance ETA */}
          {status.status === 'maintenance' && maintenance?.enabled && (
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Maintenance in Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Estimated time remaining</span>
                  <span className="font-semibold">{timeRemaining} minutes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-1000 rounded-full"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                We're performing scheduled maintenance. Services will be restored shortly.
              </p>
            </div>
          )}

          {/* Down Status */}
          {status.status === 'down' && (
            <div className="mt-8 p-6 bg-red-50 rounded-xl border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Service Unavailable</h3>
              <p className="text-red-700">
                We're working on fixing the issue. Please check back soon.
              </p>
            </div>
          )}
        </div>

        {/* Recent Incidents */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Incidents</h3>
          {incidents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent incidents</p>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident: any) => (
                <div
                  key={incident.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        incident.severity === 'critical' || incident.severity === 'high'
                          ? 'bg-red-100 text-red-800'
                          : incident.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {incident.severity}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(incident.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{incident.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
