import { useEffect, useMemo, useState } from 'react';
import { Filter, LayoutDashboard, Search, Sparkles, Users } from 'lucide-react';
import SkillCard from '../components/SkillCard.jsx';
import Loader from '../components/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getDiscoverUsers, getMatches, requestSwap } from '../services/platformService.js';
import { toast } from '../utils/notifications.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [community, setCommunity] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [users, activeMatches] = await Promise.all([
          getDiscoverUsers(user?.id),
          getMatches(user?.id),
        ]);

        if (!isMounted) {
          return;
        }

        setCommunity(users);
        setMatches(activeMatches);
      } catch (error) {
        toast.error(error.message || 'Unable to load dashboard data.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return community;
    }

    return community.filter((person) => {
      const haystack = [
        person.name,
        person.location,
        person.headline,
        ...(person.skillsOffered || []),
        ...(person.skillsWanted || []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [community, search]);

  async function handleSwapRequest(targetUser) {
    try {
      const createdMatch = await requestSwap(targetUser);
      setMatches((current) => [createdMatch, ...current]);
      toast.success(`Request sent to ${targetUser.name}.`);
    } catch (error) {
      toast.error(error.message || 'Unable to send request.');
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="glass-card p-6 md:p-8">
          <p className="section-kicker">Dashboard</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}.</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Your profile is visible to learners who want {user?.skillsOffered?.[0] || 'your expertise'}.
            Start with a match that complements your next skill goal.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="stat-card">
              <p className="stat-number">{community.length}</p>
              <p className="stat-label">people available for swaps</p>
            </div>
            <div className="stat-card">
              <p className="stat-number">{matches.length}</p>
              <p className="stat-label">current match requests</p>
            </div>
            <div className="stat-card">
              <p className="stat-number">{user?.completedSwaps ?? 0}</p>
              <p className="stat-label">completed exchanges</p>
            </div>
          </div>
        </div>

        <aside className="glass-card p-6">
          <div className="flex items-center gap-2 text-sky-300">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-white">Your swap focus</h2>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {user?.skillsWanted?.map((skill) => (
              <span key={skill} className="tag tag-wanted">
                {skill}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-300">
            Strong matches usually happen when your offered skills clearly solve the other person&apos;s immediate need.
          </p>
        </aside>
      </section>

      <section className="glass-card p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <label className="input-shell">
            <Search className="input-icon" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by skill, city, or profile headline"
            />
          </label>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <Filter className="h-4 w-4 text-sky-300" />
            <span>Showing curated matches first</span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-sky-300" />
            <h2 className="text-2xl font-semibold text-white">Suggested community</h2>
          </div>

          {filteredUsers.length ? (
            <div className="grid gap-6 xl:grid-cols-2">
              {filteredUsers.map((person) => (
                <SkillCard key={person.id} user={person} onSwapRequest={handleSwapRequest} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <LayoutDashboard className="mx-auto h-10 w-10 text-sky-300" />
              <p className="mt-4 text-lg text-white">No matches for that search yet.</p>
              <p className="mt-2 text-sm text-slate-400">Try a city, a skill name, or remove some filters.</p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white">Active requests</h3>
            <div className="mt-5 space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{match.user?.name || 'Pending match'}</p>
                      <p className="text-sm text-slate-400">{match.note}</p>
                    </div>
                    <span className="rounded-full bg-sky-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-200">
                      {match.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">Compatibility score: {match.compatibility ?? 88}%</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
