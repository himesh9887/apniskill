import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Mail, MapPin, UserRound } from 'lucide-react';
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

export default function Signup() {
  const [form, setForm] = useState(initialForm);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

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
    <section className="mx-auto max-w-5xl">
      <div className="glass-card p-5 sm:p-6 md:p-10">
        <div className="max-w-3xl">
          <p className="section-kicker">Create your profile</p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Tell the community what you can teach and what you want to learn.
          </h1>
          <p className="mt-4 text-slate-300">
            Keep the details practical. Strong profiles make it easier for the right people to reply.
          </p>
        </div>

        <form className="mt-10 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
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
              rows="4"
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
              rows="4"
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
              rows="4"
              placeholder="Node.js, Databases, System Design"
              required
            />
          </label>

          <label className="field">
            <span>Availability</span>
            <select name="availability" value={form.availability} onChange={handleChange}>
              <option>Weekdays</option>
              <option>Evenings</option>
              <option>Weekends</option>
              <option>Flexible</option>
            </select>
          </label>

          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              <span>{loading ? 'Creating account...' : 'Create account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-sky-300 hover:text-sky-200">
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
}
