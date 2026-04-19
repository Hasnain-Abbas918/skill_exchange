import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRight, Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
  </svg>
);

const LoginPage = () => {
  const [form,        setForm]        = useState({ email: '', password: '' });
  const [showPass,    setShowPass]    = useState(false);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

 const handleGoogleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};
  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .input-teal:focus { outline: none; border-color: #2d7d6f; box-shadow: 0 0 0 3px rgba(45,125,111,0.12); }
        .btn-teal { transition: all 0.25s ease; }
        .btn-teal:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(45,125,111,0.35); }
        .float-card { animation: floatCard 5s ease-in-out infinite; }
        @keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .dot-bg { background-image: radial-gradient(circle, #2d7d6f1a 1.5px, transparent 1.5px); background-size: 24px 24px; }
        .fade-up { animation: fadeUp 0.7s ease forwards; opacity: 0; transform: translateY(20px); }
        .fade-up-d1 { animation: fadeUp 0.7s ease 0.1s forwards; opacity: 0; transform: translateY(20px); }
        .fade-up-d2 { animation: fadeUp 0.7s ease 0.2s forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#2d7d6f] p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 right-[-40px] w-32 h-32 bg-white/5 rounded-full -translate-y-1/2"></div>

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-white text-xl tracking-tight">SkillSwap</span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <h2 className="font-display text-4xl font-black text-white leading-tight mb-6">
            Learn. Teach.<br />Grow Together.
          </h2>
          <p className="text-teal-100 text-base leading-relaxed mb-10 max-w-sm">
            Exchange skills with real people through live 1-on-1 video sessions. No money — just knowledge.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '2K+',  label: 'Learners'  },
              { value: '120+', label: 'Skills'    },
              { value: '4.8★', label: 'Rating'    },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                <p className="text-white font-black text-xl">{value}</p>
                <p className="text-teal-200 text-xs font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating card */}
        <div className="relative z-10 float-card">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 max-w-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Ahmed K.</p>
                <p className="text-teal-200 text-xs">Python → UI Design</p>
              </div>
              <div className="ml-auto flex items-center gap-1 bg-green-400/20 text-green-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Live
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-white/10 rounded-xl p-2.5 text-center">
                <p className="text-white text-xs font-bold">🔥 8</p>
                <p className="text-teal-200 text-xs">Streak</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-xl p-2.5 text-center">
                <p className="text-white text-xs font-bold">⭐ 4.9</p>
                <p className="text-teal-200 text-xs">Rating</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-xl p-2.5 text-center">
                <p className="text-white text-xs font-bold">✓ 14</p>
                <p className="text-teal-200 text-xs">Sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 bg-[#f0f7f6] flex items-center justify-center p-8 relative">
        <div className="dot-bg absolute inset-0 opacity-50"></div>

        <div className="w-full max-w-md relative z-10">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#2d7d6f] rounded-xl flex items-center justify-center">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-[#0f2724] text-lg">SkillSwap</span>
          </div>

          {/* Header */}
          <div className="fade-up mb-8">
            <h1 className="font-display text-3xl font-black text-[#0f2724] mb-2">Welcome back</h1>
            <p className="text-[#4a6b67] text-sm font-medium">Sign in to continue your learning journey</p>
          </div>

          {/* Card */}
          <div className="fade-up-d1 bg-white rounded-3xl p-8 shadow-xl shadow-teal-100/60 border border-teal-50">

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-2xl py-3 px-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 mb-5 font-semibold text-gray-700 text-sm"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#0f2724] mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-teal w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#0f2724]">Password</label>
                  <Link to="/forgot-password" className="text-[#2d7d6f] text-xs font-semibold hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-teal w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-11 text-sm text-gray-800 placeholder:text-gray-400 transition-all"
                    placeholder="Your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-2xl">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-teal w-full bg-[#2d7d6f] text-white py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-teal-200/60 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Register link */}
          <div className="fade-up-d2 text-center mt-6">
            <p className="text-[#4a6b67] text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#2d7d6f] font-bold hover:underline">
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;