'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/dashboard/Header';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  ChevronDown,
  SquarePen,
  Send,
  Loader2,
  Paperclip,
  CheckCircle2,
  Sparkles,
  User,
  X,
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    role: string;
  } | null;
}

interface ConversationItem {
  id: string;
  collaborationId: string;
  updatedAt: string;
  collaboration?: {
    id: string;
    status: string;
    fixedRate?: number;
    campaign?: {
      id: string;
      title: string;
      budgetPerPost?: number;
    } | null;
    creator?: {
      id: string;
      headline?: string | null;
      niche?: string | null;
      user?: {
        name: string;
        avatarUrl?: string | null;
      } | null;
    } | null;
  } | null;
  messages?: Message[];
}

export default function CompanyMessagesPage() {
  const searchParams = useSearchParams();
  const initialCollabId = searchParams.get('collabId');

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | 'naanobot' | null>(
    initialCollabId ? initialCollabId : null
  );
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'campaign'>('all');
  const [selectedCampaignFilter, setSelectedCampaignFilter] = useState('ALL');
  const [campaignOptions, setCampaignOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // NaanoBot State
  const [botMessages, setBotMessages] = useState<
    { id: string; sender: 'bot' | 'user'; text: string; time: string }[]
  >([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hello! I'm NaanoBot, your dedicated assistant. You can ask me anything about finding creators, launching campaigns, tracking performance, or managing payments.",
      time: 'Now',
    },
  ]);
  const [botTyping, setBotTyping] = useState(false);

  // New Chat Modal
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [allCreators, setAllCreators] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, botMessages, selectedChatId]);

  // Load user
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Load conversations
  async function loadConversations() {
    setLoading(true);
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        const convList = data.conversations || [];
        setConversations(convList);

        // Extract campaign options
        const camps = new Set<string>();
        convList.forEach((c: any) => {
          if (c.collaboration?.campaign?.title) {
            camps.add(c.collaboration.campaign.title);
          }
        });
        setCampaignOptions(Array.from(camps));
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConversations();
  }, []);

  // Load active creator conversation
  async function loadActiveChat(collabId: string) {
    try {
      const res = await fetch(`/api/messages?collabId=${collabId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveConversation(data.conversation);
      }
    } catch (e) {}
  }

  useEffect(() => {
    if (selectedChatId && selectedChatId !== 'naanobot') {
      loadActiveChat(selectedChatId);
      const timer = setInterval(() => loadActiveChat(selectedChatId), 4000);
      return () => clearInterval(timer);
    } else {
      setActiveConversation(null);
    }
  }, [selectedChatId]);

  // Send message to creator
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // If chatting with NaanoBot
    if (selectedChatId === 'naanobot') {
      const userText = newMessage.trim();
      const userMsg = {
        id: `user-${Date.now()}`,
        sender: 'user' as const,
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setBotMessages((prev) => [...prev, userMsg]);
      setNewMessage('');
      setBotTyping(true);

      setTimeout(() => {
        let reply =
          "Thanks for reaching out! You can book verified B2B creators directly through the Marketplace, send invitations, and manage your live campaigns under the Campaigns tab.";
        const lower = userText.toLowerCase();

        if (lower.includes('campaign') || lower.includes('brief')) {
          reply =
            "To launch a campaign, click '+ Create a campaign' on the Campaigns page. Our AI assistant will automatically generate a tailored brief with talking points, angles, and recommended creator filters.";
        } else if (lower.includes('payout') || lower.includes('pay') || lower.includes('budget')) {
          reply =
            "Payouts are fully protected: funds remain in escrow until you approve the creator's submitted draft. Once approved, the payout is released seamlessly.";
        } else if (lower.includes('creator') || lower.includes('book')) {
          reply =
            "Browse through top creators on the Marketplace page, or switch to AI Matching mode to describe your exact target buyer personas!";
        }

        setBotMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setBotTyping(false);
      }, 700);

      return;
    }

    // Normal message to creator
    if (!activeConversation) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          content: newMessage.trim(),
        }),
      });
      if (res.ok) {
        setNewMessage('');
        loadActiveChat(selectedChatId!);
      }
    } catch (e) {
    } finally {
      setSending(false);
    }
  }

  // Load creators for new chat modal
  async function openNewChatModal() {
    setIsNewChatOpen(true);
    if (allCreators.length === 0) {
      try {
        const res = await fetch('/api/creators');
        if (res.ok) {
          const data = await res.json();
          setAllCreators(data.creators || []);
        }
      } catch (e) {}
    }
  }

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const name = conv.collaboration?.creator?.user?.name?.toLowerCase() || '';
      const campaign = conv.collaboration?.campaign?.title?.toLowerCase() || '';
      const lastMsg = conv.messages?.[0]?.content?.toLowerCase() || '';
      if (!name.includes(query) && !campaign.includes(query) && !lastMsg.includes(query)) {
        return false;
      }
    }

    // Campaign filter
    if (
      selectedCampaignFilter !== 'ALL' &&
      conv.collaboration?.campaign?.title !== selectedCampaignFilter
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] h-screen overflow-hidden">
      {/* Top Header */}
      <Header balance={0} user={currentUser} />

      {/* Split Main Layout: Left Conversation Sidebar + Right Chat Panel */}
      <div className="flex-1 flex min-h-0 bg-white">
        {/* ========================================================================= */}
        {/* LEFT PANEL: CONVERSATION LIST (Matches Reference Screenshot)               */}
        {/* ========================================================================= */}
        <div className="w-80 sm:w-[350px] border-r border-[#E2E8F0] flex flex-col shrink-0 bg-white h-full overflow-hidden">
          {/* Header Row */}
          <div className="p-5 pb-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              Messages
            </h2>

            {/* Pencil / Compose Icon */}
            <button
              type="button"
              onClick={openNewChatModal}
              className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              title="New message"
            >
              <SquarePen className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="px-5 pb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations"
                className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Segmented Filter Pills */}
          <div className="px-5 pb-3">
            <div className="bg-[#F1F5F9]/80 p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setFilterMode('all');
                  setSelectedCampaignFilter('ALL');
                }}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-white text-[#2563EB] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All messages
              </button>

              <div className="relative">
                <select
                  value={selectedCampaignFilter}
                  onChange={(e) => {
                    setSelectedCampaignFilter(e.target.value);
                    if (e.target.value !== 'ALL') setFilterMode('campaign');
                  }}
                  className="appearance-none bg-transparent text-slate-600 hover:text-slate-900 text-xs font-semibold px-3 py-1.5 pr-6 rounded-lg focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Campaign</option>
                  {campaignOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Conversations Thread List */}
          <div className="flex-1 overflow-y-auto px-4 space-y-1.5">
            {/* 1. NaanoBot Thread (Permanent Support Thread from Screenshot) */}
            <div
              onClick={() => setSelectedChatId('naanobot')}
              className={`rounded-2xl p-3.5 transition-all cursor-pointer flex items-center gap-3 relative border ${
                selectedChatId === 'naanobot'
                  ? 'bg-[#F0F5FA] border-blue-200/80 shadow-2xs'
                  : 'bg-white hover:bg-slate-50/80 border-transparent'
              }`}
            >
              {/* Naano Mark Logo */}
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-2xs">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M4 14C4 9.58172 7.58172 6 12 6H15C17.2091 6 19 7.79086 19 10C19 12.2091 17.2091 14 15 14H8C5.79086 14 4 15.7909 4 18V14Z" />
                </svg>
              </div>

              {/* Title & Preview */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-[#0F172A] truncate">
                    NaanoBot
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Now</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Have a question or need help? Click here.
                </p>
              </div>

              {/* Unread Counter Badge */}
              <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                1
              </span>
            </div>

            {/* 2. Other Creator Conversations */}
            {loading ? (
              <div className="py-10 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
                <span className="text-xs font-semibold">Loading messages...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="py-4 px-3 text-xs text-slate-400 font-normal">
                No conversations yet.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedChatId === conv.collaborationId;
                const creatorName = conv.collaboration?.creator?.user?.name || 'Creator';
                const creatorAvatar = conv.collaboration?.creator?.user?.avatarUrl;
                const campaignTitle = conv.collaboration?.campaign?.title || 'Campaign';
                const lastMsg =
                  conv.messages?.[conv.messages.length - 1]?.content ||
                  'Started collaboration';

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChatId(conv.collaborationId)}
                    className={`rounded-2xl p-3.5 transition-all cursor-pointer flex items-center gap-3 relative border ${
                      isSelected
                        ? 'bg-[#F0F5FA] border-blue-200/80 shadow-2xs'
                        : 'bg-white hover:bg-slate-50/80 border-transparent'
                    }`}
                  >
                    {/* Creator Avatar with Status Dot */}
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                        {creatorAvatar ? (
                          <img
                            src={creatorAvatar}
                            alt={creatorName}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                            {creatorName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    {/* Text Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#0F172A] truncate">
                          {creatorName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {campaignTitle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {lastMsg}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: MAIN CHAT AREA (Matches Reference Screenshot)                 */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">
          {/* Top Chat Header */}
          <div className="border-b border-[#F1F5F9] px-8 py-4 bg-white shrink-0">
            <h3 className="font-bold text-sm text-[#0F172A]">Messages</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Threads open with your bookings
            </p>
          </div>

          {/* Chat Body */}
          {selectedChatId === 'naanobot' ? (
            /* ================= NaanoBot Interactive Chat ================= */
            <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC]">
              {/* Messages Stream */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {botMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-end gap-2 max-w-lg">
                      {msg.sender === 'bot' && (
                        <div className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center text-xs shrink-0 shadow-2xs">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                            <path d="M4 14C4 9.58172 7.58172 6 12 6H15C17.2091 6 19 7.79086 19 10C19 12.2091 17.2091 14 15 14H8C5.79086 14 4 15.7909 4 18V14Z" />
                          </svg>
                        </div>
                      )}
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          msg.sender === 'user'
                            ? 'bg-[#2563EB] text-white rounded-br-none'
                            : 'bg-white border border-[#E2E8F0] text-[#0F172A] rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))}

                {botTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 pl-9">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2563EB]" />
                    <span>NaanoBot is thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-6 py-2 bg-white/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setNewMessage('How do creator bookings work?')}
                  className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  ⚡ How do creator bookings work?
                </button>
                <button
                  type="button"
                  onClick={() => setNewMessage('How do I create a campaign brief?')}
                  className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  🎯 How to set up a brief?
                </button>
                <button
                  type="button"
                  onClick={() => setNewMessage('How are creator payouts handled?')}
                  className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  💰 How do payouts work?
                </button>
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white border-t border-[#E2E8F0] flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask NaanoBot anything about campaigns or creators..."
                  className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold shadow-2xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ) : activeConversation ? (
            /* ================= Creator Direct Conversation ================= */
            <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC]">
              {/* Creator Info Bar */}
              <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                    {activeConversation.collaboration?.creator?.user?.avatarUrl ? (
                      <img
                        src={activeConversation.collaboration.creator.user.avatarUrl}
                        alt={activeConversation.collaboration.creator.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                        {activeConversation.collaboration?.creator?.user?.name
                          ?.slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#0F172A] block leading-tight">
                      {activeConversation.collaboration?.creator?.user?.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Campaign:{' '}
                      <span className="text-[#2563EB] font-semibold">
                        {activeConversation.collaboration?.campaign?.title}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    €{activeConversation.collaboration?.campaign?.budgetPerPost || 0}
                  </span>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {activeConversation.messages?.map((msg: any) => {
                  const isMe = msg.sender.role === 'COMPANY';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isMe ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-end gap-2 max-w-lg">
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {msg.sender.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                            isMe
                              ? 'bg-[#2563EB] text-white rounded-br-none'
                              : 'bg-white border border-[#E2E8F0] text-[#0F172A] rounded-bl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white border-t border-[#E2E8F0] flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message or review note..."
                  className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold shadow-2xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {sending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ================= Exact Empty State from Screenshot ================= */
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <span className="text-xs text-slate-400 font-normal">
                No conversations yet.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NEW MESSAGE MODAL (When clicking pencil icon)                             */}
      {/* ========================================================================= */}
      {isNewChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0F172A]">Start conversation</h3>
              <button
                type="button"
                onClick={() => setIsNewChatOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select a creator from your booked collaborations or marketplace:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {allCreators.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-[#2563EB] mx-auto mb-1" />
                  Loading creators...
                </div>
              ) : (
                allCreators.map((creator) => (
                  <div
                    key={creator.id}
                    onClick={() => {
                      setIsNewChatOpen(false);
                      // If collaboration exists, select it
                      const existingConv = conversations.find(
                        (c) => c.collaboration?.creator?.id === creator.id
                      );
                      if (existingConv) {
                        setSelectedChatId(existingConv.collaborationId);
                      } else {
                        // Switch to NaanoBot to assist booking this creator
                        setSelectedChatId('naanobot');
                        setNewMessage(`I would like to message ${creator.name || creator.user?.name}`);
                      }
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                        {creator.avatarUrl || creator.user?.avatarUrl ? (
                          <img
                            src={creator.avatarUrl || creator.user?.avatarUrl}
                            alt={creator.name || creator.user?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                            {(creator.name || creator.user?.name || 'CR')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#0F172A] block">
                          {creator.name || creator.user?.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {creator.niche || creator.headline}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#2563EB]">Message &rarr;</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
