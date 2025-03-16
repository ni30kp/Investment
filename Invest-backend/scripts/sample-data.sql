-- Sample data for InvestWelth database

-- Insert sample users
INSERT INTO users (username, email, password_hash) VALUES
('john_doe', 'john@example.com', '$2a$10$Xt5KgZ3iQfA6Xo7DL1oOzOIrJ.WR3d5wIQQRxOCUxHQeQY1jG1lSa'),
('jane_smith', 'jane@example.com', '$2a$10$Xt5KgZ3iQfA6Xo7DL1oOzOIrJ.WR3d5wIQQRxOCUxHQeQY1jG1lSa'),
('nitish_kumar', 'nitish@example.com', '$2a$10$Xt5KgZ3iQfA6Xo7DL1oOzOIrJ.WR3d5wIQQRxOCUxHQeQY1jG1lSa');

-- Insert sample mutual funds
INSERT INTO mutual_funds (fund_name, isin, nav, inception_date, fund_type, risk_level) VALUES
('HDFC Top 100 Fund', 'INF179K01BE2', 523.45, '2000-10-11', 'Large Cap', 'Moderate'),
('Axis Bluechip Fund', 'INF846K01131', 412.78, '2009-01-05', 'Large Cap', 'Moderate'),
('SBI Small Cap Fund', 'INF200K01LQ8', 89.67, '2013-09-01', 'Small Cap', 'High'),
('Mirae Asset Emerging Bluechip', 'INF769K01101', 78.34, '2010-07-09', 'Mid Cap', 'High'),
('Parag Parikh Flexi Cap Fund', 'INF879O01019', 45.23, '2013-05-24', 'Flexi Cap', 'Moderate'),
('ICICI Prudential Technology Fund', 'INF109K01BM0', 112.56, '2000-03-29', 'Sectoral', 'Very High');

-- Insert sectors
INSERT INTO sectors (sector_name) VALUES
('Financial Services'),
('Technology'),
('Healthcare'),
('Consumer Goods'),
('Automobile'),
('Energy'),
('Manufacturing'),
('Real Estate'),
('Telecom'),
('Pharma');

-- Insert market caps
INSERT INTO market_caps (market_cap_name) VALUES
('Large Cap'),
('Mid Cap'),
('Small Cap');

-- Insert stocks
INSERT INTO stocks (stock_name, ticker, industry) VALUES
('HDFC Bank', 'HDFCBANK', 'Banking'),
('Infosys', 'INFY', 'IT Services'),
('Reliance Industries', 'RELIANCE', 'Energy'),
('TCS', 'TCS', 'IT Services'),
('ICICI Bank', 'ICICIBANK', 'Banking'),
('Bharti Airtel', 'BHARTIARTL', 'Telecom'),
('Sun Pharma', 'SUNPHARMA', 'Pharma'),
('Maruti Suzuki', 'MARUTI', 'Automobile'),
('Asian Paints', 'ASIANPAINT', 'Consumer Goods'),
('Bajaj Finance', 'BAJFINANCE', 'Financial Services'),
('Titan Company', 'TITAN', 'Consumer Goods'),
('Tata Motors', 'TATAMOTORS', 'Automobile'),
('Wipro', 'WIPRO', 'IT Services'),
('HCL Technologies', 'HCLTECH', 'IT Services'),
('ITC', 'ITC', 'Consumer Goods');

-- Insert fund-sector allocations
INSERT INTO fund_sector_allocations (fund_id, sector_id, allocation_percentage) VALUES
(1, 1, 35.5), -- HDFC Top 100 Fund - Financial Services
(1, 2, 15.2), -- HDFC Top 100 Fund - Technology
(1, 3, 10.8), -- HDFC Top 100 Fund - Healthcare
(1, 4, 12.5), -- HDFC Top 100 Fund - Consumer Goods
(1, 5, 8.7),  -- HDFC Top 100 Fund - Automobile
(1, 6, 17.3), -- HDFC Top 100 Fund - Energy

(2, 1, 32.1), -- Axis Bluechip Fund - Financial Services
(2, 2, 18.7), -- Axis Bluechip Fund - Technology
(2, 3, 12.3), -- Axis Bluechip Fund - Healthcare
(2, 4, 15.6), -- Axis Bluechip Fund - Consumer Goods
(2, 5, 7.8),  -- Axis Bluechip Fund - Automobile
(2, 6, 13.5), -- Axis Bluechip Fund - Energy

