import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: 'E2nTvuo5qwi7ynE.root',
  password: 'UYmnUuJ6oAUgT8wq',
  database: 'test',
  ssl: { rejectUnauthorized: true },
  connectionLimit: 1,
});

const queries = [
  'CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, unionId VARCHAR(255) NOT NULL UNIQUE, name VARCHAR(255), email VARCHAR(320), avatar TEXT, role ENUM("user","admin") DEFAULT "user" NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, lastSignInAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)',
  'CREATE TABLE IF NOT EXISTS categories (id INT AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(100) NOT NULL UNIQUE, name_ar VARCHAR(255) NOT NULL, name_en VARCHAR(255) NOT NULL, icon VARCHAR(100), color VARCHAR(50), product_count INT DEFAULT 0, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)',
  'CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(255) NOT NULL UNIQUE, title_ar VARCHAR(255) NOT NULL, title_en VARCHAR(255) NOT NULL, description_ar TEXT, description_en TEXT, long_description_ar TEXT, long_description_en TEXT, price DECIMAL(10,2) NOT NULL, original_price DECIMAL(10,2), discount INT DEFAULT 0, image VARCHAR(500), category_id INT, file_type VARCHAR(50), file_size VARCHAR(50), features JSON, rating DECIMAL(3,1) DEFAULT 4.5, review_count INT DEFAULT 0, sales_count INT DEFAULT 0, is_featured BOOLEAN DEFAULT FALSE, is_new BOOLEAN DEFAULT FALSE, in_stock BOOLEAN DEFAULT TRUE, download_url VARCHAR(500), createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)',
  'CREATE TABLE IF NOT EXISTS orders (id INT AUTO_INCREMENT PRIMARY KEY, order_number VARCHAR(50) NOT NULL UNIQUE, user_id INT, customer_name VARCHAR(255) NOT NULL, customer_email VARCHAR(320), customer_phone VARCHAR(50), total DECIMAL(10,2) NOT NULL, status ENUM("pending","processing","completed","cancelled","refunded") DEFAULT "pending" NOT NULL, payment_method VARCHAR(50), payment_status ENUM("pending","paid","failed","refunded") DEFAULT "pending" NOT NULL, notes TEXT, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)',
  'CREATE TABLE IF NOT EXISTS order_items (id INT AUTO_INCREMENT PRIMARY KEY, order_id INT, product_id INT, product_name VARCHAR(255) NOT NULL, quantity INT DEFAULT 1 NOT NULL, price DECIMAL(10,2) NOT NULL, total DECIMAL(10,2) NOT NULL)',
  'CREATE TABLE IF NOT EXISTS page_views (id INT AUTO_INCREMENT PRIMARY KEY, page VARCHAR(255) NOT NULL, session_id VARCHAR(255), user_id INT, ip VARCHAR(100), country VARCHAR(100), city VARCHAR(100), device VARCHAR(50), browser VARCHAR(100), referer VARCHAR(500), createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)',
  'CREATE TABLE IF NOT EXISTS events (id INT AUTO_INCREMENT PRIMARY KEY, event_name VARCHAR(100) NOT NULL, event_data JSON, session_id VARCHAR(255), user_id INT, page VARCHAR(255), createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)',
];

async function init() {
  for (const q of queries) {
    await pool.query(q);
    console.log('Created:', q.substring(0, 50) + '...');
  }
  const [rows] = await pool.query('SHOW TABLES');
  console.log('Total tables:', rows.length);
  await pool.end();
}

init().catch(e => { console.error(e.message); pool.end(); });
