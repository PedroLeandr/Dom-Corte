-- Seed data for the barbershop application

-- Insert barbers
INSERT INTO barbers (id, name, specialty, image) VALUES
('lima', 'Lima', 'Especialista em cortes clássicos', 'https://i.pravatar.cc/150?img=12'),
('rute', 'Rute', 'Expert em barbas e degradês', 'https://i.pravatar.cc/150?img=36')
ON CONFLICT (id) DO NOTHING;

-- Insert services
INSERT INTO services (id, name, duration, price) VALUES
('corte-basico', 'Corte Básico', 30, 50.00),
('corte-premium', 'Corte Premium', 45, 90.00),
('barba-completa', 'Barba Completa', 30, 60.00),
('combo', 'Combo Corte + Barba', 60, 120.00),
('executive', 'Executive VIP', 90, 150.00)
ON CONFLICT (id) DO NOTHING;

-- Link barbers to services (many-to-many)
INSERT INTO barber_services (barber_id, service_id) VALUES
-- Lima oferece todos os serviços
('lima', 'corte-basico'),
('lima', 'corte-premium'),
('lima', 'barba-completa'),
('lima', 'combo'),
('lima', 'executive'),
-- Rute oferece todos os serviços
('rute', 'corte-basico'),
('rute', 'corte-premium'),
('rute', 'barba-completa'),
('rute', 'combo'),
('rute', 'executive')
ON CONFLICT (barber_id, service_id) DO NOTHING;
