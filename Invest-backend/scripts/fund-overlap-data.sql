-- Fund Overlap Data SQL Script

-- First, ensure the mutual_funds table exists
CREATE TABLE IF NOT EXISTS mutual_funds (
    fund_id bigint primary key generated always as identity,
    fund_name text NOT NULL,
    fund_type text,
    risk_level text,
    expense_ratio numeric(5,2),
    aum numeric,
    nav numeric(10,2)
);

-- Insert sample mutual funds if they don't exist
INSERT INTO mutual_funds (fund_name, fund_type, risk_level, expense_ratio, aum, nav)
SELECT 'Nippon Large Cap Fund - Direct Plan', 'Large Cap', 'Moderate', 0.54, 15000000000, 125.45
WHERE NOT EXISTS (SELECT 1 FROM mutual_funds WHERE fund_name = 'Nippon Large Cap Fund - Direct Plan');

INSERT INTO mutual_funds (fund_name, fund_type, risk_level, expense_ratio, aum, nav)
SELECT 'Motilal Large Cap Fund - Direct Plan', 'Large Cap', 'Moderate', 0.63, 12000000000, 118.72
WHERE NOT EXISTS (SELECT 1 FROM mutual_funds WHERE fund_name = 'Motilal Large Cap Fund - Direct Plan');

INSERT INTO mutual_funds (fund_name, fund_type, risk_level, expense_ratio, aum, nav)
SELECT 'HDFC Large Cap Fund', 'Large Cap', 'Moderate', 0.59, 18000000000, 132.18
WHERE NOT EXISTS (SELECT 1 FROM mutual_funds WHERE fund_name = 'HDFC Large Cap Fund');

INSERT INTO mutual_funds (fund_name, fund_type, risk_level, expense_ratio, aum, nav)
SELECT 'ICICI Prudential Midcap Fund', 'Mid Cap', 'High', 0.72, 9000000000, 145.63
WHERE NOT EXISTS (SELECT 1 FROM mutual_funds WHERE fund_name = 'ICICI Prudential Midcap Fund');

-- Create a table for fund stocks (holdings)
CREATE TABLE IF NOT EXISTS fund_stocks (
    fund_stock_id bigint primary key generated always as identity,
    fund_id bigint REFERENCES mutual_funds(fund_id),
    stock_name text NOT NULL,
    allocation_percentage numeric(5,2) NOT NULL,
    UNIQUE(fund_id, stock_name)
);

-- Clear existing fund stocks data
DELETE FROM fund_stocks;

-- Insert sample stock holdings for Nippon Large Cap Fund
INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'HDFC LTD.', 9.5 FROM mutual_funds WHERE fund_name = 'Nippon Large Cap Fund - Direct Plan';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'RIL', 8.2 FROM mutual_funds WHERE fund_name = 'Nippon Large Cap Fund - Direct Plan';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'INFY', 7.4 FROM mutual_funds WHERE fund_name = 'Nippon Large Cap Fund - Direct Plan';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'TCS', 6.8 FROM mutual_funds WHERE fund_name = 'Nippon Large Cap Fund - Direct Plan';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'HDFCBANK', 6.2 FROM mutual_funds WHERE fund_name = 'Nippon Large Cap Fund - Direct Plan';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'BHARTIARTL', 5.5 FROM mutual_funds WHERE fund_name = 'Nippon Large Cap Fund - Direct Plan';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'ICICIBANK', 5.1 FROM mutual_funds WHERE fund_name = 'Nippon Large Cap Fund - Direct Plan';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'SBI', 4.8 FROM mutual_funds WHERE fund_name = 'Nippon Large Cap Fund - Direct Plan';

-- Insert sample stock holdings for Motilal Large Cap Fund
INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'HDFC LTD.', 8.7 FROM mutual_funds WHERE fund_name = 'Motilal Large Cap Fund - Direct Plan';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'RIL', 9.3 FROM mutual_funds WHERE fund_name = 'Motilal Large Cap Fund - Direct Plan';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'INFY', 6.9 FROM mutual_funds WHERE fund_name = 'Motilal Large Cap Fund - Direct Plan';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'TCS', 7.2 FROM mutual_funds WHERE fund_name = 'Motilal Large Cap Fund - Direct Plan';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'HDFCBANK', 7.8 FROM mutual_funds WHERE fund_name = 'Motilal Large Cap Fund - Direct Plan';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'BHARTIARTL', 4.9 FROM mutual_funds WHERE fund_name = 'Motilal Large Cap Fund - Direct Plan';

