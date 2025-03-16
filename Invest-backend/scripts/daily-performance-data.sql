-- Daily Performance Data for InvestWelth
-- This script adds daily performance data points for the current month (February 2025)

-- Insert daily portfolio values for John Doe (user_id = 1) for February 2025
INSERT INTO portfolio_daily (user_id, value_date, total_value, daily_change_percentage) VALUES
(1, '2025-02-01', 565500.00, 0.09),
(1, '2025-02-02', 565800.00, 0.05),
(1, '2025-02-03', 566200.00, 0.07),
(1, '2025-02-04', 566700.00, 0.09),
(1, '2025-02-05', 567300.00, 0.11),
(1, '2025-02-06', 568000.00, 0.12),
(1, '2025-02-07', 568800.00, 0.14),
(1, '2025-02-08', 569500.00, 0.12),
(1, '2025-02-09', 570000.00, 0.09),
(1, '2025-02-10', 570300.00, 0.05),
(1, '2025-02-11', 570400.00, 0.02),
(1, '2025-02-12', 570300.00, -0.02),
(1, '2025-02-13', 570000.00, -0.05),
(1, '2025-02-14', 569500.00, -0.09),
(1, '2025-02-15', 568800.00, -0.12),
(1, '2025-02-16', 568000.00, -0.14),
(1, '2025-02-17', 567100.00, -0.16),
(1, '2025-02-18', 566200.00, -0.16),
(1, '2025-02-19', 565400.00, -0.14),
(1, '2025-02-20', 564800.00, -0.11),
(1, '2025-02-21', 564500.00, -0.05),
(1, '2025-02-22', 564700.00, 0.04),
(1, '2025-02-23', 565200.00, 0.09),
(1, '2025-02-24', 566000.00, 0.14),
(1, '2025-02-25', 567100.00, 0.19),
(1, '2025-02-26', 568400.00, 0.23),
(1, '2025-02-27', 569800.00, 0.25),
(1, '2025-02-28', 570000.00, 0.04);

-- Insert daily portfolio values for Jane Smith (user_id = 2) for February 2025
INSERT INTO portfolio_daily (user_id, value_date, total_value, daily_change_percentage) VALUES
(2, '2025-02-01', 875800.00, 0.09),
(2, '2025-02-02', 876500.00, 0.08),
(2, '2025-02-03', 877400.00, 0.10),
(2, '2025-02-04', 878500.00, 0.13),
(2, '2025-02-05', 879800.00, 0.15),
(2, '2025-02-06', 881200.00, 0.16),
(2, '2025-02-07', 882700.00, 0.17),
(2, '2025-02-08', 884000.00, 0.15),
(2, '2025-02-09', 885000.00, 0.11),
(2, '2025-02-10', 885700.00, 0.08),
(2, '2025-02-11', 886100.00, 0.05),
(2, '2025-02-12', 886200.00, 0.01),
(2, '2025-02-13', 886000.00, -0.02),
(2, '2025-02-14', 885500.00, -0.06),
(2, '2025-02-15', 884800.00, -0.08),
(2, '2025-02-16', 884000.00, -0.09),
(2, '2025-02-17', 883100.00, -0.10),
(2, '2025-02-18', 882200.00, -0.10),
(2, '2025-02-19', 881400.00, -0.09),
(2, '2025-02-20', 880800.00, -0.07),
(2, '2025-02-21', 880500.00, -0.03),
(2, '2025-02-22', 880700.00, 0.02),
(2, '2025-02-23', 881200.00, 0.06),
(2, '2025-02-24', 882000.00, 0.09),
(2, '2025-02-25', 883100.00, 0.12),
(2, '2025-02-26', 884400.00, 0.15),
(2, '2025-02-27', 884800.00, 0.05),
(2, '2025-02-28', 885000.00, 0.02);

-- Insert daily NAV values for HDFC Top 100 Fund (fund_id = 1) for February 2025
INSERT INTO fund_history (fund_id, value_date, nav, daily_change_percentage) VALUES
(1, '2025-02-01', 612.80, 0.09),
(1, '2025-02-02', 613.40, 0.10),
(1, '2025-02-03', 614.20, 0.13),
(1, '2025-02-04', 615.30, 0.18),
(1, '2025-02-05', 616.70, 0.23),
(1, '2025-02-06', 618.40, 0.28),
(1, '2025-02-07', 620.30, 0.31),
(1, '2025-02-08', 621.80, 0.24),
(1, '2025-02-09', 622.90, 0.18),
(1, '2025-02-10', 623.60, 0.11),
(1, '2025-02-11', 623.90, 0.05),
(1, '2025-02-12', 623.80, -0.02),
(1, '2025-02-13', 623.40, -0.06),
(1, '2025-02-14', 622.70, -0.11),
(1, '2025-02-15', 621.80, -0.14),
(1, '2025-02-16', 620.70, -0.18),
(1, '2025-02-17', 619.50, -0.19),
(1, '2025-02-18', 618.30, -0.19),
(1, '2025-02-19', 617.20, -0.18),
(1, '2025-02-20', 616.40, -0.13),
(1, '2025-02-21', 615.90, -0.08),
(1, '2025-02-22', 615.80, -0.02),
(1, '2025-02-23', 616.10, 0.05),
(1, '2025-02-24', 616.80, 0.11),
(1, '2025-02-25', 617.90, 0.18),
(1, '2025-02-26', 619.40, 0.24),
(1, '2025-02-27', 621.30, 0.31),
(1, '2025-02-28', 623.45, 0.35);

