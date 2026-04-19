import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMe } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const GoogleSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');

    if (token) {
      localStorage.setItem('ss_token', token);
      dispatch(fetchMe()).then(() => {
        toast.success(`Welcome, ${name || 'back'}! 🎉`);
        navigate('/dashboard', { replace: true });
      });
    } else {
      toast.error('Google login failed');
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-brand font-medium">Completing Google Sign-In...</p>
      </div>
    </div>
  );
};

export default GoogleSuccessPage;