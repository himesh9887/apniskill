import { useEffect, useMemo, useState } from 'react';
import { MessageCircleMore, Search, SendHorizontal } from 'lucide-react';
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
    <section className="grid gap-4 lg:h-[calc(100dvh-8.5rem)] lg:grid-cols-[0.42fr_0.58fr] lg:gap-6 lg:overflow-hidden">
      <aside
        className={`glass-card overflow-hidden lg:flex lg:h-full lg:min-h-0 lg:flex-col ${selectedConversation && !isDesktop ? 'hidden' : 'block'}`}
      >
        <div className="border-b border-white/10 p-4 sm:p-5">
          <p className="section-kicker">Messages</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Continue your swaps</h1>

          <label className="input-shell mt-5">
            <Search className="input-icon" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search conversations"
            />
          </label>
        </div>

        <div className="max-h-[70vh] space-y-2 overflow-y-auto p-3 lg:min-h-0 lg:flex-1 lg:space-y-3 lg:pr-2">
          {filteredConversations.map((conversation) => {
            const lastMessage = conversation.messages?.[conversation.messages.length - 1];
            const isActive = conversation.id === selectedConversationId;

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setSelectedConversationId(conversation.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? 'border-sky-300/40 bg-sky-300/10'
                    : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/8'
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{conversation.participant?.name}</p>
                      {conversation.hasUnread ? (
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-300" />
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{conversation.participant?.headline}</p>
                  </div>
                  <span className="text-xs text-slate-500">{formatDate(lastMessage?.createdAt)}</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">{lastMessage?.text || 'No messages yet.'}</p>
              </button>
            );
          })}
        </div>
      </aside>

      <div
        className={`glass-card ${selectedConversation || isDesktop ? 'flex' : 'hidden'} min-h-[520px] flex-col overflow-hidden lg:h-full lg:min-h-0`}
      >
        {selectedConversation ? (
          <>
            <div className="border-b border-white/10 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                {!isDesktop ? (
                  <button
                    type="button"
                    onClick={() => setSelectedConversationId('')}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Back
                  </button>
                ) : null}
                <div className="min-w-0">
                  <p className="text-xl font-semibold text-white">{selectedConversation.participant?.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{selectedConversation.participant?.headline}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5 lg:min-h-0 lg:pr-3">
              {selectedConversation.messages?.map((message) => {
                const isOwn = message.senderId === user?.id;

                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[88%] rounded-3xl px-4 py-3 sm:max-w-[78%] ${
                        isOwn
                          ? 'bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950'
                          : 'border border-white/10 bg-white/5 text-slate-100'
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
            </div>

            <form className="border-t border-white/10 p-4 sm:p-5" onSubmit={handleSendMessage}>
              <div className="input-shell rounded-[28px] pr-2">
                <MessageCircleMore className="input-icon" />
                <input
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder={`Message ${selectedConversation.participant?.name}`}
                />
                <button
                  type="submit"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-300 text-slate-950"
                >
                  <SendHorizontal className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-10 text-center">
            <div>
              <MessageCircleMore className="mx-auto h-10 w-10 text-sky-300" />
              <p className="mt-4 text-lg font-medium text-white">No conversation selected.</p>
              <p className="mt-2 text-sm text-slate-400">
                Choose a chat from the left to continue the exchange.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
