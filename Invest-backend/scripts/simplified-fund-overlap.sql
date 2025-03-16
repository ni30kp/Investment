-- Simplified Fund Overlap SQL Script for Supabase Dashboard

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
    -- Return sample data for demonstration
    RETURN QUERY
    SELECT 
        fund1_id AS fund_id_1,
        fund2_id AS fund_id_2,
        (SELECT fund_name FROM mutual_funds WHERE fund_id = fund1_id) AS fund_name_1,
        (SELECT fund_name FROM mutual_funds WHERE fund_id = fund2_id) AS fund_name_2,
        12::integer AS common_stock_count,
        ARRAY['HDFC LTD.', 'RIL', 'INFY', 'TCS', 'HDFCBANK', 'BHARTIARTL']::text[] AS common_stock_names,
        65.8::numeric AS overlap_percentage;
END;
$$ LANGUAGE plpgsql; 