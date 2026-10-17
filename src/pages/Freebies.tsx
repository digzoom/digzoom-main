import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { ArrowDownToLine, CheckCircle2, Gift, Image, ListChecks, LockKeyhole } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const gifts = [
  { id: 'social-square', file: '/freebies/social-square.svg', image: '/freebies/social-square.svg', ar: 'خلفية منشور مربع', en: 'Square social background', arDesc: 'تصميم SVG بمقاس 1080 × 1080؛ عدّل ألوانه ونصوصك عليه.', enDesc: 'Editable 1080 × 1080 SVG background for your posts.' },
  { id: 'story-background', file: '/freebies/story-background.svg', image: '/freebies/story-background.svg', ar: 'خلفية ستوري', en: 'Story background', arDesc: 'خلفية عمودية بمقاس 1080 × 1920 للإعلانات والقصص.', enDesc: 'Vertical 1080 × 1920 SVG for stories and promotions.' },
  { id: 'offer-card', file: '/freebies/offer-card.svg', image: '/freebies/offer-card.svg', ar: 'بطاقة عرض', en: 'Offer card', arDesc: 'قالب بصري مجاني للعروض؛ أضف السعر والوصف في محررك.', enDesc: 'A visual offer template; add your price and copy in an editor.' },
  { id: 'marketing-checklist', file: '/freebies/marketing-checklist.txt', image: null, ar: 'قائمة فحص تسويقية', en: 'Marketing checklist', arDesc: 'خطوات عملية مختصرة قبل نشر حملة أو منتج جديد.', enDesc: 'A concise launch checklist for campaigns and new products.' },
] as const;

type GiftId = (typeof gifts)[number]['id'];

