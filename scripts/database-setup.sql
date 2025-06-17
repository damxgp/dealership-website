-- Premier Auto Dealership Database Setup
-- Run this script to create the complete database schema

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('sale', 'rental')),
    mileage VARCHAR(20),
    fuel_type VARCHAR(20),
    seats INTEGER,
    in_stock BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    selling BOOLEAN DEFAULT false,
    image_url TEXT,
    images JSONB,
    description TEXT,
    daily_rate DECIMAL(8,2),
    weekly_rate DECIMAL(8,2),
    monthly_rate DECIMAL(8,2),
    available BOOLEAN DEFAULT true,
    body_type VARCHAR(20),
    condition VARCHAR(30),
    engine_size VARCHAR(20),
    doors INTEGER,
    cylinders INTEGER,
    color VARCHAR(30),
    vin VARCHAR(50),
    transmission VARCHAR(20),
    drive_type VARCHAR(10),
    features JSONB,
    payment_options JSONB,
    warranty JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('meeting', 'rental')),
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    booking_date DATE NOT NULL,
    booking_time TIME,
    purpose VARCHAR(100),
    car_id INTEGER REFERENCES cars(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQ table
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_type ON cars(type);
CREATE INDEX IF NOT EXISTS idx_cars_featured ON cars(featured);
CREATE INDEX IF NOT EXISTS idx_cars_in_stock ON cars(in_stock);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(active);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(display_order);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES
('dealership_name', 'Premier Auto'),
('contact_email', 'info@premierauto.com'),
('contact_phone', '(555) 123-4567'),
('address', '123 Auto Street, Car City, CC 12345'),
('rental_enabled', 'true'),
('theme', 'modern'),
('home_layout', 'layout1'),
('business_hours', 'Mon-Fri: 9AM-7PM, Sat: 9AM-6PM, Sun: 11AM-5PM')
ON CONFLICT (setting_key) DO NOTHING;
