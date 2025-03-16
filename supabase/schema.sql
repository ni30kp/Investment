-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create funds table
CREATE TABLE IF NOT EXISTS funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  amc TEXT NOT NULL,
  nav DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  fund_id UUID REFERENCES funds(id),
  amount DECIMAL(12, 2) NOT NULL,
  units DECIMAL(10, 4) NOT NULL,
  purchase_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio_funds table
CREATE TABLE IF NOT EXISTS portfolio_funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id),
  fund_id UUID REFERENCES funds(id),
  allocation_percentage DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fund_stocks table
CREATE TABLE IF NOT EXISTS fund_stocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID REFERENCES funds(id),
  stock_name TEXT NOT NULL,
  allocation_percentage DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sectors table
CREATE TABLE IF NOT EXISTS sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fund_sectors table
CREATE TABLE IF NOT EXISTS fund_sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID REFERENCES funds(id),
  sector_id UUID REFERENCES sectors(id),
  allocation_percentage DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO users (name, email) VALUES
('Yashna', 'yashna@example.com');

INSERT INTO funds (name, type, amc, nav) VALUES
('Motilal Large Cap Fund - Direct Plan', 'Large Cap', 'Motilal Oswal', 45.67),
('Nippon Large Cap Fund - Direct Plan', 'Large Cap', 'Nippon India', 42.89),
('HDFC Large Cap Fund', 'Large Cap', 'HDFC', 38.45),
('ICICI Prudential Midcap Fund', 'Mid Cap', 'ICICI Prudential', 52.34),
('Axis Flexi Cap Fund', 'Flexi Cap', 'Axis', 48.12);

INSERT INTO sectors (name) VALUES
('Financial'),
('Healthcare'),
('Technology'),
('Consumer Goods'),
('Energy'),
('Others');

-- Create portfolios for the user
INSERT INTO portfolios (user_id, name, description)
SELECT id, 'Main Portfolio', 'Primary investment portfolio'
FROM users
WHERE email = 'yashna@example.com';

-- Add investments for the user
INSERT INTO investments (user_id, fund_id, amount, units, purchase_date)
SELECT u.id, f.id, 100000, 100000 / f.nav, '2025-01-15'
FROM users u, funds f
WHERE u.email = 'yashna@example.com' AND f.name = 'Motilal Large Cap Fund - Direct Plan';

INSERT INTO investments (user_id, fund_id, amount, units, purchase_date)
SELECT u.id, f.id, 100000, 100000 / f.nav, '2025-01-15'
FROM users u, funds f
WHERE u.email = 'yashna@example.com' AND f.name = 'Nippon Large Cap Fund - Direct Plan';

INSERT INTO investments (user_id, fund_id, amount, units, purchase_date)
SELECT u.id, f.id, 100000, 100000 / f.nav, '2025-01-15'
FROM users u, funds f
WHERE u.email = 'yashna@example.com' AND f.name = 'HDFC Large Cap Fund';

INSERT INTO investments (user_id, fund_id, amount, units, purchase_date)
SELECT u.id, f.id, 100000, 100000 / f.nav, '2025-01-15'
FROM users u, funds f
WHERE u.email = 'yashna@example.com' AND f.name = 'ICICI Prudential Midcap Fund';

INSERT INTO investments (user_id, fund_id, amount, units, purchase_date)
SELECT u.id, f.id, 100000, 100000 / f.nav, '2025-01-15'
FROM users u, funds f
WHERE u.email = 'yashna@example.com' AND f.name = 'Axis Flexi Cap Fund'; 