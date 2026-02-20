'use client';

import { useState } from 'react';
import { predictUpdateRisk } from '@/lib/api';

const UPDATE_TYPES = ['minor', 'major', 'hotfix'];
const SERVICES = ['auth', 'payments', 'database', 'notifications', 'dashboard', 'api'];

export default function UpdatePlannerPage() {
  const [formData, setFormData] = useState({
    update_title: '',
    update_type: 'minor',
    services_affected: [] as string[],
    db_migration: false,
    expected_minutes: 10,
    description: '',
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services_affected: prev.services_affected.includes(service)
        ? prev.services_affected.filter((s) => s !== service)
        : [...prev.services_affected, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const prediction = await predictUpdateRisk(formData);
      setResult(prediction);
    } catch (error) {
      console.error('Failed to predict risk:', error);
      alert('Failed to analyze update risk');
    } finally {
      setLoading(false);
    }
  };

  const riskLevelColors = {
    Low: 'bg-green-100 text-green-800 border-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    High: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Update Planner</h1>
        <p className="text-gray-600">Predict downtime risk before deployment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Title
              </label>
              <input
                type="text"
                value={formData.update_title}
                onChange={(e) => setFormData({ ...formData, update_title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Payment API v2.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Type
              </label>
              <select
                value={formData.update_type}
                onChange={(e) => setFormData({ ...formData, update_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {UPDATE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services Affected
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SERVICES.map((service) => (
                  <label key={service} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services_affected.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.db_migration}
                  onChange={(e) => setFormData({ ...formData, db_migration: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Database Migration Required</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Deployment Time (minutes)
              </label>
              <input
                type="number"
                value={formData.expected_minutes}
                onChange={(e) => setFormData({ ...formData, expected_minutes: parseInt(e.target.value) || 0 })}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the changes being deployed..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze Update Risk'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Risk Analysis</h2>
          {result ? (
            <div className="space-y-6">
              <div className={`p-4 rounded-lg border-2 ${riskLevelColors[result.risk_level as keyof typeof riskLevelColors]}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Risk Level</span>
                  <span className="text-2xl font-bold">{result.risk_level}</span>
                </div>
                <div className="text-3xl font-bold mt-2">{result.risk_score}/100</div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2">Predicted Downtime</h3>
                <p className="text-2xl font-bold text-blue-700">
                  {result.predicted_downtime_min} - {result.predicted_downtime_max} minutes
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Risk Reasons</h3>
                <ul className="space-y-2">
                  {result.reasons.map((reason: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Recommendations</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Submit update details to see risk analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
