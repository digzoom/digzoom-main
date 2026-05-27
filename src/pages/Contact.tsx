import { useState } from 'react';
import { Mail, Phone, MessageCircle, MapPin, Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

export default function Contact() {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success(lang === 'ar' ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' : 'Your message has been sent! We will contact you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1000);
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5 text-blue-400" />, title: t.contact.email, value: 'support@digzoom.com', color: 'blue' },
    { icon: <Phone className="w-5 h-5 text-purple-400" />, title: t.contact.phone, value: '+966 56 988 8456', color: 'purple' },
    { icon: <MessageCircle className="w-5 h-5 text-emerald-400" />, title: t.contact.whatsapp, value: '+966 56 988 8456', color: 'emerald', link: 'https://wa.me/00966569888456' },
    { icon: <MapPin className="w-5 h-5 text-orange-400" />, title: t.contact.location, value: t.contact.locationValue, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">{t.contact.title}</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">{t.contact.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {contactInfo.map((c, i) => (
              <div key={i} className="bg-[#151520] rounded-2xl border border-white/[0.04] p-5 flex items-center gap-4 hover:border-white/[0.08] transition-all">
                <div className={`w-12 h-12 rounded-xl bg-${c.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                  {c.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{c.title}</h3>
                  <p className="text-gray-400 text-sm">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-[#151520] rounded-2xl border border-white/[0.04] p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-500 text-sm mb-2">{t.contact.formName}</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-colors placeholder:text-gray-700"
                    placeholder={t.contact.formNamePlaceholder} />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-2">{t.contact.formEmail}</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-colors placeholder:text-gray-700"
                    dir="ltr" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-500 text-sm mb-2">{t.contact.formSubject}</label>
                <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-colors placeholder:text-gray-700"
                  placeholder={t.contact.formSubjectPlaceholder} />
              </div>
              <div className="mb-6">
                <label className="block text-gray-500 text-sm mb-2">{t.contact.formMessage}</label>
                <textarea required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-colors placeholder:text-gray-700 resize-none"
                  placeholder={t.contact.formMessagePlaceholder} />
              </div>
              <button type="submit" disabled={sending}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-medium transition-all flex items-center gap-2">
                <Send className="w-4 h-4" /> {sending ? t.contact.btnSending : t.contact.btnSend}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
