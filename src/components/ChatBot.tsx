import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Phone, MinusCircle, Bot, User, Sparkles } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useLanguage } from '@/hooks/useLanguage';

export default function ChatBot() {
  const { lang } = useLanguage();
  const {
    isOpen,
    messages,
    isTyping,
    hasUnread,
    suggestions,
    toggleChat,
    sendMessage,
    chatContainerRef,
  } = useChat(lang as 'ar' | 'en');

  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isAr = lang === 'ar';

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleSuggestion = (text: string) => {
    sendMessage(text);
  };

  const handleWhatsApp = () => {
    const phone = '00966569888456';
    const message = isAr
      ? 'مرحباً، أحتاج مساعدة بخصوص موقع digzoom'
      : 'Hello, I need help with digzoom website';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-full shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
          style={{ [isAr ? 'left' : 'right']: '24px' }}
          aria-label="Open chat"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            {isAr ? 'دعم digzoom' : 'digzoom Support'}
          </span>
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 z-50 w-[380px] max-w-[calc(100vw-32px)] bg-[#0f0f1a] rounded-2xl shadow-2xl shadow-black/50 border border-white/[0.08] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300"
          style={{
            [isAr ? 'left' : 'right']: '24px',
            height: '560px',
            maxHeight: 'calc(100vh - 48px)',
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm truncate">
                {isAr ? 'مساعد digzoom الذكي' : 'digzoom AI Assistant'}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/80 text-xs">
                  {isAr ? 'متصل الآن' : 'Online now'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleWhatsApp}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                title="WhatsApp"
              >
                <Phone className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={toggleChat}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <MinusCircle className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={toggleChat}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'bot'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                      : 'bg-gradient-to-br from-orange-500 to-pink-500'
                  }`}
                >
                  {msg.sender === 'bot' ? (
                    <Sparkles className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.sender === 'bot'
                      ? 'bg-[#1a1a2e] text-gray-100 rounded-tl-sm border border-white/[0.06]'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-sm'
                  }`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#1a1a2e] rounded-2xl rounded-tl-sm px-4 py-3 border border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !isTyping && (
            <div className="px-4 pb-2 shrink-0">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(s)}
                    className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="px-4 pb-2 shrink-0 flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/20 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {isAr ? 'واتساب' : 'WhatsApp'}
            </button>
            <span className="text-gray-600 text-[10px]">
              {isAr ? 'رقم الدعم: 00966569888456' : 'Support: 00966569888456'}
            </span>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-white/[0.06] bg-[#0a0a0f] shrink-0 flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isAr ? 'اكتب سؤالك هنا...' : 'Type your question...'}
              className="flex-1 bg-[#151520] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/40 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" style={{ transform: isAr ? 'scaleX(-1)' : 'none' }} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
