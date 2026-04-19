import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/admin/reports');
    setReports(data);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const resolve = async (id, status, applyPenalty = false) => {
    await api.put(`/admin/reports/${id}/resolve`, { status, adminNote: 'Reviewed by admin', applyPenalty });
    toast.success(`Report ${status}${applyPenalty ? ' — User banned' : ''}`);
    load();
  };

  const typeColors = { no_show: 'bg-orange-100 text-orange-700', misconduct: 'bg-red-100 text-red-700', technical: 'bg-blue-100 text-blue-700' };
  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', resolved: 'bg-green-100 text-green-700', dismissed: 'bg-gray-100 text-gray-600' };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Review Reports</h1>
      {loading ? <p className="text-center text-gray-400 py-12">Loading...</p> : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`badge ${typeColors[r.type]}`}>{r.type.replace('_', ' ')}</span>
                    <span className={`badge ${statusColors[r.status]}`}>{r.status}</span>
                    {r.penaltyApplied && <span className="badge bg-red-100 text-red-700">⚠ Penalty Applied</span>}
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    <span className="text-brand">{r.reporter?.name}</span> reported <span className="text-red-600">{r.reported?.name}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">{r.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {r.status === 'pending' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button onClick={() => resolve(r.id, 'dismissed')} className="btn-secondary text-xs">Dismiss</button>
                  <button onClick={() => resolve(r.id, 'resolved')} className="btn-primary text-xs">Resolve</button>
                  <button onClick={() => resolve(r.id, 'resolved', true)} className="btn-danger text-xs">Resolve + Ban User</button>
                </div>
              )}
              {r.adminNote && r.status !== 'pending' && (
                <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">Admin note: {r.adminNote}</p>
              )}
            </div>
          ))}
          {reports.length === 0 && <div className="card text-center py-12 text-gray-400">No reports to review 🎉</div>}
        </div>
      )}
    </div>
  );
};

export default AdminReports;