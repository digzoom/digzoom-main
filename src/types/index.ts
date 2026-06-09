export interface Product {
  id: number;
  title: string;           // Arabic (default/fallback)
  title_en?: string;       // English
  title_ar?: string;       // Arabic (explicit)
  description: string;     // Arabic (default/fallback)
  description_en?: string; // English
  description_ar?: string; // Arabic (explicit)
  longDescription: string; // Arabic (default/fallback)
  longDescription_en?: string;
  longDescription_ar?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  fileType: string;
  fileSize: string;
  inStock: boolean;
  downloadFile?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count?: number;
}
