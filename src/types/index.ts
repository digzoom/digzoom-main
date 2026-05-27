export interface Product {
  id: number;
  title: string;
  description: string;
  longDescription: string;
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
