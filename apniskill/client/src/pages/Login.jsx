import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, LockKeyhole, Mail, Sparkles, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const initialForm = {
  email: 'demo@apniskill.demo',
  password: 'demo12345',
};

const valuePoints = [
  'Open a complete demo workspace instantly',
  'Review requests, profile, and chat on any screen size',
  'Keep working even when the backend is unavailable',
];

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await login(form.email, form.password);

    if (result.ok) {
      navigate(redirectTo, { replace: true });
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
      <aside className="glass-card overflow-hidden p-6 sm:p-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs text-cyan-100 sm:text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Demo credentials are ready to use</span>
          </div>

          <p className="mt-6 section-kicker">Welcome back</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            Jump straight back into your next skill swap.
          </h1>
          <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
            The login view is now built to feel clean and trustworthy on smaller screens too, with
            the demo account already filled so you can test the full workflow in seconds.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {valuePoints.map((item) => (
            <div key={item} className="panel-card flex items-start gap-3 p-4">
              <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
              <p className="text-sm leading-7 text-slate-200">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="panel-card p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Profiles available</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">120+</p>
          </div>
          <div className="panel-card p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Demo response time</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">2 hrs</p>
          </div>
        </div>
      </aside>

      <div className="glass-card p-6 sm:p-7 md:p-8">
        <p className="section-kicker">Sign in</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">Login to continue</h2>
        <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
          Use the demo account or your own profile. The current setup keeps the session usable locally,
          which helps during demos and backend downtime.
        </p>

        <div className="mt-6 rounded-[24px] border border-amber-200/15 bg-amber-200/10 p-4">
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-5 w-5 text-amber-200" />
            <div>
              <p className="text-sm font-semibold text-white">Demo account</p>
              <p className="mt-1 text-sm text-slate-200">Email: demo@apniskill.demo</p>
              <p className="mt-1 text-sm text-slate-200">Password: demo12345</p>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <div className="input-shell">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label className="field">
            <span>Password</span>
            <div className="input-shell">
              <LockKeyhole className="input-icon" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
          </label>

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            <span>{loading ? 'Signing in...' : 'Login now'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Need a new account?{' '}
          <Link to="/signup" className="font-medium text-cyan-200 hover:text-cyan-100">
            Create one here
          </Link>
        </p>
      </div>
    </section>
  );
}
