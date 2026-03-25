import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';

export default function SupportAgent() {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Create conversation on first open
  useEffect(() => {
    if (!open || conversation) return;
    (async () => {
      const conv = await base44.agents.createConversation({
        agent_name: 'support_agent',
        metadata: { name: 'Supporto' },
      });
      setConversation(conv);
      setMessages(conv.messages || []);
    })();
  }, [open]);

  // Subscribe to updates
  useEffect(() => {
    if (!conversation?.id) return;
    const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  }, [conversation?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending || !conversation) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    await base44.agents.addMessage(conversation, { role: 'user', content: text });
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isWaiting = sending || (messages.length > 0 && messages[messages.length - 1]?.role === 'user');

  return (
    <>
      {/* FAB button */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Supporto"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 36 }}
              className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-card rounded-t-2xl border-t border-border shadow-xl"
              style={{
                height: '75dvh',
                paddingBottom: 'env(safe-area-inset-bottom)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div>
                  <p className="text-sm font-semibold">Supporto SketchForge</p>
                  <p className="text-xs text-muted-foreground">Contestazioni · Rimborsi · GDPR</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {!conversation && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {messages.map((msg, i) => {
                  if (msg.role === 'tool') return null;
                  const isUser = msg.role === 'user';
                  return (
                    <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                          isUser
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <ReactMarkdown className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  );
                })}
                {isWaiting && !sending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-3 py-2.5 flex gap-1">
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="shrink-0 px-4 pb-3 pt-2 border-t border-border flex gap-2 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Descrivi il tuo problema…"
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50 max-h-28 overflow-y-auto"
                  style={{ minHeight: 44 }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending || !conversation}
                  className="w-11 h-11 rounded-xl bg-foreground text-background flex items-center justify-center disabled:opacity-40 shrink-0"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}