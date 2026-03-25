import { useMemo, useState } from 'react';
import { Save, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

function toCommaList(value) {
  return Array.isArray(value) ? value.join(', ') : value || '';
}

export default function Profile() {
  const { user, updateUserProfile, loading } = useAuth();
  const [form, setForm] = useState(() => ({
    name: user?.name || '',
    location: user?.location || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    availability: user?.availability || 'Flexible',
    skillsOffered: toCommaList(user?.skillsOffered),
    skillsWanted: toCommaList(user?.skillsWanted),
  }));

  const completion = useMemo(() => {
    const fields = [
      form.name,
      form.location,
      form.headline,
      form.bio,
      form.skillsOffered,
      form.skillsWanted,
    ];
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  }, [form]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await updateUserProfile(form);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
      <aside className="glass-card p-6">
        <p className="section-kicker">Profile snapshot</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{user?.name}</h1>
        <p className="mt-2 text-slate-400">{user?.headline}</p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Profile strength</span>
            <span>{completion}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-300 to-amber-300" style={{ width: `${completion}%` }} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {user?.skillsOffered?.map((skill) => (
            <span key={skill} className="tag tag-offered">
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-sky-300/15 bg-sky-300/8 p-5">
          <div className="flex items-center gap-2 text-sky-200">
            <Sparkles className="h-5 w-5" />
            <p className="font-medium">Tip</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Profiles with a clear headline, detailed offered skills, and specific wanted skills usually get faster replies.
          </p>
        </div>
      </aside>

      <section className="glass-card p-6 md:p-8">
        <p className="section-kicker">Edit profile</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Keep your profile practical and easy to match.</h2>

        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <div className="input-shell">
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
          </label>

          <label className="field">
            <span>Location</span>
            <div className="input-shell">
              <input name="location" value={form.location} onChange={handleChange} required />
            </div>
          </label>

          <label className="field md:col-span-2">
            <span>Headline</span>
            <div className="input-shell">
              <input name="headline" value={form.headline} onChange={handleChange} required />
            </div>
          </label>

          <label className="field md:col-span-2">
            <span>Bio</span>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows="5" required />
          </label>

          <label className="field">
            <span>Skills offered</span>
            <textarea name="skillsOffered" value={form.skillsOffered} onChange={handleChange} rows="4" required />
          </label>

          <label className="field">
            <span>Skills wanted</span>
            <textarea name="skillsWanted" value={form.skillsWanted} onChange={handleChange} rows="4" required />
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
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save profile'}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
