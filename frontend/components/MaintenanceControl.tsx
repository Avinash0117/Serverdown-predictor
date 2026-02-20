'use client';

import { useState, useEffect } from 'react';
import { getMaintenanceStatus, enableMaintenance, disableMaintenance } from '@/lib/api';

export default function MaintenanceControl() {
  const [maintenance, setMaintenance] = useState<any>(null);
  const [etaMinutes, setEtaMinutes] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMaintenanceStatus();
  }, []);

  const loadMaintenanceStatus = async () => {
    try {
      const status = await getMaintenanceStatus();
      setMaintenance(status);
    } catch (error) {
      console.error('Failed to load maintenance status:', error);
    }
  };

  const handleEnable = async () => {
    setLoading(true);
    try {
      await enableMaintenance(etaMinutes);
      await loadMaintenanceStatus();
      alert('Maintenance mode enabled');
    } catch (error) {
      console.error('Failed to enable maintenance:', error);
      alert('Failed to enable maintenance mode');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      await disableMaintenance();
      await loadMaintenanceStatus();
      alert('Maintenance mode disabled');
    } catch (error) {
      console.error('Failed to disable maintenance:', error);
      alert('Failed to disable maintenance mode');
    } finally {
      setLoading(false);
    }
  };

  if (!maintenance) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Maintenance Mode</h3>
      
      <div className="mb-6">
        <div className={`inline-block px-4 py-2 rounded-lg ${
          maintenance.enabled 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          Status: {maintenance.enabled ? '🟡 Enabled' : '🟢 Disabled'}
        </div>
        {maintenance.enabled && maintenance.enabled_at && (
          <p className="mt-2 text-sm text-gray-600">
            Enabled at: {new Date(maintenance.enabled_at).toLocaleString()}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ETA (minutes)
          </label>
          <input
            type="number"
            value={etaMinutes}
            onChange={(e) => setEtaMinutes(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
            disabled={maintenance.enabled}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleEnable}
            disabled={maintenance.enabled || loading}
            className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Enable Maintenance Mode
          </button>
          <button
            onClick={handleDisable}
            disabled={!maintenance.enabled || loading}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Disable Maintenance Mode
          </button>
        </div>
      </div>
    </div>
  );
}
