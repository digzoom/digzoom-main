import { useState, useEffect, useCallback, useRef } from 'react';

export interface SmartCoupon {
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  title: string;
  description: string;
  expiryMinutes: number;
  triggered: boolean;
}

const COUPONS: SmartCoupon[] = [
  { code: 'DIGZOOM20', discount: 20, type: 'percent', title: 'خصم 20%', description: 'وفّر 20% على كل المنتجات', expiryMinutes: 30, triggered: false },
  { code: 'FLASH25', discount: 25, type: 'percent', title: 'خصم فلاش 25%', description: 'عرض محدود! وفّر 25% الآن', expiryMinutes: 15, triggered: false },
  { code: 'SAVE50', discount: 50, type: 'fixed', title: 'خصم 50 ر.س', description: 'خصم مباشر 50 ر.س على مشترياتك', expiryMinutes: 20, triggered: false },
  { code: 'MEGA30', discount: 30, type: 'percent', title: 'خصم ميجا 30%', description: 'أكبر خصم! 30% على كل شي', expiryMinutes: 10, triggered: false },
];

export function useSmartCoupons() {
  const [activeCoupon, setActiveCoupon] = useState<SmartCoupon | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [dismissedCoupons, setDismissedCoupons] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('dismissedCoupons') || '[]'); } catch { return []; }
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasShownRef = useRef(false);

  // Show coupon after 60 seconds on page
  useEffect(() => {
    if (hasShownRef.current) return;
    
    const timer = setTimeout(() => {
      triggerRandomCoupon();
    }, 60000); // 60 seconds

    return () => clearTimeout(timer);
  }, []);

  // Exit intent - show coupon when leaving
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !hasShownRef.current) {
        triggerRandomCoupon();
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [dismissedCoupons]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeLeft === 0 && activeCoupon) {
        closePopup();
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          closePopup();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, activeCoupon]);

  const triggerRandomCoupon = useCallback(() => {
    if (hasShownRef.current) return;
    
    const available = COUPONS.filter(c => !dismissedCoupons.includes(c.code));
    if (available.length === 0) return;
    
    const random = available[Math.floor(Math.random() * available.length)];
    setActiveCoupon(random);
    setTimeLeft(random.expiryMinutes * 60);
    setShowPopup(true);
    hasShownRef.current = true;
  }, [dismissedCoupons]);

  const closePopup = useCallback(() => {
    setShowPopup(false);
    if (activeCoupon) {
      const newDismissed = [...dismissedCoupons, activeCoupon.code];
      setDismissedCoupons(newDismissed);
      localStorage.setItem('dismissedCoupons', JSON.stringify(newDismissed));
    }
    setActiveCoupon(null);
    setTimeLeft(0);
  }, [activeCoupon, dismissedCoupons]);

  const applyCoupon = useCallback(() => {
    if (activeCoupon) {
      closePopup();
      return activeCoupon.code;
    }
    return null;
  }, [activeCoupon, closePopup]);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  return {
    activeCoupon,
    showPopup,
    timeLeft,
    formatTime,
    triggerRandomCoupon,
    closePopup,
    applyCoupon,
  };
}

// Abandoned cart / email reminder system
export function useAbandonedCartReminder() {
  const [shouldShowReminder, setShouldShowReminder] = useState(false);

  useEffect(() => {
    const checkReminder = () => {
      const registered = localStorage.getItem('registeredUser');
      const purchased = localStorage.getItem('hasPurchased');
      const reminderSent = localStorage.getItem('reminderSent');
      
      if (registered && !purchased && !reminderSent) {
        // Check if registered more than 1 hour ago
        const regTime = parseInt(localStorage.getItem('registerTime') || '0');
        if (Date.now() - regTime > 3600000) {
          setShouldShowReminder(true);
          localStorage.setItem('reminderSent', 'true');
        }
      }
    };

    const timer = setTimeout(checkReminder, 5000);
    return () => clearTimeout(timer);
  }, []);

  return { shouldShowReminder, setShouldShowReminder };
}
