import { useEffect, useMemo, useState } from 'react';
import { MessageCircleMore, Search, SendHorizontal } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import Loader from '../components/Loader.jsx';
import { getConversations, sendMessage } from '../services/platformService.js';
import { formatDate } from '../utils/formatDate.js';
import { toast } from '../utils/notifications.js';

export default function Chat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadConversations() {
      try {
        const data = await getConversations(user?.id);

        if (!isMounted) {
          return;
        }

        setConversations(data);
        setSelectedConversationId(data[0]?.id || '');
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
  }, [user?.id]);

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
    <section className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
      <aside className="glass-card overflow-hidden">
        <div className="border-b border-white/10 p-5">
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

        <div className="max-h-[620px] space-y-2 overflow-y-auto p-3">
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
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{conversation.participant?.name}</p>
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

      <div className="glass-card flex min-h-[620px] flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            <div className="border-b border-white/10 p-5">
              <p className="text-xl font-semibold text-white">{selectedConversation.participant?.name}</p>
              <p className="mt-1 text-sm text-slate-400">{selectedConversation.participant?.headline}</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {selectedConversation.messages?.map((message) => {
                const isOwn = message.senderId === user?.id;

                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[78%] rounded-3xl px-4 py-3 ${
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

            <form className="border-t border-white/10 p-5" onSubmit={handleSendMessage}>
              <div className="input-shell">
                <MessageCircleMore className="input-icon" />
                <input
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder={`Message ${selectedConversation.participant?.name}`}
                />
                <button
                  type="submit"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-300 text-slate-950"
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
