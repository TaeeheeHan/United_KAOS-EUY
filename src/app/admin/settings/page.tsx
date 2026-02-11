'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Package } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function AdminSettingsPage() {
  const [bulkThreshold, setBulkThreshold] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings?key=bulk_order_threshold')
      .then((r) => r.json())
      .then((data) => {
        if (data.value !== undefined) {
          setBulkThreshold(Number(data.value));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'bulk_order_threshold', value: bulkThreshold }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure store settings</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 space-y-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Order Type Threshold</h2>
            <p className="text-sm text-gray-500">
              Orders with total quantity at or above this number are classified as &quot;Bulk Order&quot;
            </p>
          </div>
        </div>

        {loading ? (
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Bulk threshold (pcs)
            </label>
            <input
              type="number"
              min={2}
              max={1000}
              value={bulkThreshold}
              onChange={(e) => setBulkThreshold(Math.max(2, parseInt(e.target.value) || 2))}
              className="w-28 px-4 py-3 border-2 border-gray-300 rounded-lg text-center font-semibold text-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <span className="text-sm text-gray-500">
              &lt; {bulkThreshold} = Personal, &ge; {bulkThreshold} = Bulk
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            loading={saving}
            disabled={saving || loading}
            leftIcon={Save}
          >
            Save
          </Button>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-green-600 font-medium"
            >
              Saved!
            </motion.span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
