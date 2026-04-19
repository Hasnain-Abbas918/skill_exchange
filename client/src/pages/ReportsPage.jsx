import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Flag, AlertTriangle, CheckCircle, Clock, ChevronDown } from 'lucide-react';

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-700',
  reviewed:  'bg-blue-100 text-blue-700',
  resolved:  'bg-green-100 text-green-700',
  dismissed: 'bg-gray-100 text-gray-600',
};

const typeLabels = {
  no_show:    'No Show',
  misconduct: 'Misconduct',
  technical:  'Technical Issue',
};

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [form, setForm] = useState({
    reportedId: '',
    reportedName: '',
    exchangeId: '',
    type: 'no_show',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/reports/my'),
      api.get('/exchanges'),
    ])
      .then(([rRes, eRes]) => {
        setReports(rRes.data);
        setExchanges(eRes.data || []);
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  // Auto-fill partner when exchange is selected
  const handleExchangeChange = (exchangeId) => {
    if (!exchangeId) {
      setForm(f => ({
        ...f,
        exchangeId: '',
        reportedId: '',
        reportedName: ''
      }));
      return;
    }

    const ex = exchanges.find(e => e.id === exchangeId);
    if (!ex) return;

    const partner = ex.partner;

    if (!partner || !partner.id) {
      toast.error('Partner information not found');
      return;
    }

    setForm(f => ({
      ...f,
      exchangeId,
      reportedId: partner.id,
      reportedName: partner.name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.reportedId)
      return toast.error('Please select an exchange first');

    if (!form.description.trim())
      return toast.error('Description is required');

    setSubmitting(true);

    try {
      await api.post('/reports', {
        reportedId: form.reportedId,
        exchangeId: form.exchangeId || undefined,
        type: form.type,
        description: form.description,
      });

      toast.success('Report submitted successfully!');

      setForm({
        reportedId: '',
        reportedName: '',
        exchangeId: '',
        type: 'no_show',
        description: ''
      });

      const { data } = await api.get('/reports/my');
      setReports(data);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Reports</h1>
      <p className="text-sm text-gray-500 mb-6">
        Report any issue — admin will review it
      </p>

      {/* FORM */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Flag size={18} className="text-red-500" /> Submit a Report
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Exchange Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Exchange <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <select
                value={form.exchangeId}
                onChange={(e) => handleExchangeChange(e.target.value)}
                className="input-field appearance-none pr-10"
                required
              >
                <option value="">-- Choose an exchange --</option>
                {exchanges
                  .filter(ex => ['active', 'paused', 'completed'].includes(ex.status))
                  .map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.partner?.name || 'Partner'} — {ex.bid?.skillOffered} ↔ {ex.bid?.skillWanted} ({ex.status})
                    </option>
                  ))}
              </select>

              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {exchanges.filter(ex => ['active','paused','completed'].includes(ex.status)).length === 0 && !loading && (
              <p className="text-xs text-gray-400 mt-1">
                No active exchanges available
              </p>
            )}
          </div>

          {/* Auto-filled Partner */}
          {form.reportedName && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-red-200 text-red-700 flex items-center justify-center font-bold text-sm shrink-0">
                {form.reportedName[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-500">Reporting against:</p>
                <p className="text-sm font-semibold text-red-600">
                  {form.reportedName}
                </p>
              </div>
            </div>
          )}

          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Report Type
            </label>

            <div className="relative">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field appearance-none pr-10"
              >
                <option value="no_show">No Show — Did not join session</option>
                <option value="misconduct">Misconduct — Bad behavior</option>
                <option value="technical">Technical Issue — Platform problem</option>
              </select>

              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field"
              rows={4}
              placeholder="Describe the issue in detail..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !form.reportedId}
            className="btn-danger w-full py-3 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Flag size={16} /> Submit Report
              </>
            )}
          </button>
        </form>
      </div>

      {/* MY REPORTS */}
      <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock size={16} className="text-gray-400" />
        My Reports ({reports.length})
      </h2>

      <div className="space-y-3">
        {reports.map((r) => (
          <div key={r.id} className="card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">

                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={14} className="text-red-500 shrink-0" />
                  <p className="font-medium text-gray-900 text-sm">
                    Against: {r.reported?.name || 'Unknown'}
                  </p>
                </div>

                <p className="text-xs text-gray-500 capitalize mb-1">
                  Type: {typeLabels[r.type] || r.type}
                </p>

                <p className="text-sm text-gray-600">{r.description}</p>

                {r.adminNote && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium">
                      Admin Note:
                    </p>
                    <p className="text-xs text-blue-600">
                      {r.adminNote}
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span className={`badge shrink-0 ${statusColors[r.status] || 'bg-gray-100 text-gray-600'}`}>
                {r.status}
              </span>
            </div>
          </div>
        ))}

        {reports.length === 0 && !loading && (
          <div className="card text-center py-10 text-gray-400">
            <CheckCircle size={28} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">No reports yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;