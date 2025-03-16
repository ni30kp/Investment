-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id bigint primary key generated always as identity,
    username text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT NOW()
) WITH (OIDS=FALSE);

-- Mutual Funds Table
CREATE TABLE IF NOT EXISTS mutual_funds (
    fund_id bigint primary key generated always as identity,
    fund_name text NOT NULL,
    isin text UNIQUE NOT NULL,
    nav numeric(10,2) DEFAULT 100.00,
    inception_date timestamp with time zone,
    fund_type text,
    risk_level text
) WITH (OIDS=FALSE);

-- User Investments Table
CREATE TABLE IF NOT EXISTS user_investments (
    investment_id bigint primary key generated always as identity,
    user_id bigint REFERENCES users(user_id),
    fund_id bigint REFERENCES mutual_funds(fund_id),
    investment_date timestamp with time zone NOT NULL,
    amount_invested numeric(14,2) NOT NULL,
    returns_since_investment numeric(5,2) DEFAULT 0
) WITH (OIDS=FALSE);

-- Sectors Table
CREATE TABLE IF NOT EXISTS sectors (
    sector_id bigint primary key generated always as identity,
    sector_name text NOT NULL
) WITH (OIDS=FALSE);

-- Fund-Sector Allocations Table
CREATE TABLE IF NOT EXISTS fund_sector_allocations (
    fund_id bigint REFERENCES mutual_funds(fund_id),
    sector_id bigint REFERENCES sectors(sector_id),
    allocation_percentage numeric(5,2) NOT NULL,
    PRIMARY KEY(fund_id, sector_id)
) WITH (OIDS=FALSE);

-- Stocks Table
CREATE TABLE IF NOT EXISTS stocks (
    stock_id bigint primary key generated always as identity,
    stock_name text NOT NULL,
    ticker text,
    industry text
) WITH (OIDS=FALSE);

-- Fund-Stock Allocations Table
CREATE TABLE IF NOT EXISTS fund_stock_allocations (
    fund_id bigint REFERENCES mutual_funds(fund_id),
    stock_id bigint REFERENCES stocks(stock_id),
    allocation_percentage numeric(5,2) NOT NULL,
    PRIMARY KEY(fund_id, stock_id)
) WITH (OIDS=FALSE);

-- Market Cap Table
CREATE TABLE IF NOT EXISTS market_caps (
    market_cap_id bigint primary key generated always as identity,
    market_cap_name text NOT NULL
) WITH (OIDS=FALSE);

-- Fund-MarketCap Allocations Table
CREATE TABLE IF NOT EXISTS fund_market_cap_allocations (
    fund_id bigint REFERENCES mutual_funds(fund_id),
    market_cap_id bigint REFERENCES market_caps(market_cap_id),
    allocation_percentage numeric(5,2) NOT NULL,
    PRIMARY KEY(fund_id, market_cap_id)
) WITH (OIDS=FALSE);

-- Fund Overlaps Table
CREATE TABLE IF NOT EXISTS fund_overlaps (
    overlap_id bigint primary key generated always as identity,
    fund_id_1 bigint REFERENCES mutual_funds(fund_id),
    fund_id_2 bigint REFERENCES mutual_funds(fund_id),
    overlap_percentage numeric(5,2) NOT NULL,
    UNIQUE(fund_id_1, fund_id_2)
) WITH (OIDS=FALSE); 