-- Insert daily NAV values for Axis Bluechip Fund (fund_id = 2) for February 2025
INSERT INTO fund_history (fund_id, value_date, nav, daily_change_percentage) VALUES
(2, '2025-02-01', 469.70, 0.10),
(2, '2025-02-02', 470.20, 0.11),
(2, '2025-02-03', 470.80, 0.13),
(2, '2025-02-04', 471.50, 0.15),
(2, '2025-02-05', 472.30, 0.17),
(2, '2025-02-06', 473.20, 0.19),
(2, '2025-02-07', 474.10, 0.19),
(2, '2025-02-08', 474.80, 0.15),
(2, '2025-02-09', 475.30, 0.11),
(2, '2025-02-10', 475.60, 0.06),
(2, '2025-02-11', 475.70, 0.02),
(2, '2025-02-12', 475.60, -0.02),
(2, '2025-02-13', 475.30, -0.06),
(2, '2025-02-14', 474.90, -0.08),
(2, '2025-02-15', 474.40, -0.11),
(2, '2025-02-16', 473.80, -0.13),
(2, '2025-02-17', 473.20, -0.13),
(2, '2025-02-18', 472.60, -0.13),
(2, '2025-02-19', 472.10, -0.11),
(2, '2025-02-20', 471.80, -0.06),
(2, '2025-02-21', 471.70, -0.02),
(2, '2025-02-22', 471.90, 0.04),
(2, '2025-02-23', 472.30, 0.08),
(2, '2025-02-24', 472.90, 0.13),
(2, '2025-02-25', 473.70, 0.17),
(2, '2025-02-26', 474.60, 0.19),
(2, '2025-02-27', 475.20, 0.13),
(2, '2025-02-28', 475.45, 0.05);

-- Insert daily NAV values for SBI Small Cap Fund (fund_id = 3) for February 2025
INSERT INTO fund_history (fund_id, value_date, nav, daily_change_percentage) VALUES
(3, '2025-02-01', 105.60, 0.09),
(3, '2025-02-02', 105.75, 0.14),
(3, '2025-02-03', 105.95, 0.19),
(3, '2025-02-04', 106.20, 0.24),
(3, '2025-02-05', 106.50, 0.28),
(3, '2025-02-06', 106.85, 0.33),
(3, '2025-02-07', 107.20, 0.33),
(3, '2025-02-08', 107.45, 0.23),
(3, '2025-02-09', 107.60, 0.14),
(3, '2025-02-10', 107.65, 0.05),
(3, '2025-02-11', 107.60, -0.05),
(3, '2025-02-12', 107.45, -0.14),
(3, '2025-02-13', 107.25, -0.19),
(3, '2025-02-14', 107.00, -0.23),
(3, '2025-02-15', 106.70, -0.28),
(3, '2025-02-16', 106.40, -0.28),
(3, '2025-02-17', 106.10, -0.28),
(3, '2025-02-18', 105.85, -0.24),
(3, '2025-02-19', 105.65, -0.19),
(3, '2025-02-20', 105.55, -0.09),
(3, '2025-02-21', 105.60, 0.05),
(3, '2025-02-22', 105.75, 0.14),
(3, '2025-02-23', 105.95, 0.19),
(3, '2025-02-24', 106.20, 0.24),
(3, '2025-02-25', 106.50, 0.28),
(3, '2025-02-26', 106.80, 0.28),
(3, '2025-02-27', 107.00, 0.19),
(3, '2025-02-28', 107.10, 0.09);

-- Create a function to get portfolio performance data for a specific user and time range
CREATE OR REPLACE FUNCTION get_portfolio_performance(
    p_user_id bigint,
    p_start_date date,
    p_end_date date,
    p_interval text DEFAULT 'daily' -- 'daily', 'monthly', 'yearly'
)
RETURNS TABLE (
    value_date date,
    total_value numeric(14,2),
    change_percentage numeric(5,2)
) AS $$
BEGIN
    IF p_interval = 'daily' THEN
        -- Return daily data if available, otherwise use monthly data
        RETURN QUERY
        SELECT pd.value_date, pd.total_value, pd.daily_change_percentage
        FROM portfolio_daily pd
        WHERE pd.user_id = p_user_id
        AND pd.value_date BETWEEN p_start_date AND p_end_date
        UNION ALL
        SELECT ph.value_date, ph.total_value, ph.daily_change_percentage
        FROM portfolio_history ph
        WHERE ph.user_id = p_user_id
        AND ph.value_date BETWEEN p_start_date AND p_end_date
        AND NOT EXISTS (
            SELECT 1 FROM portfolio_daily pd
            WHERE pd.user_id = p_user_id
            AND pd.value_date = ph.value_date
        )
        ORDER BY value_date;
    ELSIF p_interval = 'monthly' THEN
        -- Return monthly data
        RETURN QUERY
        SELECT 
            date_trunc('month', ph.value_date)::date as value_date,
            MAX(ph.total_value) as total_value,
            AVG(ph.daily_change_percentage) as change_percentage
        FROM portfolio_history ph
        WHERE ph.user_id = p_user_id
        AND ph.value_date BETWEEN p_start_date AND p_end_date
        GROUP BY date_trunc('month', ph.value_date)
        ORDER BY value_date;
    ELSE -- yearly
        -- Return yearly data
        RETURN QUERY
        SELECT 
            date_trunc('year', ph.value_date)::date as value_date,
            MAX(ph.total_value) as total_value,
            AVG(ph.daily_change_percentage) as change_percentage
        FROM portfolio_history ph
        WHERE ph.user_id = p_user_id
        AND ph.value_date BETWEEN p_start_date AND p_end_date
        GROUP BY date_trunc('year', ph.value_date)
        ORDER BY value_date;
    END IF;
END;
$$ LANGUAGE plpgsql; 