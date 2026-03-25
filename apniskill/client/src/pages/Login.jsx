import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const initialForm = {
  email: 'demo@apniskill.demo',
  password: 'demo12345',
};

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
    <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="glass-card hidden p-8 lg:block">
        <p className="section-kicker">Quick access</p>
        <h1 className="mt-4 text-4xl font-bold text-white">Jump back into your next skill swap.</h1>
        <p className="mt-4 text-slate-300">
          Demo credentials are prefilled so you can test the whole flow in seconds. You can also create a fresh account.
        </p>

        <div className="mt-10 grid gap-4">
          {[
            'Open dashboard with seeded community profiles',
            'Review matches and send new swap requests',
            'Chat with example conversations immediately',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
              <p className="text-sm leading-6 text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </aside>

      <div className="glass-card p-6 md:p-8">
        <p className="section-kicker">Welcome back</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Login to continue</h2>
        <p className="mt-3 text-slate-300">
          Use the demo account or your own profile. The app will keep the session locally even if the backend is offline.
        </p>

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
          <Link to="/signup" className="font-medium text-sky-300 hover:text-sky-200">
            Create one here
          </Link>
        </p>
      </div>
    </section>
  );
}
