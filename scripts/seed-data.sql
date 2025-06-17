-- Seed data for Premier Auto Dealership (Optional - for demo purposes)

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

-- Insert sample cars for demonstration (optional)
INSERT INTO cars (make, model, year, price, type, mileage, fuel_type, seats, in_stock, featured, selling, description, body_type, condition, doors, cylinders, color, transmission, drive_type) VALUES
('Toyota', 'Camry', 2024, 28500.00, 'sale', '15000', 'Hybrid', 5, true, true, true, 'Reliable and fuel-efficient sedan with advanced safety features', 'Sedan', 'New', 4, 4, 'Silver', 'Automatic', 'FWD'),
('BMW', '3 Series', 2023, 45000.00, 'sale', '8500', 'Gasoline', 5, true, true, false, 'Luxury sports sedan with premium interior and performance', 'Sedan', 'Used', 4, 6, 'Black', 'Automatic', 'RWD'),
('Honda', 'Accord', 2024, 32000.00, 'sale', '5200', 'Gasoline', 5, false, false, true, 'Spacious and comfortable midsize sedan', 'Sedan', 'New', 4, 4, 'White', 'Automatic', 'FWD'),
('Ford', 'F-150', 2023, 38000.00, 'sale', '12000', 'Gasoline', 5, true, false, false, 'America''s best-selling truck with impressive towing capacity', 'Truck', 'Used', 4, 8, 'Blue', 'Automatic', '4WD'),
('Mercedes', 'C-Class', 2024, 52000.00, 'sale', '3000', 'Gasoline', 5, true, true, false, 'Elegant luxury sedan with cutting-edge technology', 'Sedan', 'New', 4, 6, 'Black', 'Automatic', 'RWD');

-- Insert rental cars
INSERT INTO cars (make, model, year, price, type, mileage, fuel_type, seats, in_stock, featured, description, daily_rate, weekly_rate, monthly_rate, body_type, condition, doors, cylinders, color, transmission, drive_type) VALUES
('Honda', 'CR-V', 2024, 85.00, 'rental', '12000', 'Gasoline', 5, true, true, 'Versatile SUV perfect for family trips', 85.00, 552.50, 2125.00, 'SUV', 'New', 4, 4, 'White', 'Automatic', 'AWD'),
('Toyota', 'Prius', 2023, 65.00, 'rental', '18000', 'Hybrid', 5, true, false, 'Eco-friendly hybrid with excellent fuel economy', 65.00, 422.50, 1625.00, 'Sedan', 'Used', 4, 4, 'Silver', 'Automatic', 'FWD'),
('Ford', 'Explorer', 2024, 95.00, 'rental', '8000', 'Gasoline', 7, false, false, 'Spacious 7-seater SUV for larger groups', 95.00, 617.50, 2375.00, 'SUV', 'New', 4, 6, 'Black', 'Automatic', 'AWD'),
('Nissan', 'Altima', 2023, 70.00, 'rental', '15000', 'Gasoline', 5, true, false, 'Comfortable sedan for business travel', 70.00, 455.00, 1750.00, 'Sedan', 'Used', 4, 4, 'Gray', 'Automatic', 'FWD'),
('Jeep', 'Wrangler', 2024, 110.00, 'rental', '5000', 'Gasoline', 4, true, true, 'Adventure-ready off-road vehicle', 110.00, 715.00, 2750.00, 'SUV', 'New', 2, 6, 'Red', 'Manual', '4WD');

-- Insert sample FAQs
INSERT INTO faqs (question, answer, display_order, active) VALUES
('What financing options do you offer?', 'We offer a variety of financing options including traditional auto loans, lease agreements, and special financing for qualified buyers. Our finance team works with multiple lenders to find the best rates and terms for your situation.', 1, true),
('Do you accept trade-ins?', 'Yes, we accept trade-ins on all vehicle purchases. Our experienced appraisers will evaluate your current vehicle and provide you with a fair market value that can be applied toward your new purchase.', 2, true),
('What is included in your vehicle inspection?', 'Every vehicle undergoes a comprehensive 150-point inspection covering engine, transmission, brakes, tires, electrical systems, and more. We also provide a detailed vehicle history report and any necessary reconditioning.', 3, true),
('Do you offer warranties?', 'Yes, we offer extended warranty options on all our vehicles. New vehicles come with manufacturer warranties, and we provide additional coverage options for used vehicles to give you peace of mind.', 4, true),
('What are your rental car requirements?', 'To rent a car, you must be at least 21 years old with a valid driver license and credit card. We require proof of insurance and may perform a credit check. Additional fees may apply for drivers under 25.', 5, true),
('Can I schedule a test drive online?', 'You can schedule a test drive through our website or by calling our sales team. We recommend scheduling in advance to ensure the vehicle you are interested in is available.', 6, true),
('Do you provide vehicle maintenance services?', 'Yes, our certified service department provides comprehensive maintenance and repair services for all makes and models. We use genuine parts and offer competitive pricing on all services.', 7, true),
('What is your return policy?', 'We offer a 7-day return policy on all vehicle purchases. If you are not completely satisfied with your purchase, you can return the vehicle within 7 days for a full refund, subject to certain conditions.', 8, true);

-- Insert sample bookings
INSERT INTO bookings (type, customer_name, customer_email, customer_phone, booking_date, booking_time, purpose, status) VALUES
('meeting', 'John Smith', 'john.smith@email.com', '(555) 234-5678', CURRENT_DATE + INTERVAL '1 day', '14:00:00', 'Vehicle Purchase', 'confirmed'),
('meeting', 'Sarah Johnson', 'sarah.j@email.com', '(555) 345-6789', CURRENT_DATE + INTERVAL '2 days', '10:00:00', 'Financing Options', 'pending'),
('meeting', 'Mike Davis', 'mike.davis@email.com', '(555) 456-7890', CURRENT_DATE + INTERVAL '3 days', '15:30:00', 'Service Inquiry', 'confirmed'),
('rental', 'Emily Wilson', 'emily.w@email.com', '(555) 567-8901', CURRENT_DATE + INTERVAL '5 days', NULL, 'Weekend Trip', 'pending'),
('meeting', 'Robert Brown', 'robert.b@email.com', '(555) 678-9012', CURRENT_DATE + INTERVAL '7 days', '11:00:00', 'Trade-in Evaluation', 'confirmed');
