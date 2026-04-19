import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRight, Zap, Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.6l6.9-6.9C35.64 2.2 30.21 0 24 0 14.64 0 6.48 5.4 2.52 13.32l8.04 6.24C12.6 13.2 17.88 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.14 24.5c0-1.64-.15-3.2-.42-4.7H24v9h12.44c-.54 2.9-2.2 5.36-4.7 7.04l7.2 5.6C43.92 37.1 46.14 31.3 46.14 24.5z"/>
    <path fill="#FBBC05" d="M10.56 28.56A14.5 14.5 0 019.5 24c0-1.58.27-3.1.75-4.5l-8.04-6.24A24.02 24.02 0 000 24c0 3.84.92 7.47 2.52 10.68l8.04-6.12z"/>
    <path fill="#34A853" d="M24 48c6.21 0 11.43-2.05 15.24-5.58l-7.2-5.6c-2 1.34-4.56 2.13-8.04 2.13-6.12 0-11.4-3.7-13.44-8.94l-8.04 6.12C6.48 42.6 14.64 48 24 48z"/>
  </svg>
);

const RegisterPage = () => {
  const [form,     setForm]     = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters');

    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      toast.success('OTP sent to your email!');
      navigate('/verify-otp', {
        state: { userId: result.payload.userId, email: form.email },
      });
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  const perks = [
    'Exchange skills with real people',
    'Live 1-on-1 video sessions',
    'Track streaks & progress',
    '100% free — no money involved',
  ];

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .input-teal:focus { outline: none; border-color: #2d7d6f; box-shadow: 0 0 0 3px rgba(45,125,111,0.12); }
        .btn-teal { transition: all 0.25s ease; }
        .btn-teal:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(45,125,111,0.35); }
        .dot-bg { background-image: radial-gradient(circle, #2d7d6f1a 1.5px, transparent 1.5px); background-size: 24px 24px; }
        .fade-up { animation: fadeUp 0.7s ease forwards; opacity: 0; transform: translateY(20px); }
        .fade-up-d1 { animation: fadeUp 0.7s ease 0.1s forwards; opacity: 0; transform: translateY(20px); }
        .fade-up-d2 { animation: fadeUp 0.7s ease 0.2s forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .perk-item { animation: fadeUp 0.6s ease forwards; opacity: 0; transform: translateY(10px); }
        .perk-1 { animation-delay: 0.1s; }
        .perk-2 { animation-delay: 0.2s; }
        .perk-3 { animation-delay: 0.3s; }
        .perk-4 { animation-delay: 0.4s; }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#2d7d6f] p-12 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/3 right-[-50px] w-40 h-40 bg-white/5 rounded-full"></div>

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-white text-xl tracking-tight">SkillSwap</span>
        </div>

        {/* Center */}
        <div className="relative z-10">
          <h2 className="font-display text-4xl font-black text-white leading-tight mb-4">
            Join thousands of<br />skill exchangers
          </h2>
          <p className="text-teal-100 text-base leading-relaxed mb-10 max-w-sm">
            Create your free account and start exchanging skills with people around the world today.
          </p>

          {/* Perks list */}
          <div className="space-y-3">
            {perks.map((perk, i) => (
              <div key={perk} className={`perk-item perk-${i + 1} flex items-center gap-3`}>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <p className="text-white text-sm font-medium">{perk}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Sara M.</p>
              <p className="text-teal-200 text-xs">Learned React in 3 weeks</p>
            </div>
          </div>
          <p className="text-teal-100 text-sm leading-relaxed">
            "SkillSwap changed how I learn. I taught Python and learned UI Design — completely free!"
          </p>
          <div className="flex gap-0.5 mt-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-amber-400 text-xs">★</span>
            ))}
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
            <h1 className="font-display text-3xl font-black text-[#0f2724] mb-2">
              Create your account
            </h1>
            <p className="text-[#4a6b67] text-sm font-medium">
              Free forever — no credit card required
            </p>
          </div>

          {/* Card */}
          <div className="fade-up-d1 bg-white rounded-3xl p-8 shadow-xl shadow-teal-100/60 border border-teal-50">

            {/* Google */}
            <button
              type="button"
              onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-2xl py-3 px-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 mb-5 font-semibold text-gray-700 text-sm"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">or register with email</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-[#0f2724] mb-2">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-teal w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 transition-all"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

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
                <label className="block text-sm font-semibold text-[#0f2724] mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-teal w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-11 text-sm text-gray-800 placeholder:text-gray-400 transition-all"
                    placeholder="Min. 6 characters"
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
                {/* Password strength hint */}
                {form.password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[1,2,3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                          form.password.length >= i * 3
                            ? i === 1 ? 'bg-red-400' : i === 2 ? 'bg-amber-400' : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}></div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {form.password.length < 3 ? 'Weak' : form.password.length < 6 ? 'Fair' : 'Good'}
                    </span>
                  </div>
                )}
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Login link */}
          <div className="fade-up-d2 text-center mt-6">
            <p className="text-[#4a6b67] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#2d7d6f] font-bold hover:underline">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;