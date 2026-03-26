import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, MessageCircleMore, Search, SendHorizontal, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import Loader from '../components/Loader.jsx';
import { getConversations, sendMessage } from '../services/platformService.js';
import { formatDate } from '../utils/formatDate.js';
import { toast } from '../utils/notifications.js';

export default function Chat() {
  const { user } = useAuth();
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === 'undefined' ? true : window.innerWidth >= 1024,
  );
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    function handleResize() {
      setIsDesktop(window.innerWidth >= 1024);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadConversations() {
      try {
        const data = await getConversations(user?.id);

        if (!isMounted) {
          return;
        }

        setConversations(data);
        setSelectedConversationId((current) => current || (isDesktop ? data[0]?.id || '' : ''));
      } catch (error) {
        toast.error(error.message || 'Unable to load chats.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadConversations();

    return () => {
      isMounted = false;
    };
  }, [isDesktop, user?.id]);

  useEffect(() => {
    if (isDesktop && conversations.length && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, isDesktop, selectedConversationId]);

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const lastMessage = conversation.messages?.[conversation.messages.length - 1]?.text || '';
      const haystack = `${conversation.participant?.name} ${conversation.participant?.headline} ${lastMessage}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [conversations, query]);

  const selectedConversation =
    filteredConversations.find((conversation) => conversation.id === selectedConversationId) ||
    conversations.find((conversation) => conversation.id === selectedConversationId) ||
    null;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ block: 'end' });
    }
  }, [selectedConversation?.id, selectedConversation?.messages?.length]);

  async function handleSendMessage(event) {
    event.preventDefault();

    if (!selectedConversation || !messageText.trim()) {
      return;
    }

    try {
      const nextConversations = await sendMessage(
        selectedConversation.participantId,
        messageText.trim(),
        user?.id,
      );
      setConversations(nextConversations);
      setMessageText('');
    } catch (error) {
      toast.error(error.message || 'Unable to send message.');
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="grid gap-4 xl:min-h-[74vh] xl:grid-cols-[360px_minmax(0,1fr)] xl:gap-6">
      <aside
        className={`glass-card overflow-hidden ${selectedConversation && !isDesktop ? 'hidden' : 'flex'} min-h-[72vh] flex-col`}
      >
        <div className="border-b border-white/10 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-cyan-200">
            <MessageCircleMore className="h-5 w-5" />
            <p className="section-kicker !text-sm">Messages</p>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold text-white">Continue your swaps</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Pick a conversation and keep the exchange moving without leaving the platform.
          </p>

          <label className="input-shell mt-5">
            <Search className="input-icon" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search conversations"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="info-chip">{conversations.length} total chats</span>
            <span className="info-chip">
              <Sparkles className="h-4 w-4 text-cyan-200" />
              {filteredConversations.length} visible
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
          {filteredConversations.length ? (
            filteredConversations.map((conversation) => {
              const lastMessage = conversation.messages?.[conversation.messages.length - 1];
              const isActive = conversation.id === selectedConversationId;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={`w-full rounded-[24px] border p-4 text-left transition ${
                    isActive
                      ? 'border-cyan-300/30 bg-cyan-300/10'
                      : 'border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-white">{conversation.participant?.name}</p>
                        {conversation.hasUnread ? (
                          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-200" />
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{conversation.participant?.headline}</p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-500">{formatDate(lastMessage?.createdAt)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{lastMessage?.text || 'No messages yet.'}</p>
                </button>
              );
            })
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/12 bg-white/[0.04] p-6 text-center">
              <Search className="mx-auto h-8 w-8 text-cyan-200" />
              <p className="mt-4 text-lg font-semibold text-white">No conversations found</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Try another search term or clear the current filter.
              </p>
            </div>
          )}
        </div>
      </aside>

      <div className={`glass-card min-h-[72vh] overflow-hidden ${selectedConversation || isDesktop ? 'flex' : 'hidden'} flex-col`}>
        {selectedConversation ? (
          <>
            <div className="border-b border-white/10 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  {!isDesktop ? (
                    <button
                      type="button"
                      onClick={() => setSelectedConversationId('')}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  ) : null}

                  <div className="min-w-0">
                    <p className="font-display text-2xl font-semibold text-white">
                      {selectedConversation.participant?.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{selectedConversation.participant?.headline}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(selectedConversation.participant?.skillsOffered || []).slice(0, 2).map((skill) => (
                    <span key={skill} className="tag tag-offered">
                      {skill}
                    </span>
                  ))}
                  {(selectedConversation.participant?.skillsWanted || []).slice(0, 2).map((skill) => (
                    <span key={skill} className="tag tag-wanted">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5 lg:p-6">
              {selectedConversation.messages?.map((message) => {
                const isOwn = message.senderId === user?.id;

                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[90%] rounded-[26px] px-4 py-3 sm:max-w-[78%] ${
                        isOwn
                          ? 'bg-gradient-to-r from-cyan-300 via-sky-300 to-amber-200 text-slate-950'
                          : 'border border-white/10 bg-white/[0.05] text-slate-100'
                      }`}
                    >
                      <p className="text-sm leading-7">{message.text}</p>
                      <p className={`mt-2 text-xs ${isOwn ? 'text-slate-700' : 'text-slate-400'}`}>
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form className="border-t border-white/10 p-4 sm:p-5" onSubmit={handleSendMessage}>
              <div className="input-shell rounded-[26px] pr-2">
                <MessageCircleMore className="input-icon" />
                <input
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder={`Message ${selectedConversation.participant?.name}`}
                />
                <button
                  type="submit"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 transition hover:bg-cyan-200"
                >
                  <SendHorizontal className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-center sm:p-10">
            <div className="max-w-md">
              <MessageCircleMore className="mx-auto h-12 w-12 text-cyan-200" />
              <p className="mt-4 text-xl font-semibold text-white">Choose a conversation to begin</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Accepted swaps and existing chats appear on the left. Select one to continue the exchange.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
