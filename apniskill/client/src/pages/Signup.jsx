import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const initialForm = {
  name: '',
  email: '',
  password: '',
  location: '',
  headline: '',
  bio: '',
  skillsOffered: '',
  skillsWanted: '',
  availability: 'Evenings',
};

function splitCommaList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function Signup() {
  const [form, setForm] = useState(initialForm);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const offeredSkills = useMemo(() => splitCommaList(form.skillsOffered), [form.skillsOffered]);
  const wantedSkills = useMemo(() => splitCommaList(form.skillsWanted), [form.skillsWanted]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await signup(form);

    if (result.ok) {
      navigate('/dashboard', { replace: true });
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[0.86fr_1.14fr] xl:gap-8">
      <aside className="space-y-6">
        <div className="glass-card p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs text-cyan-100 sm:text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Live profile preview</span>
          </div>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-cyan-300/20 to-amber-200/20 text-white">
              <UserRound className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="section-kicker">Your public card</p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-white">
                {form.name || 'Your name'}
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {form.headline || 'Add a practical headline so the right people know why to contact you.'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="info-chip">
              <MapPin className="h-4 w-4 text-cyan-200" />
              {form.location || 'Location'}
            </span>
            <span className="info-chip">{form.availability}</span>
          </div>

          <div className="mt-6 panel-card p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Why strong profiles win</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Clear offered skills plus specific wanted skills make it much easier for the other
              person to say yes quickly.
            </p>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="grid gap-4">
            <div className="panel-card p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Skills offered</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {offeredSkills.length ? (
                  offeredSkills.map((skill) => (
                    <span key={skill} className="tag tag-offered">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Show the skills you can teach confidently.</p>
                )}
              </div>
            </div>

            <div className="panel-card p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Skills wanted</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {wantedSkills.length ? (
                  wantedSkills.map((skill) => (
                    <span key={skill} className="tag tag-wanted">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Add the skills you want in return.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="glass-card p-6 sm:p-7 md:p-8">
        <div className="max-w-3xl">
          <p className="section-kicker">Create your profile</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
            Tell the community what you can teach and what you want to learn.
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
            The signup flow now keeps the form readable on smaller devices while still giving enough
            space to build a useful profile.
          </p>
        </div>

        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="field">
            <span>Full name</span>
            <div className="input-shell">
              <UserRound className="input-icon" />
              <input name="name" value={form.name} onChange={handleChange} placeholder="Aarav Mehta" required />
            </div>
          </label>

          <label className="field">
            <span>Email</span>
            <div className="input-shell">
              <Mail className="input-icon" />
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="aarav@example.com" required />
            </div>
          </label>

          <label className="field">
            <span>Password</span>
            <div className="input-shell">
              <BriefcaseBusiness className="input-icon" />
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a password" required />
            </div>
          </label>

          <label className="field">
            <span>Location</span>
            <div className="input-shell">
              <MapPin className="input-icon" />
              <input name="location" value={form.location} onChange={handleChange} placeholder="Jaipur" required />
            </div>
          </label>

          <label className="field md:col-span-2">
            <span>Headline</span>
            <div className="input-shell">
              <BriefcaseBusiness className="input-icon" />
              <input
                name="headline"
                value={form.headline}
                onChange={handleChange}
                placeholder="Frontend mentor swapping UI help for backend guidance"
                required
              />
            </div>
          </label>

          <label className="field md:col-span-2">
            <span>Short bio</span>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="5"
              placeholder="Share your learning style, session preferences, or experience."
              required
            />
          </label>

          <label className="field">
            <span>Skills offered</span>
            <textarea
              name="skillsOffered"
              value={form.skillsOffered}
              onChange={handleChange}
              rows="5"
              placeholder="React, Tailwind CSS, UI Reviews"
              required
            />
          </label>

          <label className="field">
            <span>Skills wanted</span>
            <textarea
              name="skillsWanted"
              value={form.skillsWanted}
              onChange={handleChange}
              rows="5"
              placeholder="Node.js, Databases, System Design"
              required
            />
          </label>

          <label className="field md:max-w-sm">
            <span>Availability</span>
            <select name="availability" value={form.availability} onChange={handleChange}>
              <option>Weekdays</option>
              <option>Evenings</option>
              <option>Weekends</option>
              <option>Flexible</option>
            </select>
          </label>

          <div className="flex items-end md:col-span-2 md:justify-end">
            <button type="submit" className="btn-primary w-full justify-center md:w-auto" disabled={loading}>
              <span>{loading ? 'Creating account...' : 'Create account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-cyan-200 hover:text-cyan-100">
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
}
