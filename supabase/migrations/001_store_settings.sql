-- ============================================
-- Phase 1: Store Settings
-- ============================================

CREATE TABLE IF NOT EXISTS store_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  group_name VARCHAR(50) NOT NULL,
  label_ar VARCHAR(200) NOT NULL,
  label_en VARCHAR(200) NOT NULL,
  input_type VARCHAR(20) NOT NULL DEFAULT 'text',
  options JSONB DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (settings are public)
CREATE POLICY "Store settings are readable by everyone"
  ON store_settings FOR SELECT USING (true);

-- Only admin can update
CREATE POLICY "Only admin can update store settings"
  ON store_settings FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
      AND is_active = true
    )
  );

-- ============================================
-- Seed: General Settings
-- ============================================

INSERT INTO store_settings (key, value, group_name, label_ar, label_en, input_type, sort_order)
VALUES
  ('store_name',        'DigZoom',         'general',  'اسم المتجر (إنجليزي)', 'Store Name (EN)',     'text',    1),
  ('store_name_ar',     'ديج زوم',         'general',  'اسم المتجر (عربي)',   'Store Name (AR)',     'text',    2),
  ('store_description', 'منصة DigZoom الرقمية لحلول التسويق والنمو الرقمي', 'general', 'وصف المتجر', 'Store Description', 'textarea', 3),
  ('store_email',       'info@digzoom.com', 'general',  'البريد الإلكتروني',   'Email Address',       'text',    4),
  ('store_phone',       '',                 'general',  'رقم الهاتف',           'Phone Number',        'text',    5),
  ('store_whatsapp',    '',                 'general',  'رقم واتساب',           'WhatsApp Number',     'text',    6),
  ('store_address',     '',                 'general',  'العنوان',               'Address',             'textarea', 7)
ON CONFLICT (key) DO NOTHING;

INSERT INTO store_settings (key, value, group_name, label_ar, label_en, input_type, sort_order)
VALUES
  ('currency',           'SAR',   'currency', 'العملة',                'Currency',            'select',  1),
  ('currency_symbol',    'ر.س',   'currency', 'رمز العملة',            'Currency Symbol',     'text',    2)
ON CONFLICT (key) DO NOTHING;

UPDATE store_settings SET options = '["SAR","USD","EUR","AED","KWD"]'
WHERE key = 'currency';

INSERT INTO store_settings (key, value, group_name, label_ar, label_en, input_type, sort_order)
VALUES
  ('default_language',   'ar',    'general',  'اللغة الافتراضية',      'Default Language',    'select',  8),
  ('timezone',           'Asia/Riyadh', 'general', 'المنطقة الزمنية',   'Timezone',            'select',  9)
ON CONFLICT (key) DO NOTHING;

UPDATE store_settings SET options = '["ar","en"]'
WHERE key = 'default_language';

UPDATE store_settings SET options = '["Asia/Riyadh","Asia/Dubai","Asia/Kuwait","Africa/Cairo","UTC"]'
WHERE key = 'timezone';

INSERT INTO store_settings (key, value, group_name, label_ar, label_en, input_type, sort_order)
VALUES
  ('maintenance_mode',   'false', 'status',   'وضع الصيانة',           'Maintenance Mode',    'toggle',  1),
  ('store_status',       'open',  'status',   'حالة المتجر',             'Store Status',        'select',  2),
  ('store_closed_message','المتجر مغلق مؤقتاً، يرجى زيارتنا لاحقاً.', 'status', 'رسالة الإغلاق', 'Closed Message', 'textarea', 3)
ON CONFLICT (key) DO NOTHING;

UPDATE store_settings SET options = '["open","closed"]'
WHERE key = 'store_status';
