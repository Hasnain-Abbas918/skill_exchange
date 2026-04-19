import { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const labels = {
  1: 'Very poor 😞',
  2: 'Needs improvement 😕',
  3: 'Average 😐',
  4: 'Good 😊',
  5: 'Excellent! 🌟',
};

const ReviewModal = ({ exchange, revieweeId, revieweeName, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error('Please select a star rating first');
    setLoading(true);
    try {
      await api.post('/reviews', {
        revieweeId,
        exchangeId: exchange.id,
        rating,
        comment,
        type: 'exchange',
      });
      toast.success('Review submitted successfully! ⭐');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Write a Review</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Reviewee */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg">
              {revieweeName?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-400">You are reviewing</p>
              <p className="font-semibold text-gray-900">{revieweeName}</p>
            </div>
          </div>

          {/* Stars */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Give a rating</p>
            <div className="flex gap-2 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={
                      s <= (hovered || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200 fill-gray-200'
                    }
                  />
                </button>
              ))}
            </div>
            {(hovered || rating) > 0 && (
              <p className="text-center text-sm text-gray-500">
                {labels[hovered || rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Share your experience..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-brand/90 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Send size={15} /> Submit</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;