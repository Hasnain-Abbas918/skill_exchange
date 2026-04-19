import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { verifyOTP } from '../store/slices/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';

const OTPPage = () => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const userId = state?.userId;
  const email = state?.email;

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const newDigits = [...digits];
    newDigits[idx] = val;
    setDigits(newDigits);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = digits.join('');
    if (otp.length !== 6) return toast.error('Enter all 6 digits');
    setLoading(true);
    const result = await dispatch(verifyOTP({ userId, otp }));
    setLoading(false);
    if (verifyOTP.fulfilled.match(result)) {
      toast.success('Email verified! Welcome to SkillSwap 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Invalid OTP');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await api.post('/auth/resend-otp', { userId });
      toast.success('New OTP sent to your email!');
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="card text-center">
          <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="text-brand" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 text-sm mb-6">
            We sent a 6-digit code to<br /><span className="font-medium text-gray-700">{email || 'your email'}</span>
          </p>

          <div className="flex gap-2 justify-center mb-6">
            {digits.map((d, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
              />
            ))}
          </div>

          <button onClick={handleVerify} disabled={loading || digits.some((d) => !d)} className="btn-primary w-full py-3 text-base mb-4">
            {loading ? (
              <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying...</span>
            ) : 'Verify Email'}
          </button>

          <button onClick={handleResend} className="text-brand text-sm hover:underline">
            Didn't receive it? Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;