(3, 1, 12.3), -- SBI Small Cap Fund - Financial Services
(3, 7, 28.5), -- SBI Small Cap Fund - Manufacturing
(3, 8, 15.7), -- SBI Small Cap Fund - Real Estate
(3, 4, 18.9), -- SBI Small Cap Fund - Consumer Goods
(3, 5, 14.2), -- SBI Small Cap Fund - Automobile
(3, 2, 10.4), -- SBI Small Cap Fund - Technology

(4, 1, 18.7), -- Mirae Asset Emerging Bluechip - Financial Services
(4, 7, 22.3), -- Mirae Asset Emerging Bluechip - Manufacturing
(4, 2, 15.8), -- Mirae Asset Emerging Bluechip - Technology
(4, 4, 16.5), -- Mirae Asset Emerging Bluechip - Consumer Goods
(4, 5, 12.9), -- Mirae Asset Emerging Bluechip - Automobile
(4, 3, 13.8), -- Mirae Asset Emerging Bluechip - Healthcare

(5, 1, 25.6), -- Parag Parikh Flexi Cap Fund - Financial Services
(5, 2, 22.8), -- Parag Parikh Flexi Cap Fund - Technology
(5, 4, 18.5), -- Parag Parikh Flexi Cap Fund - Consumer Goods
(5, 3, 12.7), -- Parag Parikh Flexi Cap Fund - Healthcare
(5, 6, 10.2), -- Parag Parikh Flexi Cap Fund - Energy
(5, 9, 10.2), -- Parag Parikh Flexi Cap Fund - Telecom

(6, 2, 85.3), -- ICICI Prudential Technology Fund - Technology
(6, 9, 8.7),  -- ICICI Prudential Technology Fund - Telecom
(6, 1, 6.0);  -- ICICI Prudential Technology Fund - Financial Services

-- Insert fund-stock allocations
INSERT INTO fund_stock_allocations (fund_id, stock_id, allocation_percentage) VALUES
-- HDFC Top 100 Fund
(1, 1, 12.5), -- HDFC Bank
(1, 3, 10.8), -- Reliance Industries
(1, 5, 8.7),  -- ICICI Bank
(1, 4, 7.5),  -- TCS
(1, 2, 6.8),  -- Infosys

-- Axis Bluechip Fund
(2, 1, 11.2), -- HDFC Bank
(2, 2, 9.8),  -- Infosys
(2, 4, 8.9),  -- TCS
(2, 5, 7.6),  -- ICICI Bank
(2, 10, 6.5), -- Bajaj Finance

-- SBI Small Cap Fund
(3, 12, 8.7), -- Tata Motors
(3, 9, 7.5),  -- Asian Paints
(3, 11, 6.8), -- Titan Company
(3, 7, 5.9),  -- Sun Pharma
(3, 15, 5.2), -- ITC

-- Mirae Asset Emerging Bluechip
(4, 10, 9.8), -- Bajaj Finance
(4, 11, 8.7), -- Titan Company
(4, 9, 7.6),  -- Asian Paints
(4, 13, 6.5), -- Wipro
(4, 8, 5.4),  -- Maruti Suzuki

-- Parag Parikh Flexi Cap Fund
(5, 1, 10.5), -- HDFC Bank
(5, 2, 9.8),  -- Infosys
(5, 3, 8.7),  -- Reliance Industries
(5, 6, 7.6),  -- Bharti Airtel
(5, 9, 6.5),  -- Asian Paints

-- ICICI Prudential Technology Fund
(6, 2, 18.5), -- Infosys
(6, 4, 17.8), -- TCS
(6, 13, 15.6), -- Wipro
(6, 14, 14.5), -- HCL Technologies
(6, 6, 8.7);   -- Bharti Airtel

-- Insert fund-market cap allocations
INSERT INTO fund_market_cap_allocations (fund_id, market_cap_id, allocation_percentage) VALUES
(1, 1, 85.5), -- HDFC Top 100 Fund - Large Cap
(1, 2, 12.3), -- HDFC Top 100 Fund - Mid Cap
(1, 3, 2.2),  -- HDFC Top 100 Fund - Small Cap

