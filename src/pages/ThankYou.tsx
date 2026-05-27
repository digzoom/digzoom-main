import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle, Download, Home, Package, Clock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { Product } from '@/types';

interface OrderItem {
  product: Product;
  quantity: number;
}

export default function ThankYou() {
  const { lang } = useLanguage();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderDate] = useState(new Date());
  const [orderId] = useState(`DZ${Date.now().toString(36).toUpperCase()}`);

  useEffect(() => {
    // Get order from localStorage
    const saved = localStorage.getItem('lastOrder');
    if (saved) {
      try {
        setOrderItems(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const hasDownloads = orderItems.some(item => item.product.downloadFile);

  const handleDownload = (product: Product) => {
    if (product.downloadFile) {
      const link = document.createElement('a');
      link.href = product.downloadFile;
      link.download = product.downloadFile.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {lang === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
          </h1>
          <p className="text-gray-400 text-lg">
            {lang === 'ar'
              ? 'شكراً لشرائك! ملفاتك جاهزة للتحميل.'
              : 'Thank you for your purchase! Your files are ready for download.'}
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

          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تم إرسال تفاصيل الطلب إلى بريدك الإلكتروني' : 'Order details sent to your email'}</span>
          </div>
        </div>

        {/* Download Section */}
        {hasDownloads && (
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
              {orderItems
                .filter(item => item.product.downloadFile)
                .map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 bg-white/[0.03] rounded-xl p-4 hover:bg-white/[0.05] transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm truncate">{item.product.title}</h3>
                      <p className="text-gray-500 text-xs">{item.product.fileType} · {item.product.fileSize}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(item.product)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      {lang === 'ar' ? 'تحميل' : 'Download'}
                    </button>
                  </div>
                ))}
            </div>

            {/* Download All Button */}
            {orderItems.filter(item => item.product.downloadFile).length > 1 && (
              <button
                onClick={() => {
                  orderItems.forEach((item, i) => {
                    if (item.product.downloadFile) {
                      setTimeout(() => handleDownload(item.product), i * 500);
                    }
                  });
                }}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium px-4 py-3 rounded-xl border border-white/10 transition-all"
              >
                <Download className="w-4 h-4" />
                {lang === 'ar' ? 'تحميل الكل' : 'Download All'}
              </button>
            )}
          </div>
        )}

        {/* Items Without Download */}
        {orderItems.some(item => !item.product.downloadFile) && (
          <div className="bg-[#151520] rounded-2xl border border-white/[0.04] p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-3">
              {lang === 'ar' ? 'منتجات أخرى' : 'Other Products'}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              {lang === 'ar'
                ? 'هذه المنتجات ستتوفر قريباً للتحميل. سنتواصل معك عندما تكون جاهزة.'
                : 'These products will be available for download soon. We will contact you when they are ready.'}
            </p>
            {orderItems
              .filter(item => !item.product.downloadFile)
              .map(item => (
                <div key={item.product.id} className="flex items-center gap-3 text-gray-500 text-sm py-2">
                  <Package className="w-4 h-4" />
                  <span>{item.product.title}</span>
                  <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">
                    {lang === 'ar' ? 'قريباً' : 'Soon'}
                  </span>
                </div>
              ))}
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
