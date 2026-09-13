'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/dashboard/Header';
import { Search, Send, Loader2 } from 'lucide-react';

interface BotMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export default function CreatorMessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // NaanoBot simulated interactive chat state
  const [botMessages, setBotMessages] = useState<BotMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Hi! I'm NaanoBot. Need help with brand collaborations, setting up your LinkedIn Deal Link, or managing payouts? Ask me anything!",
      time: 'Now',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  async function loadData() {
    try {
      const [msgRes, userRes] = await Promise.all([
        fetch('/api/messages'),
        fetch('/api/auth/me'),
      ]);

      if (msgRes.ok) {
        const data = await msgRes.json();
        setConversations(data.conversations || []);
      }

      if (userRes.ok) {
        const uData = await userRes.json();
        setCurrentUser(uData.user);
      }
    } catch (e) {
      console.error('Failed to load messages data', e);
    } finally {
      setLoading(false);
    }
  }

  async function loadActiveConversation(collabId: string) {
    try {
      const res = await fetch(`/api/messages?collabId=${collabId}`);
      if (res.ok) {
        const json = await res.json();
        setActiveConversation(json.conversation);
      }
    } catch (e) {
      console.error('Failed to load active conversation', e);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedThreadId && selectedThreadId !== 'naanobot') {
      loadActiveConversation(selectedThreadId);
      const timer = setInterval(() => {
        loadActiveConversation(selectedThreadId);
      }, 3000);
      return () => clearInterval(timer);
    } else {
      setActiveConversation(null);
    }
  }, [selectedThreadId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [botMessages, activeConversation]);

  const filteredConversations = conversations.filter((c) => {
    const name = c.collaboration?.company?.name || '';
    const title = c.collaboration?.campaign?.title || '';
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || title.toLowerCase().includes(query);
  });

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageText = inputMessage.trim();
    setInputMessage('');

    if (selectedThreadId === 'naanobot' || selectedThreadId === null) {
      // Send to NaanoBot
      const userMsg: BotMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setBotMessages((prev) => [...prev, userMsg]);
      setSelectedThreadId('naanobot');

      // Bot automated intelligent reply
      setTimeout(() => {
        let reply = "Thanks for your message! Our creator success team reviews all queries daily. In the meantime, you can customize your public Deal Link or review open brand briefs in the Opportunities tab.";
        const lower = messageText.toLowerCase();

        if (lower.includes('payout') || lower.includes('withdraw') || lower.includes('money') || lower.includes('earn')) {
          reply = "Payouts are processed instantly once the sponsor brand approves your published post. You can connect your Stripe account or add bank details in the Earnings tab.";
        } else if (lower.includes('deal link') || lower.includes('linkedin') || lower.includes('card')) {
          reply = "Your Deal Link is always active! You can copy your personalized card link from the Community or My Card page and paste it into your LinkedIn 'Custom button' or 'Featured' section.";
        } else if (lower.includes('brand') || lower.includes('collab') || lower.includes('booking') || lower.includes('campaign')) {
          reply = "When a brand invites you or accepts your proposal, a direct private thread will automatically open right here in your Messages so you can align on briefs and publication dates.";
        }

        const botReply: BotMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setBotMessages((prev) => [...prev, botReply]);
      }, 700);
      return;
    }

    // Real brand collaboration message
    if (!activeConversation) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          content: messageText,
        }),
      });

      if (res.ok) {
        await Promise.all([
          loadActiveConversation(selectedThreadId),
          loadData(),
        ]);
      }
    } catch (e) {
      console.error('Failed to send message', e);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen">
      {/* Sticky Dashboard Header */}
      <Header
        balance={0}
        user={{
          name: currentUser?.name,
          avatarUrl: currentUser?.avatarUrl || currentUser?.creator?.avatarUrl,
        }}
      />

      {/* Main Messages Layout */}
      <div className="flex-1 flex min-h-[calc(100vh-58px)]">
        {/* LEFT COLUMN: Threads List */}
        <div className="w-80 sm:w-88 bg-white border-r border-[#E2E8F0] flex flex-col shrink-0">
          {/* Messages Heading */}
          <div className="px-6 pt-6 pb-4">
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">
              Messages
            </h1>
          </div>

          {/* Search conversations input */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations"
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2864EA] transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto">
            {/* NaanoBot Item */}
            <div
              onClick={() => setSelectedThreadId('naanobot')}
              className={`p-3.5 mx-3 rounded-2xl flex items-start gap-3 transition-colors cursor-pointer ${
                selectedThreadId === 'naanobot'
                  ? 'bg-[#F0F5FF]'
                  : 'hover:bg-slate-50/80'
              }`}
            >
              {/* Naano Logo Mark */}
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                <img
                  src="/lp/naano-mark.png"
                  alt="Naano"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Bot Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111827]">
                    NaanoBot
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">Now</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[11px] text-[#64748B] truncate max-w-[145px]">
                    A question or need help? Start here.
                  </p>
                  <span className="w-4 h-4 rounded-full bg-[#2864EA] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic brand conversation threads */}
            {filteredConversations.map((conv) => {
              const isSelected =
                selectedThreadId === conv.collaborationId || selectedThreadId === conv.id;
              const companyName = conv.collaboration?.company?.name || 'Brand';
              const companyLogo = conv.collaboration?.company?.logoUrl;
              const lastMsg = conv.messages?.[0]?.content || 'Started collaboration';

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedThreadId(conv.collaborationId || conv.id)}
                  className={`p-3.5 mx-3 mt-1 rounded-2xl flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#F0F5FF]' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                    {companyLogo ? (
                      <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-[#111827]">
                        {companyName.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827] truncate">
                        {companyName}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">
                        {new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {lastMsg}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Empty state notice if no brand conversations yet */}
            {conversations.length === 0 && (
              <div className="px-6 pt-6">
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  No conversations yet - the thread opens with your first Booking.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Chat Conversation Area */}
        <div className="w-[560px] md:w-[620px] lg:w-[680px] bg-white border-r border-[#E2E8F0] flex flex-col">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-[#E2E8F0] flex flex-col justify-center">
            <h2 className="text-sm font-bold text-[#111827] leading-tight">
              {selectedThreadId === 'naanobot'
                ? 'NaanoBot'
                : activeConversation?.collaboration?.company?.name || 'Messages'}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              {selectedThreadId === 'naanobot'
                ? 'A question or need help? Start here.'
                : activeConversation
                ? `${activeConversation.collaboration?.campaign?.title || 'Collaboration'} • €${activeConversation.collaboration?.fixedRate || 250}`
                : 'Select a conversation'}
            </p>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
            {/* When NaanoBot is active */}
            {selectedThreadId === 'naanobot' ? (
              <div className="space-y-4">
                {botMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] p-1 flex items-center justify-center shrink-0 shadow-2xs">
                        <img src="/lp/naano-mark.png" alt="Naano" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div
                      className={`max-w-[380px] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        msg.sender === 'user'
                          ? 'bg-[#2864EA] text-white rounded-br-none'
                          : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#111827] rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Quick Suggestion Chips */}
                {botMessages.length <= 2 && (
                  <div className="pt-3 flex flex-wrap gap-2">
                    {[
                      'How do brand collaborations work?',
                      'How do I get paid for a post?',
                      'Where do I copy my Deal Link?',
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setInputMessage(chip);
                        }}
                        className="text-[11px] font-semibold text-[#2864EA] bg-[#F0F5FF] hover:bg-blue-100/70 border border-blue-200/60 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            ) : activeConversation ? (
              /* Real brand conversation messages from database */
              <div className="space-y-4">
                {activeConversation.messages?.map((msg: any) => {
                  const isMe = msg.sender?.id === currentUser?.id || msg.sender?.role === 'CREATOR';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[420px]">
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0 text-[#111827]">
                            {msg.sender?.name?.slice(0, 2).toUpperCase() || 'BR'}
                          </div>
                        )}
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                            isMe
                              ? 'bg-[#2864EA] text-white rounded-br-none'
                              : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#111827] rounded-bl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                      <span className="text-[9px] text-[#94A3B8] mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
            ) : (
              /* Default Empty State matching screenshot exactly */
              <div className="my-auto text-center py-20">
                <p className="text-xs sm:text-[13px] text-[#64748B]">
                  No conversations yet.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Message Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 px-6 border-t border-[#E2E8F0] bg-white flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 py-3 px-5 text-xs text-[#111827] placeholder:text-[#94A3B8] bg-white border border-[#E2E8F0] rounded-full focus:outline-none focus:border-[#2864EA] transition-all shadow-2xs"
            />
            <button
              type="submit"
              disabled={sending || !inputMessage.trim()}
              className="w-10 h-10 rounded-full bg-[#2864EA] hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center shrink-0 shadow-xs cursor-pointer transition-all active:scale-95 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 -rotate-45 ml-0.5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
