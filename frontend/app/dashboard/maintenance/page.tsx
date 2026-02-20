'use client';

import MaintenanceControl from '@/components/MaintenanceControl';

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Maintenance Control</h1>
        <p className="text-gray-600">Enable or disable maintenance mode</p>
      </div>

      <MaintenanceControl />
    </div>
  );
}
