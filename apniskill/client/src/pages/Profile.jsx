import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Clock3, MapPin, Save, Sparkles, UserRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

function toCommaList(value) {
  return Array.isArray(value) ? value.join(', ') : value || '';
}

function buildForm(user) {
  return {
    name: user?.name || '',
    location: user?.location || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    availability: user?.availability || 'Flexible',
    skillsOffered: toCommaList(user?.skillsOffered),
    skillsWanted: toCommaList(user?.skillsWanted),
  };
}

function splitCommaList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function Profile() {
  const { user, updateUserProfile, loading } = useAuth();
  const [form, setForm] = useState(() => buildForm(user));

  useEffect(() => {
    setForm(buildForm(user));
  }, [user]);

  const completion = useMemo(() => {
    const fields = [form.name, form.location, form.headline, form.bio, form.skillsOffered, form.skillsWanted];
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  }, [form]);

  const offeredSkills = useMemo(() => splitCommaList(form.skillsOffered), [form.skillsOffered]);
  const wantedSkills = useMemo(() => splitCommaList(form.skillsWanted), [form.skillsWanted]);

  const readinessItems = useMemo(
    () => [
      { label: 'Clear headline', done: Boolean(form.headline.trim()) },
      { label: 'Detailed bio', done: form.bio.trim().length >= 40 },
      { label: 'Offered skills listed', done: offeredSkills.length >= 2 },
      { label: 'Wanted skills listed', done: wantedSkills.length >= 2 },
      { label: 'Location and availability', done: Boolean(form.location.trim() && form.availability) },
    ],
    [form.availability, form.bio, form.headline, form.location, offeredSkills.length, wantedSkills.length],
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await updateUserProfile(form);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr] xl:gap-8">
      <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
        <div className="glass-card overflow-hidden p-6 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-cyan-300/20 to-amber-200/20 text-2xl font-semibold text-white">
              <UserRound className="h-9 w-9" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="section-kicker">Live profile preview</p>
              <h1 className="mt-3 font-display text-3xl font-semibold text-white">
                {form.name || 'Your name'}
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {form.headline || 'Add a headline so other members know what kind of help you offer.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="info-chip">
                  <MapPin className="h-4 w-4 text-cyan-200" />
                  {form.location || 'Add location'}
                </span>
                <span className="info-chip">
                  <Clock3 className="h-4 w-4 text-cyan-200" />
                  {form.availability || 'Flexible'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
              <span>Profile strength</span>
              <span className="font-semibold text-white">{completion}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-amber-200"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-1">
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
                  <p className="text-sm text-slate-500">Add the skills you can confidently teach.</p>
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
                  <p className="text-sm text-slate-500">Add the skills you want to learn next.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 text-cyan-200">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-white">Readiness checklist</h2>
          </div>

          <div className="mt-5 space-y-3">
            {readinessItems.map((item) => (
              <div key={item.label} className="panel-card flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-sm text-slate-300">{item.label}</span>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    item.done ? 'bg-emerald-300/10 text-emerald-200' : 'bg-white/[0.05] text-slate-400'
                  }`}
                >
                  {item.done ? <BadgeCheck className="h-3.5 w-3.5" /> : null}
                  {item.done ? 'Ready' : 'Needs detail'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="glass-card p-6 sm:p-7 md:p-8">
        <div className="max-w-3xl">
          <p className="section-kicker">Edit profile</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
            Keep your profile practical, specific, and easy to match.
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
            Better profiles get faster replies because other members can immediately understand what
            you teach, what you want back, and when you are available.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="panel-card p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Basics</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-white">Identity and location</h3>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
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
                  <input
                    name="headline"
                    value={form.headline}
                    onChange={handleChange}
                    placeholder="Frontend mentor swapping UI help for backend guidance"
                    required
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="panel-card p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">About you</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-white">Make the profile feel human</h3>
            </div>

            <label className="field">
              <span>Bio</span>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows="6"
                placeholder="Share your teaching style, learning goals, and what a good swap looks like for you."
                required
              />
            </label>
          </div>

          <div className="panel-card p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Skill setup</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-white">Clarify your exchange lanes</h3>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
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
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-7 text-slate-400">
              Changes are saved to your session and remain usable even if the backend is offline.
            </p>
            <button type="submit" className="btn-primary sm:w-auto" disabled={loading}>
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save profile'}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
