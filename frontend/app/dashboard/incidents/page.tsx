'use client';

import { useState, useEffect } from 'react';
import { getIncidents } from '@/lib/api';
import IncidentTable from '@/components/IncidentTable';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
    const interval = setInterval(loadIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadIncidents = async () => {
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (error) {
      console.error('Failed to load incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Incidents</h1>
        <p className="text-gray-600">System incidents and alerts</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading incidents...</div>
      ) : (
        <IncidentTable incidents={incidents} />
      )}
    </div>
  );
}
