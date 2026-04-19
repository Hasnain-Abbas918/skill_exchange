import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import ReviewModal from '../components/reviews/ReviewModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExchanges } from '../store/slices/exchangeSlice';
import { Link } from 'react-router-dom';
import Loader from '../components/common/Loader';

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-700',
  active:    'bg-green-100 text-green-700',
  paused:    'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

const ExchangesPage = () => {
  const dispatch = useDispatch();
  const { exchanges = [], loading } = useSelector((state) => state.exchanges);
  const { user } = useSelector((state) => state.auth);
  const [reviewModal, setReviewModal] = useState(null);

  useEffect(() => { dispatch(fetchExchanges()); }, [dispatch]);

  const openReviewModal = (ex) => {
    if (!user) return;
    const isUserA      = ex.userAId === user?.id;
    const revieweeId   = isUserA ? ex.userBId : ex.userAId;
    const revieweeName = ex.partner?.name || (isUserA ? ex.userB?.name : ex.userA?.name);
    setReviewModal({ exchange: ex, revieweeId, revieweeName });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Exchanges</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {exchanges.length} total · {exchanges.filter(e => e.status === 'active').length} active
          </p>
        </div>
        <Link to="/bids" className="btn-secondary text-sm">+ Browse Bids</Link>
      </div>

      {/* LOADING */}
      {loading ? <Loader text="Loading exchanges..." /> : (
        <div className="space-y-3">

          {/* LIST */}
          {exchanges.map((ex) => (
            <div key={ex.id} className="card flex items-center justify-between gap-4">

              {/* LEFT */}
              <div className="flex items-center gap-4 min-w-0">
                <Link to={`/profile/${ex.partner?.id}`}>
                  <div className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center font-bold shrink-0 hover:opacity-80 transition-opacity">
                    {ex.partner?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                </Link>
                <div className="min-w-0">
                  <Link
                    to={`/profile/${ex.partner?.id}`}
                    className="font-semibold text-gray-900 truncate hover:text-brand transition-colors block"
                  >
                    {ex.partner?.name || 'Unknown'}
                  </Link>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                      {ex.bid?.skillOffered || 'N/A'}
                    </span>
                    <span className="text-gray-400 text-xs">↔</span>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md">
                      {ex.bid?.skillWanted || 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {ex.createdAt ? new Date(ex.createdAt).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">

                {/* Status */}
                <span className={`badge ${statusColors[ex.status] || 'bg-gray-100 text-gray-600'}`}>
                  {ex.status}
                </span>

                {/* Streak — active par */}
                {ex.status === 'active' && ex.streak > 0 && (
                  <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-medium">
                    🔥 {ex.streak}
                  </span>
                )}

                {/* Review Button — sirf completed par */}
                {ex.status === 'completed' && (
                  <button
                    onClick={() => openReviewModal(ex)}
                    className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition font-medium"
                  >
                    <Star size={12} fill="currentColor" /> Review Likho
                  </button>
                )}

                {/* View */}
                <Link to={`/exchanges/${ex.id}`} className="btn-secondary text-xs">
                  View →
                </Link>
              </div>
            </div>
          ))}

          {/* EMPTY */}
          {exchanges.length === 0 && (
            <div className="card text-center py-16">
              <p className="text-gray-400 text-lg">No exchanges yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Browse bids and send a request to get started!
              </p>
              <Link to="/bids" className="btn-primary inline-block mt-4 text-sm">
                Browse Bids
              </Link>
            </div>
          )}
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewModal && (
        <ReviewModal
          exchange={reviewModal.exchange}
          revieweeId={reviewModal.revieweeId}
          revieweeName={reviewModal.revieweeName}
          onClose={() => setReviewModal(null)}
          onSuccess={() => {
            setReviewModal(null);
            dispatch(fetchExchanges());
          }}
        />
      )}
    </div>
  );
};

export default ExchangesPage;