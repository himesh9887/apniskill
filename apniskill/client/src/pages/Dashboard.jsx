import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowRightLeft,
  Filter,
  LayoutDashboard,
  MessageCircleMore,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
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
        const [users, matchData] = await Promise.all([getDiscoverUsers(user?.id), getMatches(user?.id)]);

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

  const activeSwaps = useMemo(() => matches.filter((match) => match.status === 'active').length, [matches]);
  const incomingRequests = useMemo(
    () => matches.filter((match) => match.direction === 'incoming' && match.status === 'requested').length,
    [matches],
  );
  const pendingRequests = useMemo(
    () => matches.filter((match) => match.direction === 'incoming' && match.status === 'pending').length,
    [matches],
  );
  const nextPriorityMatch = useMemo(
    () => matches.find((match) => match.status === 'active') || matches[0] || null,
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
    <div className="space-y-8 sm:space-y-10">
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.1),transparent_30%)]" />
          <div className="relative">
            <p className="section-kicker">Dashboard</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl lg:text-[2.8rem]">
              Welcome back, {user?.name?.split(' ')[0]}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
              Your workspace now keeps discovery, requests, and messages easy to scan, so you can act
              quickly whether you are on mobile or desktop.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="stat-card">
                <p className="stat-number">{community.length}</p>
                <p className="stat-label">people available for swaps</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">{activeSwaps}</p>
                <p className="stat-label">active swaps in progress</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">{incomingRequests}</p>
                <p className="stat-label">new requests waiting</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">{user?.completedSwaps ?? 0}</p>
                <p className="stat-label">completed exchanges</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="grid gap-5">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 text-cyan-200">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-white">Your focus lanes</h2>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {user?.skillsWanted?.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className="tag tag-wanted transition hover:border-amber-200/35 hover:bg-amber-200/15"
                  onClick={() => setSearch(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <p className="text-sm font-semibold text-white">Best next step</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Send requests to people whose wanted skills overlap with your strongest offerings, then
                move accepted requests into chat quickly.
              </p>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 text-cyan-200">
              <ArrowRightLeft className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-white">Quick actions</h2>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <Link to="/requests" className="panel-card flex items-center justify-between p-4 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white">
                <span>{incomingRequests} incoming requests</span>
                <ArrowRight className="h-4 w-4 text-cyan-200" />
              </Link>
              <Link to="/chat" className="panel-card flex items-center justify-between p-4 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white">
                <span>{activeSwaps} active swaps in chat</span>
                <ArrowRight className="h-4 w-4 text-cyan-200" />
              </Link>
              <Link to="/profile" className="panel-card flex items-center justify-between p-4 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white">
                <span>Update profile clarity</span>
                <ArrowRight className="h-4 w-4 text-cyan-200" />
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="glass-card p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="input-shell">
              <Search className="input-icon" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by skill, city, or profile headline"
              />
            </label>

            <div className="inline-flex items-center gap-2 rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-300">
              <Filter className="h-4 w-4 text-cyan-200" />
              <span>{filteredUsers.length} people match your current view</span>
            </div>
          </div>

          {user?.skillsWanted?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.skillsWanted.slice(0, 4).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSearch(skill)}
                  className="info-chip transition hover:border-cyan-300/25 hover:bg-cyan-300/10"
                >
                  {skill}
                </button>
              ))}
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="info-chip transition hover:border-white/20 hover:bg-white/[0.08]"
                >
                  Clear search
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="glass-card p-5 sm:p-6">
          <div className="flex items-center gap-2 text-cyan-200">
            <LayoutDashboard className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-white">Priority snapshot</h2>
          </div>

          {nextPriorityMatch ? (
            <div className="mt-5 space-y-4">
              <div className="panel-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Next relationship to continue</p>
                    <p className="mt-2 font-display text-xl font-semibold text-white">{nextPriorityMatch.user?.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{nextPriorityMatch.note}</p>
                  </div>
                  <span className="info-chip">{nextPriorityMatch.status}</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="panel-card p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Incoming</p>
                  <p className="mt-2 font-display text-2xl font-bold text-white">{incomingRequests}</p>
                </div>
                <div className="panel-card p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Pending</p>
                  <p className="mt-2 font-display text-2xl font-bold text-white">{pendingRequests}</p>
                </div>
                <div className="panel-card p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Chats ready</p>
                  <p className="mt-2 font-display text-2xl font-bold text-white">{activeSwaps}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[24px] border border-dashed border-white/12 bg-white/[0.04] p-6 text-center">
              <MessageCircleMore className="mx-auto h-10 w-10 text-cyan-200" />
              <p className="mt-4 text-lg font-semibold text-white">No swap activity yet</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Start by sending a request to someone from the community below.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-200">
              <Users className="h-5 w-5" />
              <p className="section-kicker !text-sm">Suggested community</p>
            </div>
            <h2 className="mt-2 font-display text-3xl font-semibold text-white">People worth reaching out to now</h2>
          </div>

          <p className="text-sm leading-7 text-slate-400">
            Showing {filteredUsers.length} result{filteredUsers.length === 1 ? '' : 's'} based on
            your current search.
          </p>
        </div>

        {filteredUsers.length ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredUsers.map((person) => (
              <SkillCard key={person.id} user={person} onSwapRequest={handleSwapRequest} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <LayoutDashboard className="mx-auto h-10 w-10 text-cyan-200" />
            <p className="mt-4 text-lg text-white">No matches for that search yet.</p>
            <p className="mt-2 text-sm text-slate-400">Try a city, a skill name, or clear the current filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}
