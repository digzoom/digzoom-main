import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com', port: 4000,
  user: 'E2nTvuo5qwi7ynE.root', password: 'UYmnUuJ6oAUgT8wq',
  database: 'sys', ssl: { rejectUnauthorized: true }, connectionLimit: 1,
});

const tables = [
  'CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, unionId VARCHAR(255) NOT NULL UNIQUE, name VARCHAR(255), email VARCHAR(320), avatar TEXT, role VARCHAR(10) DEFAULT "user", createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, lastSignInAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS categories (id INT AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(100) NOT NULL UNIQUE, name_ar VARCHAR(255) NOT NULL, name_en VARCHAR(255) NOT NULL, icon VARCHAR(100), color VARCHAR(50), product_count INT DEFAULT 0, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(255) NOT NULL UNIQUE, title_ar VARCHAR(255) NOT NULL, title_en VARCHAR(255) NOT NULL, description_ar TEXT, description_en TEXT, price DECIMAL(10,2) NOT NULL, original_price DECIMAL(10,2), discount INT DEFAULT 0, image VARCHAR(500), category_id INT, file_type VARCHAR(50), file_size VARCHAR(50), features JSON, rating DECIMAL(3,1) DEFAULT 4.5, review_count INT DEFAULT 0, sales_count INT DEFAULT 0, is_featured BOOLEAN DEFAULT FALSE, in_stock BOOLEAN DEFAULT TRUE, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS orders (id INT AUTO_INCREMENT PRIMARY KEY, order_number VARCHAR(50) NOT NULL UNIQUE, user_id INT, customer_name VARCHAR(255) NOT NULL, customer_email VARCHAR(320), customer_phone VARCHAR(50), total DECIMAL(10,2) NOT NULL, status VARCHAR(20) DEFAULT "pending", payment_method VARCHAR(50), payment_status VARCHAR(20) DEFAULT "pending", notes TEXT, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS order_items (id INT AUTO_INCREMENT PRIMARY KEY, order_id INT, product_id INT, product_name VARCHAR(255) NOT NULL, quantity INT DEFAULT 1, price DECIMAL(10,2) NOT NULL, total DECIMAL(10,2) NOT NULL)',
  'CREATE TABLE IF NOT EXISTS page_views (id INT AUTO_INCREMENT PRIMARY KEY, page VARCHAR(255) NOT NULL, session_id VARCHAR(255), user_id INT, ip VARCHAR(100), country VARCHAR(100), city VARCHAR(100), device VARCHAR(50), browser VARCHAR(100), referer VARCHAR(500), createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS events (id INT AUTO_INCREMENT PRIMARY KEY, event_name VARCHAR(100) NOT NULL, event_data JSON, session_id VARCHAR(255), user_id INT, page VARCHAR(255), createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
];

async function setup() {
  for (const q of tables) {
    await pool.query(q);
    console.log('Created:', q.substring(12, 40));
  }

  const cats = [
    ['ebooks','كتب إلكترونية','E-Books','BookOpen','#3b82f6',43],
    ['videos','فيديوهات','Videos','Video','#ef4444',27],
    ['templates','قوالب','Templates','Layout','#8b5cf6',25],
    ['fonts','خطوط','Fonts','Type','#ec4899',25],
    ['graphics','جرافيكس','Graphics','Palette','#f59e0b',33],
    ['3d-models','نماذج 3D','3D Models','Box','#10b981',28],
    ['photos','صور','Photos','Camera','#06b6d4',33],
    ['code','أكواد','Code','Code','#f97316',28],
    ['web-design','تصميم ويب','Web Design','Globe','#6366f1',26],
    ['audio','صوتيات','Audio','Music','#14b8a6',32],
  ];
  for (const c of cats) {
    await pool.query('INSERT IGNORE INTO categories (slug,name_ar,name_en,icon,color,product_count) VALUES (?,?,?,?,?,?)', c);
  }
  console.log('10 categories seeded');

  const prods = [
    ['cinematic-wedding-templates','قوالب فيديو الزفاف السينمائي','Cinematic Wedding Templates','مجموعة احترافية من قوالب فيديو الزفاف','Professional wedding video templates',189,379,50,'/images/products/wedding.jpg',2,'AE, PR','12 GB','["4K","50+ Templates"]',4.9,289,1543],
    ['yoga-meditation-videos','فيديوهات اليوجا والتأمل 4K','Yoga & Meditation 4K','فيديوهات احترافية لليوجا والتأمل','Professional yoga videos',169,339,50,'/images/products/yoga.jpg',2,'MP4','8 GB','["4K","100+ Videos"]',4.8,234,987],
    ['ecommerce-encyclopedia','موسوعة التجارة الإلكترونية','E-Commerce Encyclopedia','دليلك الشامل للتجارة الإلكترونية','Complete e-commerce guide',99,199,50,'/images/products/ecommerce.jpg',1,'PDF','45 MB','["500+ Pages"]',4.9,823,3456],
    ['digital-marketing-guide','دليل التسويق الرقمي 2025','Digital Marketing Guide 2025','أحدث استراتيجيات التسويق الرقمي','Latest digital marketing',79,159,50,'/images/products/marketing.jpg',1,'PDF','32 MB','["2025 Updated"]',4.8,567,2134],
    ['islamic-calligraphy','مجموعة الخط العربي الإسلامي','Islamic Calligraphy Collection','مجموعة فاخرة من الخطوط العربية','Premium Islamic calligraphy',149,299,50,'/images/products/calligraphy.jpg',4,'OTF','250 MB','["50+ Fonts"]',4.9,445,1876],
    ['ai-tools-collection','مجموعة أدوات الذكاء الاصطناعي','AI Tools Collection','أدوات AI للمحترفين','AI tools for professionals',199,399,50,'/images/products/ai-tools.jpg',8,'Various','3 GB','["AI Prompts"]',4.9,678,2345],
  ];
  for (const p of prods) {
    await pool.query('INSERT IGNORE INTO products (slug,title_ar,title_en,description_ar,description_en,price,original_price,discount,image,category_id,file_type,file_size,features,rating,review_count,sales_count,is_featured,in_stock) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,TRUE,TRUE)', p);
  }
  console.log('6 products seeded');

  const [rows] = await pool.query('SHOW TABLES');
  console.log('Total tables:', rows.length);
  await pool.end();
}

setup().catch(e => { console.error(e.message); pool.end(); });