export default function Freebies() {
  const { lang } = useLanguage();
  const ar = lang === 'ar';
  const [selected, setSelected] = useState<GiftId>('social-square');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [unlocked, setUnlocked] = useState<GiftId | null>(null);
  const [error, setError] = useState('');
  const activeGift = gifts.find(gift => gift.id === selected)!;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    setUnlocked(null);
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch('/api/freebie-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, freebieId: selected, marketingConsent, website: form.get('website') || '' }),
      });
      if (!response.ok) throw new Error(response.status === 429 ? 'rate-limit' : 'save-error');
      const result = await response.json();
      if (!result.success) throw new Error('save-error');
      setUnlocked(selected);
      const link = document.createElement('a');
      link.href = activeGift.file;
      link.download = activeGift.file.split('/').pop() || 'digzoom-gift';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (cause) {
      setError(cause instanceof Error && cause.message === 'rate-limit'
        ? (ar ? 'طلبات كثيرة خلال ساعة. جرّب لاحقًا.' : 'Too many requests this hour. Please try later.')
        : (ar ? 'تعذّر حفظ الطلب. جرّب مرة أخرى.' : 'Could not save your request. Please try again.'));
    } finally {
      setBusy(false);
    }
  };

  return <main className="min-h-screen bg-[#f5f7fc] pt-24 pb-20 text-slate-950" dir={ar ? 'rtl' : 'ltr'}>
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="rounded-[2rem] bg-gradient-to-br from-[#071e46] via-[#162d6a] to-[#452587] px-6 py-12 text-white sm:px-12 sm:py-16">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold"><Gift size={18}/>{ar ? 'مكتبة DigZoom المجانية' : 'DigZoom free library'}</span>
        <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">{ar ? 'ملفات وصور تساعدك تبدأ أسرع' : 'Free files and visuals to get you moving'}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-indigo-100">{ar ? 'اختر هديتك، اكتب بريدك ورقم جوالك، ونزّلها فورًا. كل الملفات هنا من إعداد DigZoom، ويمكن استخدامها وتعديلها تجاريًا؛ لا تعِد بيعها كملفات مستقلة.' : 'Pick a gift, enter your email and phone, and download instantly. These files were made for DigZoom and may be edited and used commercially; please do not resell them as standalone files.'}</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px]">
        <section aria-label={ar ? 'الهدايا المتاحة' : 'Available gifts'}>
          <h2 className="text-2xl font-black">{ar ? 'اختر هديتك' : 'Choose your gift'}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {gifts.map(gift => <button key={gift.id} type="button" aria-pressed={selected === gift.id} onClick={() => { setSelected(gift.id); setUnlocked(null); setError(''); }} className={`overflow-hidden rounded-2xl border bg-white text-start shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${selected === gift.id ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-200'}`}>
              <div className="flex h-44 items-center justify-center overflow-hidden bg-slate-100">
                {gift.image ? <img src={gift.image} alt="" className="h-full w-full object-cover"/> : <ListChecks size={55} className="text-indigo-500"/>}
              </div>
              <div className="p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-black">{ar ? gift.ar : gift.en}</h3><span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{ar ? 'مجاني' : 'Free'}</span></div><p className="mt-2 text-sm leading-6 text-slate-600">{ar ? gift.arDesc : gift.enDesc}</p></div>
            </button>)}
          </div>
        </section>

        <section className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-xl lg:sticky lg:top-28" aria-label={ar ? 'طلب التنزيل' : 'Download request'}>
          <div className="flex items-center gap-3 text-blue-700">{activeGift.image ? <Image/> : <ListChecks/>}<span className="text-sm font-bold">{ar ? 'تنزيل مجاني فوري' : 'Instant free download'}</span></div>
          <h2 className="mt-3 text-2xl font-black">{ar ? activeGift.ar : activeGift.en}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{ar ? 'نستخدم بريدك ورقمك لتسجيل طلب الهدية والتواصل بشأنها. الرسائل التسويقية اختيارية.' : 'We use your email and phone to record this gift request and contact you about it. Marketing messages are optional.'}</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-bold">{ar ? 'البريد الإلكتروني' : 'Email'}<input required type="email" autoComplete="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="name@example.com" dir="ltr" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-950 outline-none focus:border-blue-600"/></label>
            <label className="block text-sm font-bold">{ar ? 'رقم الجوال' : 'Phone'}<input required type="tel" autoComplete="tel" minLength={7} maxLength={30} pattern="[+0-9 ()-]{7,30}" value={phone} onChange={event => setPhone(event.target.value)} placeholder="+966 5x xxx xxxx" dir="ltr" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-950 outline-none focus:border-blue-600"/></label>
            <label className="absolute -left-[10000px]" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
            <label className="flex items-start gap-3 text-sm leading-6 text-slate-700"><input type="checkbox" checked={marketingConsent} onChange={event => setMarketingConsent(event.target.checked)} className="mt-1 h-4 w-4 shrink-0"/><span>{ar ? 'أوافق على تلقي عروض ونصائح DigZoom عبر البريد أو الجوال. يمكنني طلب إيقافها لاحقًا.' : 'I agree to receive DigZoom offers and tips by email or phone. I can opt out later.'}</span></label>
            <p className="text-xs leading-5 text-slate-500">{ar ? 'بالإرسال توافق على استخدام بياناتك لتسليم الهدية وفق ' : 'By submitting, you agree to data use for gift delivery under the '}<Link to="/privacy" className="font-bold text-blue-700 underline">{ar ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>.</p>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {unlocked && <div role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"><div className="flex items-center gap-2 font-bold"><CheckCircle2 size={18}/>{ar ? 'تم حفظ طلبك، بدأ التنزيل.' : 'Your request is saved; download started.'}</div><a href={gifts.find(gift => gift.id === unlocked)!.file} download className="mt-2 inline-block font-bold underline">{ar ? 'اضغط هنا إذا لم يبدأ التنزيل' : 'Click here if the download did not start'}</a></div>}
            <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 font-black text-white hover:bg-blue-800 disabled:opacity-60">{busy ? (ar ? 'جارٍ الحفظ…' : 'Saving…') : <><ArrowDownToLine size={18}/>{ar ? 'احصل على الملف مجانًا' : 'Get the free file'}</>}</button>
          </form>
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><LockKeyhole size={15}/>{ar ? 'لا نبيع بياناتك. للمساعدة: info@digzoom.com' : 'We do not sell your data. Help: info@digzoom.com'}</div>
        </section>
      </div>
    </div>
  </main>;
}
