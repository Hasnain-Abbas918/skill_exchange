import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';  // ✅ Link add kiya
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Calendar, Clock } from 'lucide-react';

const SchedulePage = () => {
  const { exchangeId } = useParams();
  const [slots, setSlots] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/schedule/overlap/${exchangeId}`).then(({ data }) => setSlots(data.slots || []));
    api.get(`/schedule/sessions/${exchangeId}`).then(({ data }) => setSessions(data));
  }, [exchangeId]);

  const scheduleSession = async (scheduledAt) => {
    setLoading(true);
    try {
      await api.post('/schedule/session', { exchangeId, scheduledAt });
      toast.success('Session scheduled!');
      const { data } = await api.get(`/schedule/sessions/${exchangeId}`);
      setSessions(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule');
    }
    setLoading(false);
  };

  const handleCustomSchedule = () => {
    if (!customDate || !customTime) return toast.error('Select date and time');
    const scheduledAt = new Date(`${customDate}T${customTime}`).toISOString();
    scheduleSession(scheduledAt);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Schedule a Session</h1>

      {slots.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-brand" /> Overlapping Availability Slots
          </h2>
          <div className="space-y-2">
            {slots.map((slot, idx) => (
              <div key={idx} className="flex items-center justify-between bg-brand-light rounded-xl p-3">
                <div>
                  <span className="font-medium text-brand">{slot.day}</span>
                  <span className="text-gray-600 text-sm ml-3">{slot.startTime} – {slot.endTime}</span>
                </div>
                <button
                  onClick={() => {
                    const next = new Date();
                    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                    const targetDay = days.indexOf(slot.day);
                    while (next.getDay() !== targetDay) next.setDate(next.getDate() + 1);
                    const [h, m] = slot.startTime.split(':');
                    next.setHours(h, m, 0);
                    scheduleSession(next.toISOString());
                  }}
                  disabled={loading}
                  className="btn-primary text-xs">
                  Schedule
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-brand" /> Custom Date & Time
        </h2>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} className="input-field" min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
            <input type="time" value={customTime} onChange={(e) => setCustomTime(e.target.value)} className="input-field" />
          </div>
          <button onClick={handleCustomSchedule} disabled={loading} className="btn-primary">Schedule</button>
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Scheduled Sessions</h2>
          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="font-medium text-sm">{new Date(s.scheduledAt).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 capitalize">Status: {s.status}</p>
                </div>
                {s.status === 'scheduled' && (
                  <Link to={`/session/${s.roomId}`} className="btn-primary text-xs">  {/* ✅ Link */}
                    Join
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;