export interface SocialPlatform {
  id: string;
  name: string;
  nameAr: string;
  color: string;
  icon: string;
  services: SocialService[];
}

export interface SocialService {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  unitAr: string;
  icon: string;
  deliveryTime: string;
  deliveryTimeAr: string;
  active: boolean;
}

export const platforms: SocialPlatform[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    nameAr: 'تيك توك',
    color: '#000000',
    icon: 'Video',
    services: [
      { id: 'tt-followers', title: 'Followers', titleAr: 'زيادة متابعين تيك توك', description: 'Real Arab followers for your TikTok account', descriptionAr: 'متابعين عرب حقيقيين لحسابك', price: 15, originalPrice: 30, minQuantity: 100, maxQuantity: 50000, unit: 'followers', unitAr: 'متابع', icon: 'Users', deliveryTime: '1-6 hours', deliveryTimeAr: '1-6 ساعات', active: true },
      { id: 'tt-likes', title: 'Likes', titleAr: 'زيادة لايكات تيك توك', description: 'High-quality likes on your videos', descriptionAr: 'لايكات عالية الجودة على فيديوهاتك', price: 5, originalPrice: 10, minQuantity: 100, maxQuantity: 100000, unit: 'likes', unitAr: 'لايك', icon: 'ThumbsUp', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
      { id: 'tt-views', title: 'Views', titleAr: 'زيادة مشاهدات تيك توك', description: 'Increase views on your TikTok videos', descriptionAr: 'زيادة مشاهدات فيديوهاتك', price: 3, originalPrice: 7, minQuantity: 1000, maxQuantity: 1000000, unit: 'views', unitAr: 'مشاهدة', icon: 'Eye', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
      { id: 'tt-comments', title: 'Comments', titleAr: 'زيادة تعليقات تيك توك', description: 'Custom comments on your videos', descriptionAr: 'تعليقات مخصصة على فيديوهاتك', price: 10, originalPrice: 20, minQuantity: 10, maxQuantity: 5000, unit: 'comments', unitAr: 'تعليق', icon: 'MessageCircle', deliveryTime: '1-12 hours', deliveryTimeAr: '1-12 ساعة', active: true },
      { id: 'tt-shares', title: 'Shares', titleAr: 'زيادة مشاركات تيك توك', description: 'Shares to boost your video reach', descriptionAr: 'مشاركات لزيادة انتشار فيديوهاتك', price: 8, originalPrice: 16, minQuantity: 100, maxQuantity: 50000, unit: 'shares', unitAr: 'مشاركة', icon: 'Share2', deliveryTime: '1-3 hours', deliveryTimeAr: '1-3 ساعات', active: true },
      { id: 'tt-live', title: 'Live Views', titleAr: 'زيادة دعم لايف تيك توك', description: 'Live stream viewers - Arab accounts', descriptionAr: 'مشاهدين بث مباشر - حسابات عربية', price: 20, originalPrice: 40, minQuantity: 50, maxQuantity: 10000, unit: 'viewers', unitAr: 'مشاهد', icon: 'Radio', deliveryTime: '5-10 min', deliveryTimeAr: '5-10 دقائق', active: true },
      { id: 'tt-saves', title: 'Saves', titleAr: 'زيادة حفظ تيك توك', description: 'Video saves to boost algorithm', descriptionAr: 'حفظ فيديوهات لتعزيز الخوارزمية', price: 7, originalPrice: 14, minQuantity: 100, maxQuantity: 50000, unit: 'saves', unitAr: 'حفظ', icon: 'Bookmark', deliveryTime: '1-3 hours', deliveryTimeAr: '1-3 ساعات', active: true },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    nameAr: 'إنستقرام',
    color: '#E4405F',
    icon: 'Instagram',
    services: [
      { id: 'ig-followers', title: 'Followers', titleAr: 'زيادة متابعين إنستقرام', description: 'Real Instagram followers', descriptionAr: 'متابعين إنستقرام حقيقيين', price: 18, originalPrice: 35, minQuantity: 100, maxQuantity: 50000, unit: 'followers', unitAr: 'متابع', icon: 'Users', deliveryTime: '1-12 hours', deliveryTimeAr: '1-12 ساعة', active: true },
      { id: 'ig-likes', title: 'Likes', titleAr: 'زيادة لايكات إنستقرام', description: 'Likes on posts and Reels', descriptionAr: 'لايكات على المنشورات والريلز', price: 6, originalPrice: 12, minQuantity: 100, maxQuantity: 100000, unit: 'likes', unitAr: 'لايك', icon: 'ThumbsUp', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
      { id: 'ig-views', title: 'Views', titleAr: 'زيادة مشاهدات إنستقرام', description: 'Reels and story views', descriptionAr: 'مشاهدات ريلز وستوري', price: 4, originalPrice: 8, minQuantity: 1000, maxQuantity: 1000000, unit: 'views', unitAr: 'مشاهدة', icon: 'Eye', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
      { id: 'ig-comments', title: 'Comments', titleAr: 'زيادة تعليقات إنستقرام', description: 'Custom Arabic comments', descriptionAr: 'تعليقات عربية مخصصة', price: 12, originalPrice: 25, minQuantity: 10, maxQuantity: 5000, unit: 'comments', unitAr: 'تعليق', icon: 'MessageCircle', deliveryTime: '1-6 hours', deliveryTimeAr: '1-6 ساعات', active: true },
      { id: 'ig-story', title: 'Story Views', titleAr: 'زيادة مشاهدات ستوري', description: 'Story views from real accounts', descriptionAr: 'مشاهدات ستوري من حسابات حقيقية', price: 5, originalPrice: 10, minQuantity: 100, maxQuantity: 50000, unit: 'views', unitAr: 'مشاهدة', icon: 'Eye', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
      { id: 'ig-reels', title: 'Reels Likes', titleAr: 'زيادة لايكات ريلز', description: 'Reels likes + views combo', descriptionAr: 'لايكات ريلز + مشاهدات', price: 10, originalPrice: 20, minQuantity: 100, maxQuantity: 50000, unit: 'likes', unitAr: 'لايك', icon: 'ThumbsUp', deliveryTime: '1-3 hours', deliveryTimeAr: '1-3 ساعات', active: true },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    nameAr: 'يوتيوب',
    color: '#FF0000',
    icon: 'Youtube',
    services: [
      { id: 'yt-views', title: 'Views', titleAr: 'زيادة مشاهدات يوتيوب', description: 'High-retention views', descriptionAr: 'مشاهدات بوقت مشاهدة عالي', price: 12, originalPrice: 25, minQuantity: 1000, maxQuantity: 500000, unit: 'views', unitAr: 'مشاهدة', icon: 'Eye', deliveryTime: '1-24 hours', deliveryTimeAr: '1-24 ساعة', active: true },
      { id: 'yt-subscribers', title: 'Subscribers', titleAr: 'زيادة مشتركين يوتيوب', description: 'Real subscribers for your channel', descriptionAr: 'مشتركين حقيقيين لقناتك', price: 35, originalPrice: 70, minQuantity: 100, maxQuantity: 10000, unit: 'subscribers', unitAr: 'مشترك', icon: 'Users', deliveryTime: '1-7 days', deliveryTimeAr: '1-7 أيام', active: true },
      { id: 'yt-likes', title: 'Likes', titleAr: 'زيادة لايكات يوتيوب', description: 'Likes on your videos', descriptionAr: 'لايكات على فيديوهاتك', price: 8, originalPrice: 16, minQuantity: 100, maxQuantity: 50000, unit: 'likes', unitAr: 'لايك', icon: 'ThumbsUp', deliveryTime: '1-6 hours', deliveryTimeAr: '1-6 ساعات', active: true },
      { id: 'yt-comments', title: 'Comments', titleAr: 'زيادة تعليقات يوتيوب', description: 'Custom comments on videos', descriptionAr: 'تعليقات مخصصة على الفيديوهات', price: 15, originalPrice: 30, minQuantity: 10, maxQuantity: 5000, unit: 'comments', unitAr: 'تعليق', icon: 'MessageCircle', deliveryTime: '1-12 hours', deliveryTimeAr: '1-12 ساعة', active: true },
      { id: 'yt-watchtime', title: 'Watch Time', titleAr: 'زيادة ساعات المشاهدة', description: '4000 hours watch time for monetization', descriptionAr: '4000 ساعة مشاهدة للربحية', price: 199, originalPrice: 399, minQuantity: 100, maxQuantity: 4000, unit: 'hours', unitAr: 'ساعة', icon: 'Clock', deliveryTime: '7-30 days', deliveryTimeAr: '7-30 يوم', active: true },
    ],
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    nameAr: 'تويتر',
    color: '#000000',
    icon: 'Twitter',
    services: [
      { id: 'tw-followers', title: 'Followers', titleAr: 'زيادة متابعين تويتر', description: 'Real Twitter followers', descriptionAr: 'متابعين تويتر حقيقيين', price: 20, originalPrice: 40, minQuantity: 100, maxQuantity: 50000, unit: 'followers', unitAr: 'متابع', icon: 'Users', deliveryTime: '1-12 hours', deliveryTimeAr: '1-12 ساعة', active: true },
      { id: 'tw-likes', title: 'Likes', titleAr: 'زيادة لايكات تويتر', description: 'Likes on your tweets', descriptionAr: 'لايكات على تغريداتك', price: 7, originalPrice: 14, minQuantity: 100, maxQuantity: 50000, unit: 'likes', unitAr: 'لايك', icon: 'ThumbsUp', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
      { id: 'tw-retweets', title: 'Retweets', titleAr: 'زيادة ريتويت تويتر', description: 'Retweets to increase reach', descriptionAr: 'ريتويت لزيادة الانتشار', price: 10, originalPrice: 20, minQuantity: 100, maxQuantity: 50000, unit: 'retweets', unitAr: 'ريتويت', icon: 'Repeat', deliveryTime: '1-6 hours', deliveryTimeAr: '1-6 ساعات', active: true },
      { id: 'tw-views', title: 'Views', titleAr: 'زيادة مشاهدات تويتر', description: 'Tweet and video views', descriptionAr: 'مشاهدات تغريدات وفيديوهات', price: 4, originalPrice: 8, minQuantity: 1000, maxQuantity: 1000000, unit: 'views', unitAr: 'مشاهدة', icon: 'Eye', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
    ],
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    nameAr: 'سناب شات',
    color: '#FFFC00',
    icon: 'Ghost',
    services: [
      { id: 'sc-followers', title: 'Followers', titleAr: 'زيادة متابعين سناب شات', description: 'Snapchat followers', descriptionAr: 'متابعين سناب شات', price: 15, originalPrice: 30, minQuantity: 100, maxQuantity: 50000, unit: 'followers', unitAr: 'متابع', icon: 'Users', deliveryTime: '1-12 hours', deliveryTimeAr: '1-12 ساعة', active: true },
      { id: 'sc-story', title: 'Story Views', titleAr: 'زيادة مشاهدات ستوري', description: 'Story views from real accounts', descriptionAr: 'مشاهدات ستوري من حسابات حقيقية', price: 6, originalPrice: 12, minQuantity: 1000, maxQuantity: 100000, unit: 'views', unitAr: 'مشاهدة', icon: 'Eye', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
      { id: 'sc-screenshots', title: 'Screenshots', titleAr: 'زيادة لقطات شاشة', description: 'Screenshots on your story', descriptionAr: 'لقطات شاشة على ستوريك', price: 8, originalPrice: 16, minQuantity: 100, maxQuantity: 10000, unit: 'screenshots', unitAr: 'لقطة', icon: 'Camera', deliveryTime: '1-6 hours', deliveryTimeAr: '1-6 ساعات', active: true },
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    nameAr: 'فيسبوك',
    color: '#1877F2',
    icon: 'Facebook',
    services: [
      { id: 'fb-followers', title: 'Page Followers', titleAr: 'زيادة متابعين صفحة فيسبوك', description: 'Real page followers', descriptionAr: 'متابعين صفحة حقيقيين', price: 18, originalPrice: 35, minQuantity: 100, maxQuantity: 50000, unit: 'followers', unitAr: 'متابع', icon: 'Users', deliveryTime: '1-12 hours', deliveryTimeAr: '1-12 ساعة', active: true },
      { id: 'fb-likes', title: 'Page Likes', titleAr: 'زيادة لايكات صفحة', description: 'Page and post likes', descriptionAr: 'لايكات صفحة ومنشورات', price: 10, originalPrice: 20, minQuantity: 100, maxQuantity: 50000, unit: 'likes', unitAr: 'لايك', icon: 'ThumbsUp', deliveryTime: '1-6 hours', deliveryTimeAr: '1-6 ساعات', active: true },
      { id: 'fb-views', title: 'Video Views', titleAr: 'زيادة مشاهدات فيديو', description: 'Facebook video views', descriptionAr: 'مشاهدات فيديو فيسبوك', price: 6, originalPrice: 12, minQuantity: 1000, maxQuantity: 1000000, unit: 'views', unitAr: 'مشاهدة', icon: 'Eye', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
      { id: 'fb-members', title: 'Group Members', titleAr: 'زيادة أعضاء جروب', description: 'Members for your Facebook group', descriptionAr: 'أعضاء لجروبك على فيسبوك', price: 25, originalPrice: 50, minQuantity: 100, maxQuantity: 50000, unit: 'members', unitAr: 'عضو', icon: 'Users', deliveryTime: '1-3 days', deliveryTimeAr: '1-3 أيام', active: true },
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    nameAr: 'واتساب',
    color: '#25D366',
    icon: 'MessageSquare',
    services: [
      { id: 'wa-channel', title: 'Channel Followers', titleAr: 'زيادة متابعين قناة واتساب', description: 'WhatsApp channel followers', descriptionAr: 'متابعين قناة واتساب', price: 12, originalPrice: 24, minQuantity: 100, maxQuantity: 50000, unit: 'followers', unitAr: 'متابع', icon: 'Users', deliveryTime: '1-12 hours', deliveryTimeAr: '1-12 ساعة', active: true },
      { id: 'wa-reactions', title: 'Reactions', titleAr: 'زيادة تفاعلات واتساب', description: 'Channel post reactions', descriptionAr: 'تفاعلات منشورات القناة', price: 8, originalPrice: 16, minQuantity: 100, maxQuantity: 50000, unit: 'reactions', unitAr: 'تفاعل', icon: 'ThumbsUp', deliveryTime: '1-6 hours', deliveryTimeAr: '1-6 ساعات', active: true },
      { id: 'wa-views', title: 'Status Views', titleAr: 'زيادة مشاهدات حالة واتساب', description: 'Views on your WhatsApp status', descriptionAr: 'مشاهدات على حالتك', price: 5, originalPrice: 10, minQuantity: 100, maxQuantity: 10000, unit: 'views', unitAr: 'مشاهدة', icon: 'Eye', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
      { id: 'wa-group', title: 'Group Members', titleAr: 'زيادة أعضاء جروب واتساب', description: 'Members for your WhatsApp group', descriptionAr: 'أعضاء لجروبك على واتساب', price: 20, originalPrice: 40, minQuantity: 50, maxQuantity: 5000, unit: 'members', unitAr: 'عضو', icon: 'Users', deliveryTime: '1-12 hours', deliveryTimeAr: '1-12 ساعة', active: true },
    ],
  },
  {
    id: 'jaco',
    name: 'Jaco',
    nameAr: 'جاكو',
    color: '#FF6B00',
    icon: 'Radio',
    services: [
      { id: 'jc-live', title: 'Live Support', titleAr: 'زيادة دعم لايف جاكو', description: 'Live stream viewers - Arab accounts', descriptionAr: 'مشاهدين بث مباشر - حسابات عربية', price: 25, originalPrice: 50, minQuantity: 50, maxQuantity: 10000, unit: 'viewers', unitAr: 'مشاهد', icon: 'Radio', deliveryTime: '5-10 min', deliveryTimeAr: '5-10 دقائق', active: true },
      { id: 'jc-followers', title: 'Followers', titleAr: 'زيادة متابعين جاكو', description: 'Real Jaco followers', descriptionAr: 'متابعين جاكو حقيقيين', price: 18, originalPrice: 35, minQuantity: 100, maxQuantity: 50000, unit: 'followers', unitAr: 'متابع', icon: 'Users', deliveryTime: '1-12 hours', deliveryTimeAr: '1-12 ساعة', active: true },
      { id: 'jc-likes', title: 'Likes', titleAr: 'زيادة لايكات جاكو', description: 'Likes on your Jaco content', descriptionAr: 'لايكات على محتواك', price: 7, originalPrice: 14, minQuantity: 100, maxQuantity: 50000, unit: 'likes', unitAr: 'لايك', icon: 'ThumbsUp', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
      { id: 'jc-gifts', title: 'Gifts', titleAr: 'زيادة هدايا جاكو', description: 'Gifts support during live', descriptionAr: 'دعم هدايا أثناء البث', price: 30, originalPrice: 60, minQuantity: 10, maxQuantity: 1000, unit: 'gifts', unitAr: 'هدية', icon: 'Gift', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
    ],
  },
  {
    id: 'telegram',
    name: 'Telegram',
    nameAr: 'تليجرام',
    color: '#0088CC',
    icon: 'Send',
    services: [
      { id: 'tg-members', title: 'Channel/Group Members', titleAr: 'زيادة أعضاء قناة/جروب تليجرام', description: 'Real Telegram members', descriptionAr: 'أعضاء تليجرام حقيقيين', price: 15, originalPrice: 30, minQuantity: 100, maxQuantity: 100000, unit: 'members', unitAr: 'عضو', icon: 'Users', deliveryTime: '1-24 hours', deliveryTimeAr: '1-24 ساعة', active: true },
      { id: 'tg-views', title: 'Post Views', titleAr: 'زيادة مشاهدات تليجرام', description: 'Views on your channel posts', descriptionAr: 'مشاهدات منشورات قناتك', price: 4, originalPrice: 8, minQuantity: 1000, maxQuantity: 1000000, unit: 'views', unitAr: 'مشاهدة', icon: 'Eye', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
      { id: 'tg-reactions', title: 'Reactions', titleAr: 'زيادة تفاعلات تليجرام', description: 'Post reactions', descriptionAr: 'تفاعلات المنشورات', price: 8, originalPrice: 16, minQuantity: 100, maxQuantity: 50000, unit: 'reactions', unitAr: 'تفاعل', icon: 'ThumbsUp', deliveryTime: '1-6 hours', deliveryTimeAr: '1-6 ساعات', active: true },
    ],
  },
  {
    id: 'likee',
    name: 'Likee',
    nameAr: 'لايكي',
    color: '#21D387',
    icon: 'Heart',
    services: [
      { id: 'lk-followers', title: 'Followers', titleAr: 'زيادة متابعين لايكي', description: 'Likee followers', descriptionAr: 'متابعين لايكي', price: 12, originalPrice: 24, minQuantity: 100, maxQuantity: 50000, unit: 'followers', unitAr: 'متابع', icon: 'Users', deliveryTime: '1-12 hours', deliveryTimeAr: '1-12 ساعة', active: true },
      { id: 'lk-likes', title: 'Likes', titleAr: 'زيادة لايكات لايكي', description: 'Likes on your videos', descriptionAr: 'لايكات على فيديوهاتك', price: 5, originalPrice: 10, minQuantity: 100, maxQuantity: 100000, unit: 'likes', unitAr: 'لايك', icon: 'ThumbsUp', deliveryTime: 'Instant', deliveryTimeAr: 'فوري', active: true },
    ],
  },
];

export function getPlatformById(id: string): SocialPlatform | undefined {
  return platforms.find(p => p.id === id);
}

export function getServiceById(platformId: string, serviceId: string): { platform: SocialPlatform; service: SocialService } | undefined {
  const platform = getPlatformById(platformId);
  const service = platform?.services.find(s => s.id === serviceId);
  if (!platform || !service) return undefined;
  return { platform, service };
}

export function getAllActiveServices(): { platform: SocialPlatform; service: SocialService }[] {
  const result: { platform: SocialPlatform; service: SocialService }[] = [];
  for (const platform of platforms) {
    for (const service of platform.services) {
      if (service.active) {
        result.push({ platform, service });
      }
    }
  }
  return result;
}
