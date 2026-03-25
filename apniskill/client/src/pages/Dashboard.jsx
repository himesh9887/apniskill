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
        const [users, matchData] = await Promise.all([
          getDiscoverUsers(user?.id),
          getMatches(user?.id),
        ]);

        if (!isMounted) {
          return;
        }

        setCommunity(users);
        setMatches(matchData);
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

  const activeSwaps = useMemo(
    () => matches.filter((match) => match.status === 'active').length,
    [matches],
  );

  async function handleSwapRequest(targetUser) {
    try {
      const createdMatch = await requestSwap(targetUser, '', user?.id);
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
      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="glass-card relative overflow-hidden p-5 sm:p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_35%)]" />
          <div className="relative">
            <p className="section-kicker">Dashboard</p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Welcome back, {user?.name?.split(' ')[0]}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Discover people who need the exact skills you already have, then send a clean swap request
              and continue the conversation in chat.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="stat-card">
                <p className="stat-number">{community.length}</p>
                <p className="stat-label">people available for swaps</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">{activeSwaps}</p>
                <p className="stat-label">active swaps in progress</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">{user?.completedSwaps ?? 0}</p>
                <p className="stat-label">completed exchanges</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="glass-card p-5 sm:p-6">
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

          <div className="mt-5 rounded-[28px] border border-white/10 bg-slate-950/45 p-4 sm:p-5">
            <p className="text-sm font-semibold text-white">What gets faster replies</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Send requests to people whose immediate goals match your strongest skill, and keep your
              headline clear enough that they can trust what you&apos;ll help with.
            </p>
          </div>
        </aside>
      </section>

      <section className="glass-card p-4 sm:p-5">
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

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-sky-300" />
          <h2 className="text-2xl font-semibold text-white">Suggested community</h2>
        </div>

        {filteredUsers.length ? (
          <div className="grid gap-5 sm:gap-6 xl:grid-cols-2">
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
      </section>
    </div>
  );
}