-- Insert sample stock holdings for HDFC Large Cap Fund
INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'HDFC LTD.', 10.2 FROM mutual_funds WHERE fund_name = 'HDFC Large Cap Fund';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'RIL', 7.8 FROM mutual_funds WHERE fund_name = 'HDFC Large Cap Fund';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'INFY', 6.5 FROM mutual_funds WHERE fund_name = 'HDFC Large Cap Fund';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'TCS', 5.9 FROM mutual_funds WHERE fund_name = 'HDFC Large Cap Fund';

-- Insert sample stock holdings for ICICI Prudential Midcap Fund
INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'BHARTIARTL', 6.7 FROM mutual_funds WHERE fund_name = 'ICICI Prudential Midcap Fund';

INSERT INTO fund_stocks (fund_id, stock_name, allocation_percentage)
SELECT fund_id, 'HDFCBANK', 5.4 FROM mutual_funds WHERE fund_name = 'ICICI Prudential Midcap Fund';

-- Create a view to calculate fund overlaps
CREATE OR REPLACE VIEW fund_overlap_view AS
WITH fund_pairs AS (
    SELECT 
        f1.fund_id AS fund_id_1,
        f2.fund_id AS fund_id_2,
        f1.fund_name AS fund_name_1,
        f2.fund_name AS fund_name_2
    FROM 
        mutual_funds f1
    CROSS JOIN 
        mutual_funds f2
    WHERE 
        f1.fund_id < f2.fund_id
),
common_stocks AS (
    SELECT 
        fp.fund_id_1,
        fp.fund_id_2,
        COUNT(DISTINCT s1.stock_name) AS common_stock_count,
        ARRAY_AGG(DISTINCT s1.stock_name) AS common_stock_names
    FROM 
        fund_pairs fp
    JOIN 
        fund_stocks s1 ON fp.fund_id_1 = s1.fund_id
    JOIN 
        fund_stocks s2 ON fp.fund_id_2 = s2.fund_id AND s1.stock_name = s2.stock_name
    GROUP BY 
        fp.fund_id_1, fp.fund_id_2
),
total_stocks AS (
    SELECT 
        fund_id,
        COUNT(DISTINCT stock_name) AS total_stock_count
    FROM 
        fund_stocks
    GROUP BY 
        fund_id
)
SELECT 
    fp.fund_id_1,
    fp.fund_id_2,
    fp.fund_name_1,
    fp.fund_name_2,
    COALESCE(cs.common_stock_count, 0) AS common_stock_count,
    COALESCE(cs.common_stock_names, ARRAY[]::text[]) AS common_stock_names,
    ROUND(
        COALESCE(cs.common_stock_count, 0)::numeric / 
        NULLIF(LEAST(t1.total_stock_count, t2.total_stock_count), 0) * 100, 
        1
    ) AS overlap_percentage
FROM 
    fund_pairs fp
LEFT JOIN 
    common_stocks cs ON fp.fund_id_1 = cs.fund_id_1 AND fp.fund_id_2 = cs.fund_id_2
JOIN 
    total_stocks t1 ON fp.fund_id_1 = t1.fund_id
JOIN 
    total_stocks t2 ON fp.fund_id_2 = t2.fund_id;

-- Create a function to get fund overlap data
CREATE OR REPLACE FUNCTION get_fund_overlap(fund1_id bigint, fund2_id bigint)
RETURNS TABLE (
    fund_id_1 bigint,
    fund_id_2 bigint,
    fund_name_1 text,
    fund_name_2 text,
    common_stock_count integer,
    common_stock_names text[],
    overlap_percentage numeric
) AS $$
BEGIN
    -- Ensure fund1_id is the smaller one for consistent querying
    IF fund1_id > fund2_id THEN
        SELECT fund2_id, fund1_id INTO fund1_id, fund2_id;
    END IF;
    
    RETURN QUERY
    SELECT * FROM fund_overlap_view
    WHERE fund_id_1 = fund1_id AND fund_id_2 = fund2_id;
END;
$$ LANGUAGE plpgsql; 