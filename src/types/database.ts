export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'refunded' | 'cancelled';
export type UserRole = 'user' | 'admin' | 'support';
export type ProductType = 'digital_download' | 'code_delivery' | 'subscription_account' | 'smm_service' | 'manual_service';
export type DeliveryType = 'instant_download' | 'auto_code' | 'account_credentials' | 'api_webhook' | 'manual_delivery';
export type AuditAction = 'product_created' | 'product_updated' | 'product_price_changed' | 'product_stock_changed' | 'product_toggled_stock' | 'product_toggled_active' | 'product_deleted' | 'order_status_changed' | 'order_refunded' | 'coupon_created' | 'coupon_updated' | 'coupon_deleted' | 'user_role_changed' | 'user_blocked';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      user_roles: {
        Row: {
          id: number;
          user_id: string;
          role: UserRole;
          granted_by: string | null;
          granted_at: string;
          revoked_at: string | null;
          is_active: boolean;
        };
        Insert: {
          user_id: string;
          role: UserRole;
          granted_by?: string | null;
          granted_at?: string;
          revoked_at?: string | null;
          is_active?: boolean;
        };
      };
      categories: {
        Row: {
          id: number;
          slug: string;
          name_ar: string;
          name_en: string;
          icon: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: number;
          slug: string;
          title: string;
          description: string;
          long_description: string | null;
          price: number;
          original_price: number | null;
          category_id: number | null;
          product_type: ProductType;
          delivery_type: DeliveryType;
          image_url: string;
          file_type: string;
          file_size: string;
          features: Json;
          rating: number;
          reviews_count: number;
          in_stock: boolean;
          stock_quantity: number | null;
          is_active: boolean;
          is_featured: boolean;
          is_trending: boolean;
          requires_customer_input: boolean;
          customer_input_schema: Json;
          delivery_config: Json;
          download_url: string | null;
          storage_path: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: number };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          status: OrderStatus;
          total_amount: number;
          tax_amount: number;
          subtotal: number;
          discount_amount: number;
          payment_method: string;
          payment_reference: string | null;
          payment_payload: Json;
          paid_at: string | null;
          coupon_id: number | null;
          coupon_code: string | null;
          coupon_discount: number;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          customer_input: Json;
          customer_notes: string | null;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: string;
          product_id: number;
          quantity: number;
          price_at_time: number;
          product_title: string;
          product_type: ProductType;
          delivery_status: string;
          delivered_at: string | null;
          delivery_payload: Json;
          download_count: number;
          max_downloads: number;
          created_at: string;
        };
      };
      coupons: {
        Row: {
          id: number;
          code: string;
          discount_percent: number;
          max_uses: number | null;
          used_count: number;
          valid_from: string;
          valid_until: string | null;
          is_active: boolean;
          is_public: boolean;
          min_order_amount: number;
          applicable_categories: number[];
          created_by: string | null;
          created_at: string;
        };
      };
      order_status_history: {
        Row: {
          id: number;
          order_id: string;
          status: OrderStatus;
          changed_by: string | null;
          reason: string | null;
          created_at: string;
        };
      };
      download_logs: {
        Row: {
          id: number;
          order_item_id: number;
          user_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          downloaded_at: string;
        };
      };
      admin_audit_logs: {
        Row: {
          id: number;
          admin_id: string;
          action: AuditAction;
          entity_type: string;
          entity_id: string;
          old_values: Json;
          new_values: Json;
          reason: string | null;
          ip_address: string | null;
          created_at: string;
        };
      };
    };
  };
}

// Convenience types
export type Product = Database['public']['Tables']['products']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Coupon = Database['public']['Tables']['coupons']['Row'];
export type AdminAuditLog = Database['public']['Tables']['admin_audit_logs']['Row'];