(2, 1, 92.7), -- Axis Bluechip Fund - Large Cap
(2, 2, 5.8),  -- Axis Bluechip Fund - Mid Cap
(2, 3, 1.5),  -- Axis Bluechip Fund - Small Cap

(3, 1, 5.5),  -- SBI Small Cap Fund - Large Cap
(3, 2, 15.3), -- SBI Small Cap Fund - Mid Cap
(3, 3, 79.2), -- SBI Small Cap Fund - Small Cap

(4, 1, 35.5), -- Mirae Asset Emerging Bluechip - Large Cap
(4, 2, 55.3), -- Mirae Asset Emerging Bluechip - Mid Cap
(4, 3, 9.2),  -- Mirae Asset Emerging Bluechip - Small Cap

(5, 1, 65.5), -- Parag Parikh Flexi Cap Fund - Large Cap
(5, 2, 25.3), -- Parag Parikh Flexi Cap Fund - Mid Cap
(5, 3, 9.2),  -- Parag Parikh Flexi Cap Fund - Small Cap

(6, 1, 75.5), -- ICICI Prudential Technology Fund - Large Cap
(6, 2, 20.3), -- ICICI Prudential Technology Fund - Mid Cap
(6, 3, 4.2);  -- ICICI Prudential Technology Fund - Small Cap

-- Insert fund overlaps
INSERT INTO fund_overlaps (fund_id_1, fund_id_2, overlap_percentage) VALUES
(1, 2, 68.5), -- HDFC Top 100 Fund vs Axis Bluechip Fund
(1, 3, 12.3), -- HDFC Top 100 Fund vs SBI Small Cap Fund
(1, 4, 35.7), -- HDFC Top 100 Fund vs Mirae Asset Emerging Bluechip
(1, 5, 45.8), -- HDFC Top 100 Fund vs Parag Parikh Flexi Cap Fund
(1, 6, 15.2), -- HDFC Top 100 Fund vs ICICI Prudential Technology Fund

(2, 3, 10.5), -- Axis Bluechip Fund vs SBI Small Cap Fund
(2, 4, 32.8), -- Axis Bluechip Fund vs Mirae Asset Emerging Bluechip
(2, 5, 48.7), -- Axis Bluechip Fund vs Parag Parikh Flexi Cap Fund
(2, 6, 18.9), -- Axis Bluechip Fund vs ICICI Prudential Technology Fund

(3, 4, 28.5), -- SBI Small Cap Fund vs Mirae Asset Emerging Bluechip
(3, 5, 15.7), -- SBI Small Cap Fund vs Parag Parikh Flexi Cap Fund
(3, 6, 5.8),  -- SBI Small Cap Fund vs ICICI Prudential Technology Fund

(4, 5, 35.8), -- Mirae Asset Emerging Bluechip vs Parag Parikh Flexi Cap Fund
(4, 6, 12.5), -- Mirae Asset Emerging Bluechip vs ICICI Prudential Technology Fund

(5, 6, 25.6); -- Parag Parikh Flexi Cap Fund vs ICICI Prudential Technology Fund

-- Insert user investments
INSERT INTO user_investments (user_id, fund_id, investment_date, amount_invested, returns_since_investment) VALUES
-- John Doe's investments
(1, 1, '2022-01-15', 50000.00, 12.5),
(1, 3, '2022-02-20', 25000.00, 8.7),
(1, 5, '2022-03-10', 30000.00, 15.2),

-- Jane Smith's investments
(2, 2, '2022-01-05', 75000.00, 10.8),
(2, 4, '2022-02-15', 40000.00, 7.5),
(2, 6, '2022-03-25', 35000.00, 18.9),

-- Nitish Kumar's investments
(3, 1, '2022-01-10', 60000.00, 11.5),
(3, 2, '2022-02-05', 45000.00, 9.8),
(3, 3, '2022-03-15', 30000.00, 7.5),
(3, 4, '2022-04-10', 35000.00, 12.8),
(3, 5, '2022-05-05', 25000.00, 14.5),
(3, 6, '2022-06-15', 20000.00, 16.7); 