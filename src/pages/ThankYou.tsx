import { useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle, Download, Home, Package, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { trpc } from '@/providers/trpc';
import { toast } from 'sonner';

export default function ThankYou() {
  const { lang } = useLanguage();
  const [orderDate] = useState(new Date());
  // Read REAL order ID from localStorage (set by Checkout after createOrder)
  const [orderId] = useState(() => {
    const saved = localStorage.getItem('lastOrderId');
    return saved || '';
  });
  const [orderEmail] = useState(() => localStorage.getItem('lastOrderEmail') || '');
  const downloads = trpc.listOrderDownloads.useQuery(
    { order_id: orderId, email: orderEmail },
    { enabled: Boolean(orderId && orderEmail), retry: false }
  );
  const createLink = trpc.createDownloadLink.useMutation();

  const handleDownload = async (orderItemId: number) => {
    try {
      const result = await createLink.mutateAsync({
        order_id: orderId,
        order_item_id: orderItemId,
        email: orderEmail,
      });
      window.location.assign(result.url);
      void downloads.refetch();
    } catch (error: any) {
      toast.error(error?.message || (lang === 'ar' ? 'تعذر إنشاء رابط التحميل' : 'Unable to create download link'));
    }
  };

  const orderItems = (downloads.data || []) as Array<{
    order_item_id: number; title_ar: string; title_en: string; file_type: string;
    file_size: string; image_url: string; download_count: number; max_downloads: number; available: boolean;
  }>;
  const verified = downloads.isSuccess;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {verified
                ? (lang === 'ar' ? 'تم التحقق من الدفع' : 'Payment verified')
                : (lang === 'ar' ? 'حالة الطلب' : 'Order status')}
          </h1>
          <p className="text-gray-400 text-lg">
            {lang === 'ar'
              ? (verified ? 'شكراً لشرائك! ملفاتك جاهزة للتحميل الآمن.' : 'لم يتم تأكيد الدفع لهذا الطلب بعد.')
              : (verified ? 'Thank you! Your files are ready for secure download.' : 'Payment has not been verified for this order yet.')}
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">{lang === 'ar' ? 'رقم الطلب:' : 'Order ID:'}</span>
              <span className="text-white font-mono font-medium">{orderId}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">{lang === 'ar' ? 'التاريخ:' : 'Date:'}</span>
              <span className="text-white">{orderDate.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
            </div>
          </div>

          {verified ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تم التحقق من الطلب. روابط التحميل مؤقتة ومحمية.' : 'Order verified. Download links are temporary and protected.'}</span>
            </div>
          ) : downloads.isLoading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" />{lang === 'ar' ? 'جاري التحقق من الطلب' : 'Verifying order'}</div>
          ) : (
            <div className="flex items-center gap-2 text-amber-300 text-sm"><Clock className="w-4 h-4" />{lang === 'ar' ? 'لا توجد ملفات متاحة قبل تأكيد الدفع.' : 'No files are available before payment confirmation.'}</div>
          )}
        </div>

        {/* Download Section */}
        {verified && orderItems.length > 0 && (
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-2xl border border-blue-500/20 p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Download className="w-6 h-6 text-blue-400" />
              {lang === 'ar' ? 'تحميل الملفات' : 'Download Files'}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              {lang === 'ar'
                ? 'اضغط على زر التحميل لكل منتج. الملفات متاحة للتحميل فوراً.'
                : 'Click the download button for each product. Files are available for immediate download.'}
            </p>

            <div className="space-y-3">
              {orderItems.map((item) => (
                  <div
                    key={item.order_item_id}
                    className="flex items-center gap-4 bg-white/[0.03] rounded-xl p-4 hover:bg-white/[0.05] transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url || '/logo.png'}
                        alt={lang === 'ar' ? item.title_ar : item.title_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm truncate">{lang === 'ar' ? item.title_ar : item.title_en}</h3>
                      <p className="text-gray-500 text-xs">{item.file_type} · {item.file_size} · {item.download_count}/{item.max_downloads}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(item.order_item_id)}
                      disabled={!item.available || createLink.isPending}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      {lang === 'ar' ? 'تحميل' : 'Download'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
