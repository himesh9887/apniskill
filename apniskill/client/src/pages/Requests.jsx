import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightLeft,
  CheckCircle2,
  Clock3,
  Inbox,
  MessageCircleMore,
  SendHorizontal,
  Sparkles,
} from 'lucide-react';
import Loader from '../components/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getMatches, updateMatchStatus } from '../services/platformService.js';
import { formatDate } from '../utils/formatDate.js';
import { toast } from '../utils/notifications.js';

const statusToneMap = {
  requested: 'border-amber-200/20 bg-amber-200/10 text-amber-100',
  pending: 'border-white/10 bg-white/[0.07] text-slate-100',
  active: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100',
};

function getStatusTone(status) {
  return statusToneMap[status] || 'border-white/10 bg-white/[0.07] text-white';
}

function getStatusLabel(status) {
  if (status === 'active') {
    return 'Accepted';
  }

  if (status === 'pending') {
    return 'Pending';
  }

  return 'New request';
}

function getInitials(name = '') {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'AS'
  );
}

function MatchCard({ match, children }) {
  return (
    <article className="glass-card p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-cyan-300/12 text-sm font-semibold text-cyan-100">
          {getInitials(match.user?.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="truncate font-display text-2xl font-semibold text-white">{match.user?.name || 'New learner'}</p>
              <p className="mt-1 text-sm text-slate-400">
                {match.user?.headline || 'Wants to start a skill exchange with you.'}
              </p>
            </div>
            <span
              className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(match.status)}`}
            >
              {getStatusLabel(match.status)}
            </span>
          </div>

          <div className="mt-4 panel-card p-4">
            <p className="text-sm leading-7 text-slate-200">
              {match.note || `${match.user?.name || 'This member'} wants to exchange skills with you.`}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(match.user?.skillsOffered || []).slice(0, 2).map((skill) => (
                <span key={`${match.id}-${skill}-offered`} className="tag tag-offered">
                  Offers {skill}
                </span>
              ))}
              {(match.user?.skillsWanted || []).slice(0, 2).map((skill) => (
                <span key={`${match.id}-${skill}-wanted`} className="tag tag-wanted">
                  Wants {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-slate-400">
            <span>{formatDate(match.createdAt) || 'Recently'}</span>
            <span>Compatibility {match.compatibility ?? 88}%</span>
          </div>

          {children ? <div className="mt-5">{children}</div> : null}
        </div>
      </div>
    </article>
  );
}

function CompactMatchCard({ match, ctaLabel = '', ctaTo = '' }) {
  return (
    <div className="panel-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{match.user?.name || 'Swap request'}</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">{match.note || match.user?.headline}</p>
        </div>
        <span
          className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(match.status)}`}
        >
          {getStatusLabel(match.status)}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
          {formatDate(match.createdAt) || 'Recently'}
        </p>
        {ctaLabel && ctaTo ? (
          <Link to={ctaTo} className="btn-secondary justify-center sm:w-auto">
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default function Requests() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingMatchId, setUpdatingMatchId] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadRequests() {
      try {
        const data = await getMatches(user?.id);

        if (!isMounted) {
          return;
        }

        setMatches(data);
      } catch (error) {
        toast.error(error.message || 'Unable to load requests.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const newRequests = useMemo(
    () => matches.filter((match) => match.direction === 'incoming' && match.status === 'requested'),
    [matches],
  );
  const pendingRequests = useMemo(
    () => matches.filter((match) => match.direction === 'incoming' && match.status === 'pending'),
    [matches],
  );
  const sentRequests = useMemo(
    () => matches.filter((match) => match.direction === 'outgoing' && match.status !== 'active'),
    [matches],
  );
  const activeSwaps = useMemo(() => matches.filter((match) => match.status === 'active'), [matches]);

  async function handleMatchAction(matchId, status) {
    try {
      setUpdatingMatchId(matchId);
      const updatedMatch = await updateMatchStatus(matchId, status, user?.id);

      setMatches((current) =>
        current.map((match) => (match.id === updatedMatch.id ? updatedMatch : match)),
      );

      toast.success(
        status === 'active'
          ? 'Request accepted. You can continue the swap in chat.'
          : 'Request kept pending for later.',
      );
    } catch (error) {
      toast.error(error.message || 'Unable to update request.');
    } finally {
      setUpdatingMatchId('');
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="glass-card relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_34%)]" />
          <div className="relative">
            <p className="section-kicker">Requests</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Manage your swap inbox</h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
              Review incoming requests, keep some pending for later, and move accepted exchanges into
              chat without losing track of what matters.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="stat-card">
                <p className="stat-number">{newRequests.length}</p>
                <p className="stat-label">new requests waiting</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">{pendingRequests.length}</p>
                <p className="stat-label">requests kept pending</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">{sentRequests.length}</p>
                <p className="stat-label">requests you already sent</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">{activeSwaps.length}</p>
                <p className="stat-label">accepted swaps ready in chat</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="glass-card p-6">
          <div className="flex items-center gap-2 text-cyan-200">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-white">Decision guide</h2>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-[24px] border border-amber-200/15 bg-amber-200/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">Accept</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Turn the request into an active swap so you can continue the conversation in chat.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-100">Pending</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Keep the request visible here if you want to decide later without losing context.
              </p>
            </div>
            <div className="rounded-[24px] border border-emerald-300/15 bg-emerald-300/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Active swap</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Accepted requests appear in the live section and are ready to continue in messages.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-200">
              <Inbox className="h-5 w-5" />
              <div>
                <h2 className="text-xl font-semibold text-white">New requests</h2>
                <p className="mt-1 text-sm text-slate-400">Fresh requests that still need your reply.</p>
              </div>
            </div>

            {newRequests.length ? (
              newRequests.map((match) => {
                const isUpdating = updatingMatchId === match.id;

                return (
                  <MatchCard key={match.id} match={match}>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        className="btn-primary sm:flex-1"
                        disabled={isUpdating}
                        onClick={() => handleMatchAction(match.id, 'active')}
                      >
                        {isUpdating ? 'Saving...' : 'Accept request'}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary sm:flex-1"
                        disabled={isUpdating}
                        onClick={() => handleMatchAction(match.id, 'pending')}
                      >
                        {isUpdating ? 'Saving...' : 'Keep pending'}
                      </button>
                    </div>
                  </MatchCard>
                );
              })
            ) : (
              <div className="glass-card p-6 text-center">
                <Inbox className="mx-auto h-10 w-10 text-cyan-200" />
                <p className="mt-4 text-lg font-semibold text-white">No new requests right now</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  New incoming requests will appear here with quick actions.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-200">
              <Clock3 className="h-5 w-5" />
              <div>
                <h2 className="text-xl font-semibold text-white">Pending requests</h2>
                <p className="mt-1 text-sm text-slate-400">Requests you saved to decide a little later.</p>
              </div>
            </div>

            {pendingRequests.length ? (
              pendingRequests.map((match) => {
                const isUpdating = updatingMatchId === match.id;

                return (
                  <MatchCard key={match.id} match={match}>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        className="btn-primary sm:flex-1"
                        disabled={isUpdating}
                        onClick={() => handleMatchAction(match.id, 'active')}
                      >
                        {isUpdating ? 'Saving...' : 'Accept now'}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary sm:flex-1"
                        disabled={isUpdating}
                        onClick={() => handleMatchAction(match.id, 'pending')}
                      >
                        {isUpdating ? 'Saving...' : 'Still pending'}
                      </button>
                    </div>
                  </MatchCard>
                );
              })
            ) : (
              <div className="glass-card p-6 text-center">
                <Clock3 className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-4 text-lg font-semibold text-white">No pending requests</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  If you keep a request pending, it will stay here until you accept it.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="glass-card p-5 sm:p-6">
            <div className="flex items-center gap-2 text-cyan-200">
              <SendHorizontal className="h-5 w-5" />
              <div>
                <h2 className="text-xl font-semibold text-white">Sent requests</h2>
                <p className="mt-1 text-sm text-slate-400">Requests you already sent to other members.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {sentRequests.length ? (
                sentRequests.map((match) => <CompactMatchCard key={match.id} match={match} />)
              ) : (
                <div className="rounded-[24px] border border-dashed border-white/12 bg-white/[0.04] p-5 text-sm leading-7 text-slate-400">
                  New outgoing requests will appear here after you reach out from the dashboard.
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-5 sm:p-6">
            <div className="flex items-center gap-2 text-cyan-200">
              <CheckCircle2 className="h-5 w-5" />
              <div>
                <h2 className="text-xl font-semibold text-white">Active swaps</h2>
                <p className="mt-1 text-sm text-slate-400">Accepted requests that are ready for conversation.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {activeSwaps.length ? (
                activeSwaps.map((match) => (
                  <CompactMatchCard key={match.id} match={match} ctaLabel="Open chat" ctaTo="/chat" />
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-emerald-300/15 bg-emerald-300/8 p-5 text-sm leading-7 text-slate-200">
                  Accepted requests will move here automatically, and you can jump straight into chat.
                </div>
              )}
            </div>

            <Link to="/chat" className="btn-secondary mt-5 justify-center">
              <MessageCircleMore className="h-4 w-4" />
              <span>Open messages</span>
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
