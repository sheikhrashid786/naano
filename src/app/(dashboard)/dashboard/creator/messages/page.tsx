'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import { useSearchParams } from 'next/navigation';
import { MessageSquare, Send, Loader2, Building2 } from 'lucide-react';

export default function CreatorMessagesPage() {
  const searchParams = useSearchParams();
  const initialCollabId = searchParams.get('collabId');

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(initialCollabId);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadConversations() {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        if (!selectedCollabId && data.conversations?.length > 0) {
          setSelectedCollabId(data.conversations[0].collaborationId);
        }
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

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
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedCollabId) {
      loadActiveChat(selectedCollabId);
      const timer = setInterval(() => loadActiveChat(selectedCollabId), 5000);
      return () => clearInterval(timer);
    }
  }, [selectedCollabId]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          content: newMessage,
        }),
      });
      if (res.ok) {
        setNewMessage('');
        loadActiveChat(selectedCollabId!);
      }
    } catch (e) {
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen">
      <Header
        title="Messages"
        subtitle="Direct collaboration chat with SaaS brands regarding briefs, drafts, and publication."
      />

      <div className="flex-1 flex min-h-0 bg-white border-t border-[#E5E7EB]">
        {/* Left: Conversations Thread List */}
        <div className="w-80 border-r border-[#E5E7EB] flex flex-col shrink-0 bg-[#F9FAFB]">
          <div className="p-4 border-b border-[#E5E7EB] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            SaaS Brand Chats
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#E5E7EB]">
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9CA3AF]">
                No brand conversations yet
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = selectedCollabId === conv.collaborationId;
                const companyName = conv.collaboration?.company?.name || 'SaaS Brand';
                const campaignTitle = conv.collaboration?.campaign?.title || 'Campaign';
                const lastMsg = conv.messages?.[0]?.content || 'Started collaboration';

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedCollabId(conv.collaborationId)}
                    className={`w-full text-left p-4 transition-colors cursor-pointer ${
                      isSelected ? 'bg-white border-l-4 border-emerald-600 shadow-xs' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#111827] truncate">{companyName}</div>
                        <div className="text-[11px] text-emerald-600 truncate">{campaignTitle}</div>
                        <div className="text-[11px] text-[#6B7280] truncate mt-0.5">{lastMsg}</div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    {activeConversation.collaboration?.company?.name}
                  </h4>
                  <p className="text-xs text-[#6B7280]">
                    Campaign: {activeConversation.collaboration?.campaign?.title} • Fixed Payout: €{activeConversation.collaboration?.fixedRate}
                  </p>
                </div>
                <div className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200">
                  Status: {activeConversation.collaboration?.status?.replace('_', ' ')}
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#FAF9F6]">
                {activeConversation.messages?.map((msg: any) => {
                  const isMe = msg.sender.role === 'CREATOR';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-lg">
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold shrink-0 text-[#111827]">
                            {msg.sender.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                            isMe
                              ? 'bg-emerald-600 text-white rounded-br-none'
                              : 'bg-white border border-[#E5E7EB] text-[#111827] rounded-bl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                      <span className="text-[9px] text-[#9CA3AF] mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E5E7EB] bg-white flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a response to the brand or question about brief..."
                  className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#9CA3AF]">
              <MessageSquare className="w-10 h-10 mb-2 text-gray-300" />
              <p className="text-xs">Select a brand collaboration on the left to view the conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
