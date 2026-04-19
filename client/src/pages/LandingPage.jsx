import { Link } from 'react-router-dom';
import { ArrowRight, Video, MessageSquare, Zap, Star, Users, ArrowUpRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f0f7f6] font-sans overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Google Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        .font-display { font-family: 'Playfair Display', serif; }
        .nav-link { position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1.5px; background: #2d7d6f; transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(45,125,111,0.12); }
        .btn-primary-anim { transition: all 0.3s ease; }
        .btn-primary-anim:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(45,125,111,0.35); }
        .dot-pattern { background-image: radial-gradient(circle, #2d7d6f22 1px, transparent 1px); background-size: 28px 28px; }
        .float-slow { animation: floatSlow 6s ease-in-out infinite; }
        .float-slow2 { animation: floatSlow 8s ease-in-out infinite reverse; }
        @keyframes floatSlow { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-14px); } }
        .fade-in { animation: fadeIn 0.9s ease forwards; opacity: 0; }
        .fade-in-delay { animation: fadeIn 0.9s ease 0.3s forwards; opacity: 0; }
        .fade-in-delay2 { animation: fadeIn 0.9s ease 0.5s forwards; opacity: 0; }
        @keyframes fadeIn { to { opacity: 1; } }
        .slide-up { animation: slideUp 0.8s ease forwards; opacity: 0; transform: translateY(30px); }
        .slide-up-delay { animation: slideUp 0.8s ease 0.2s forwards; opacity: 0; transform: translateY(30px); }
        .slide-up-delay2 { animation: slideUp 0.8s ease 0.4s forwards; opacity: 0; transform: translateY(30px); }
        .slide-up-delay3 { animation: slideUp 0.8s ease 0.6s forwards; opacity: 0; transform: translateY(30px); }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        .stat-card { backdrop-filter: blur(12px); }
        .teal-ring { box-shadow: 0 0 0 8px rgba(45,125,111,0.08); }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#f0f7f6]/80 backdrop-blur-xl border-b border-teal-100/60">
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#2d7d6f] rounded-xl flex items-center justify-center shadow-md">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-xl text-[#1a3330] tracking-tight">SkillSwap</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4a6b67]">
            <a href="#features" className="nav-link hover:text-[#2d7d6f] transition-colors">Features</a>
            <a href="#how" className="nav-link hover:text-[#2d7d6f] transition-colors">How it Works</a>
            <a href="#stats" className="nav-link hover:text-[#2d7d6f] transition-colors">Community</a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-[#2d7d6f] hover:text-[#1a5c51] transition-colors px-4 py-2 rounded-xl hover:bg-teal-50">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary-anim flex items-center gap-1.5 px-5 py-2.5 bg-[#2d7d6f] text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-200">
              Get Started <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-10 grid md:grid-cols-2 gap-12 items-center min-h-[88vh]">

        {/* Left — Text */}
        <div>
          {/* Badge */}
          <div className="slide-up inline-flex items-center gap-2 bg-white border border-teal-100 text-[#2d7d6f] px-4 py-2 rounded-full text-xs font-semibold mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 bg-[#2d7d6f] rounded-full animate-pulse"></span>
            Live Skill Exchange Platform
          </div>

          <h1 className="slide-up-delay font-display text-5xl md:text-6xl font-black text-[#0f2724] leading-[1.08] mb-6">
            We Help You<br />
            <span className="text-[#2d7d6f]">Exchange</span> &amp;<br />
            Grow Skills
          </h1>

          <p className="slide-up-delay2 text-[#4a6b67] text-lg leading-relaxed mb-10 max-w-md font-medium">
            Post what you know. Find what you want. Learn from real people in live 1-on-1 video sessions — completely free.
          </p>

          <div className="slide-up-delay3 flex items-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="btn-primary-anim inline-flex items-center gap-2.5 bg-[#2d7d6f] text-white px-8 py-4 rounded-2xl text-base font-bold shadow-xl shadow-teal-200/60 group"
            >
              Start Exchanging
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[#2d7d6f] font-semibold text-sm hover:gap-3 transition-all"
            >
              Already have account? <ArrowRight size={15} />
            </Link>
          </div>

          {/* Social proof */}
          <div className="slide-up-delay3 flex items-center gap-4 mt-10">
            <div className="flex -space-x-2">
              {['#2d7d6f','#3d9e8e','#5bbcaa','#7dd4c4'].map((c, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                  {['A','B','C','D'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-[#4a6b67] mt-0.5 font-medium">Trusted by 2,000+ learners</p>
            </div>
          </div>
        </div>

        {/* Right — Visual */}
        <div className="relative hidden md:block">
          {/* Dot pattern bg */}
          <div className="absolute inset-0 dot-pattern rounded-[3rem] opacity-60"></div>

          {/* Main card */}
          <div className="relative z-10 bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-teal-100/60 border border-teal-50 float-slow">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#2d7d6f] rounded-2xl flex items-center justify-center text-white font-bold text-lg teal-ring">
                  A
                </div>
                <div>
                  <p className="font-bold text-[#0f2724] text-sm">Ahmed K.</p>
                  <p className="text-xs text-[#4a6b67]">Teaching Python</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Live Now
              </div>
            </div>

            {/* Skill exchange visual */}
            <div className="bg-[#f0f7f6] rounded-2xl p-5 mb-5">
              <p className="text-xs text-[#4a6b67] font-medium mb-3">Skill Exchange</p>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#2d7d6f]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg">🐍</span>
                  </div>
                  <p className="text-xs font-bold text-[#0f2724]">Python</p>
                  <p className="text-xs text-[#4a6b67]">Offering</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-0.5 bg-[#2d7d6f]/20 rounded"></div>
                  <div className="w-6 h-6 bg-[#2d7d6f] rounded-full flex items-center justify-center">
                    <ArrowRight size={12} className="text-white" />
                  </div>
                  <div className="w-8 h-0.5 bg-[#2d7d6f]/20 rounded"></div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg">🎨</span>
                  </div>
                  <p className="text-xs font-bold text-[#0f2724]">Design</p>
                  <p className="text-xs text-[#4a6b67]">Wanting</p>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Sessions', value: '12', color: 'bg-teal-50 text-[#2d7d6f]' },
                { label: 'Streak 🔥', value: '5d',  color: 'bg-amber-50 text-amber-600' },
                { label: 'Rating',   value: '4.9', color: 'bg-purple-50 text-purple-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`${color} rounded-xl p-3 text-center`}>
                  <p className="text-base font-black">{value}</p>
                  <p className="text-xs font-medium opacity-80">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Floating mini card 1 */}
          <div className="absolute -top-6 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-teal-50 float-slow2 z-20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                <Video size={13} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0f2724]">Session Started</p>
                <p className="text-xs text-[#4a6b67]">2 users connected</p>
              </div>
            </div>
          </div>

          {/* Floating mini card 2 */}
          <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-teal-50 float-slow z-20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star size={13} className="text-amber-500 fill-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0f2724]">New Review</p>
                <p className="text-xs text-[#4a6b67]">5 stars ⭐⭐⭐⭐⭐</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────── */}
      <section id="stats" className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '2,000+', label: 'Active Users',    bg: 'bg-[#2d7d6f]',    text: 'text-white' },
            { value: '5,400+', label: 'Sessions Done',   bg: 'bg-white',         text: 'text-[#0f2724]' },
            { value: '120+',   label: 'Skills Listed',   bg: 'bg-white',         text: 'text-[#0f2724]' },
            { value: '4.8★',   label: 'Avg Rating',      bg: 'bg-amber-400',     text: 'text-white' },
          ].map(({ value, label, bg, text }) => (
            <div key={label} className={`${bg} ${text} rounded-3xl p-7 stat-card border border-white/30 card-hover`}>
              <p className="text-3xl font-black mb-1">{value}</p>
              <p className="text-sm font-medium opacity-80">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-14">
          <p className="text-[#2d7d6f] text-sm font-bold tracking-widest uppercase mb-3">Why SkillSwap</p>
          <h2 className="font-display text-4xl font-black text-[#0f2724]">Everything you need to<br />learn and teach</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: MessageSquare,
              title: 'Post a Bid',
              desc: 'List what you offer and what you want. Let others find you instantly.',
              color: 'bg-amber-50',
              iconColor: 'bg-amber-100 text-amber-600',
              accent: '#f59e0b',
            },
            {
              icon: Zap,
              title: 'Match & Connect',
              desc: 'Send requests, accept exchanges, and start chatting in real-time.',
              color: 'bg-[#f0f7f6]',
              iconColor: 'bg-[#2d7d6f]/10 text-[#2d7d6f]',
              accent: '#2d7d6f',
            },
            {
              icon: Video,
              title: 'Live Sessions',
              desc: 'Teach each other face-to-face with WebRTC video, audio & screen share.',
              color: 'bg-purple-50',
              iconColor: 'bg-purple-100 text-purple-600',
              accent: '#9333ea',
            },
          ].map(({ icon: Icon, title, desc, color, iconColor }) => {
            void Icon;
            return (
              <div key={title} className={`${color} rounded-[2rem] p-8 card-hover border border-white`}>
                <div className={`w-14 h-14 ${iconColor} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-xl text-[#0f2724] mb-3">{title}</h3>
                <p className="text-[#4a6b67] text-sm leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────── */}
      <section id="how" className="max-w-6xl mx-auto px-8 py-16">
        <div className="bg-white rounded-[3rem] p-12 border border-teal-50 shadow-xl shadow-teal-50">
          <div className="text-center mb-12">
            <p className="text-[#2d7d6f] text-sm font-bold tracking-widest uppercase mb-3">Simple Process</p>
            <h2 className="font-display text-4xl font-black text-[#0f2724]">Start in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Bid',     desc: 'Post the skill you offer and the skill you want to learn in return.' },
              { step: '02', title: 'Connect & Exchange',  desc: 'Send or receive requests. Accept to create a mutual exchange partnership.' },
              { step: '03', title: 'Learn Together',      desc: 'Schedule live sessions, teach each other, track streaks and progress.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center relative">
                <div className="w-16 h-16 bg-[#2d7d6f] text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-5 shadow-lg shadow-teal-200/50">
                  {step}
                </div>
                <h3 className="font-bold text-lg text-[#0f2724] mb-2">{title}</h3>
                <p className="text-[#4a6b67] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="bg-[#2d7d6f] rounded-[3rem] p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
          <div className="relative z-10">
            <p className="text-teal-200 text-sm font-bold tracking-widest uppercase mb-4">Join Today — It's Free</p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Exchange<br />Your Skills?
            </h2>
            <p className="text-teal-100 text-lg mb-10 max-w-md mx-auto">
              Join thousands of learners who are growing together every day.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="inline-flex items-center gap-2.5 bg-white text-[#2d7d6f] px-10 py-4 rounded-2xl text-base font-black hover:bg-teal-50 transition-all shadow-2xl group"
              >
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2.5 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl text-base font-semibold hover:bg-white/20 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="max-w-6xl mx-auto px-8 py-10 flex items-center justify-between border-t border-teal-100/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2d7d6f] rounded-lg flex items-center justify-center">
            <Zap size={13} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-[#0f2724] text-sm">SkillSwap</span>
        </div>
        <p className="text-[#4a6b67] text-xs font-medium">"hasnainnageri@gmail.com  send your query ".</p>
        <div className="flex items-center gap-5 text-xs text-[#4a6b67] font-medium">
          <Link to="/login" className="hover:text-[#2d7d6f] transition-colors">Sign In</Link>
          <Link to="/register" className="hover:text-[#2d7d6f] transition-colors">Register</Link>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;