-- ============================================================
-- CRICSPHERE - CRICKET SPORTS DATABASE SCHEMA FOR SUPABASE
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mdgyqpfgirmbdgjvulif/sql/new
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(10) NOT NULL,
    logo_url TEXT,
    captain VARCHAR(100),
    coach VARCHAR(100),
    home_ground VARCHAR(150),
    trophies INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- Batsman, Bowler, All-Rounder, Wicket-Keeper
    batting_style VARCHAR(50), -- Right-hand bat, Left-hand bat
    bowling_style VARCHAR(50), -- Right-arm fast, Left-arm orthodox, etc.
    jersey_number INT,
    matches_played INT DEFAULT 0,
    runs INT DEFAULT 0,
    wickets INT DEFAULT 0,
    highest_score VARCHAR(20) DEFAULT '0',
    strike_rate NUMERIC(6, 2) DEFAULT 0.00,
    batting_average NUMERIC(6, 2) DEFAULT 0.00,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    tournament VARCHAR(100) DEFAULT 'Premier Cricket League',
    format VARCHAR(20) DEFAULT 'T20', -- T20, ODI, Test
    team1_name VARCHAR(100) NOT NULL,
    team1_short VARCHAR(10) NOT NULL,
    team1_logo TEXT,
    team1_score VARCHAR(50) DEFAULT '0/0',
    team1_overs VARCHAR(20) DEFAULT '0.0',
    team2_name VARCHAR(100) NOT NULL,
    team2_short VARCHAR(10) NOT NULL,
    team2_logo TEXT,
    team2_score VARCHAR(50) DEFAULT '0/0',
    team2_overs VARCHAR(20) DEFAULT '0.0',
    status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, live, completed
    venue VARCHAR(150),
    match_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    result_summary TEXT,
    current_batting_team VARCHAR(100),
    current_batsman VARCHAR(100),
    current_bowler VARCHAR(100),
    crr NUMERIC(4, 2) DEFAULT 0.00,
    rrr NUMERIC(4, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PRODUCTS TABLE (CRICKET GEAR & MERCHANDISE)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Bats, Balls, Protective, Apparel, Footwear
    price NUMERIC(10, 2) NOT NULL,
    discount_price NUMERIC(10, 2),
    stock INT DEFAULT 10,
    rating NUMERIC(3, 1) DEFAULT 4.8,
    image_url TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. INQUIRIES & CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    subject VARCHAR(150),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new', -- new, contacted, resolved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    delivery_address TEXT NOT NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Cash on Delivery',
    status VARCHAR(30) DEFAULT 'pending', -- pending, confirmed, shipped, delivered
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & SET PERMISSIVE POLICIES
-- ============================================================

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for anon role (client app & admin)
DROP POLICY IF EXISTS "Public access on teams" ON public.teams;
CREATE POLICY "Public access on teams" ON public.teams FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on players" ON public.players;
CREATE POLICY "Public access on players" ON public.players FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on matches" ON public.matches;
CREATE POLICY "Public access on matches" ON public.matches FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on products" ON public.products;
CREATE POLICY "Public access on products" ON public.products FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on inquiries" ON public.inquiries;
CREATE POLICY "Public access on inquiries" ON public.inquiries FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on orders" ON public.orders;
CREATE POLICY "Public access on orders" ON public.orders FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- SEED INITIAL CRICKET DATA
-- ============================================================

-- Teams
INSERT INTO public.teams (id, name, short_name, logo_url, captain, coach, home_ground, trophies) VALUES
('b1010000-0000-0000-0000-000000000001', 'Royal Strikers', 'RS', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200&auto=format&fit=crop&q=80', 'Virat Sharma', 'Ricky Ponting', 'Royal Eden Gardens', 3),
('b1010000-0000-0000-0000-000000000002', 'Thunder Titans', 'TT', 'https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=200&auto=format&fit=crop&q=80', 'Rohit Khan', 'Brendon McCullum', 'Thunder Dome Stadium', 4),
('b1010000-0000-0000-0000-000000000003', 'Desert Warriors', 'DW', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80', 'Babar Azam', 'Gary Kirsten', 'Oasis International Arena', 2),
('b1010000-0000-0000-0000-000000000004', 'Falcon Kings', 'FK', 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=200&auto=format&fit=crop&q=80', 'Ben Stokes', 'Trevor Bayliss', 'Highland Cricket Ground', 1)
ON CONFLICT (id) DO NOTHING;

-- Players
INSERT INTO public.players (name, role, batting_style, bowling_style, jersey_number, matches_played, runs, wickets, highest_score, strike_rate, batting_average, photo_url) VALUES
('Virat Sharma', 'Batsman', 'Right-hand bat', 'Right-arm medium', 18, 142, 6240, 4, '122*', 144.50, 52.80, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'),
('Rohit Khan', 'Batsman', 'Right-hand bat', 'Right-arm offbreak', 45, 138, 5490, 8, '118', 139.80, 44.20, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'),
('Shaheen Afridi', 'Bowler', 'Left-hand bat', 'Left-arm fast', 10, 88, 420, 168, '34*', 122.00, 15.50, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'),
('Ben Stokes', 'All-Rounder', 'Left-hand bat', 'Right-arm fast-medium', 55, 110, 3850, 112, '135*', 142.10, 39.40, 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80'),
('Rashid Khan', 'Bowler', 'Right-hand bat', 'Right-arm legbreak', 19, 115, 890, 185, '44', 154.20, 18.20, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'),
('Jos Buttler', 'Wicket-Keeper', 'Right-hand bat', 'None', 63, 126, 4480, 0, '124', 151.70, 43.10, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'),
('Jasprit Bumrah', 'Bowler', 'Right-hand bat', 'Right-arm fast', 93, 98, 210, 174, '16*', 98.40, 9.80, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'),
('Babar Azam', 'Batsman', 'Right-hand bat', 'Right-arm offbreak', 56, 120, 5100, 0, '122', 133.50, 48.60, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80')
ON CONFLICT DO NOTHING;

-- Matches
INSERT INTO public.matches (title, tournament, format, team1_name, team1_short, team1_logo, team1_score, team1_overs, team2_name, team2_short, team2_logo, team2_score, team2_overs, status, venue, result_summary, current_batting_team, current_batsman, current_bowler, crr, rrr) VALUES
('PCL Semi-Final 1', 'Premier Cricket League', 'T20', 'Royal Strikers', 'RS', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200&auto=format&fit=crop&q=80', '186/4', '17.2', 'Thunder Titans', 'TT', 'https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=200&auto=format&fit=crop&q=80', '178/7', '20.0', 'live', 'Royal Eden Gardens, Kolkata', 'Royal Strikers need 9 runs in 16 balls', 'Royal Strikers', 'Virat Sharma (78* off 46)', 'Shaheen Afridi (2/34)', 10.73, 3.38),
('Champions Trophy Clash', 'Global T20 Trophy', 'T20', 'Desert Warriors', 'DW', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80', '0/0', '0.0', 'Falcon Kings', 'FK', 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=200&auto=format&fit=crop&q=80', '0/0', '0.0', 'upcoming', 'Oasis International Arena, Dubai', 'Match starts at 07:30 PM Local Time', '', '', '', 0.0, 0.0),
('Super League Match 22', 'Premier Cricket League', 'T20', 'Thunder Titans', 'TT', 'https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=200&auto=format&fit=crop&q=80', '214/5', '20.0', 'Desert Warriors', 'DW', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80', '192/9', '20.0', 'completed', 'Thunder Dome Stadium', 'Thunder Titans won by 22 runs', '', '', '', 10.70, 0.0)
ON CONFLICT DO NOTHING;

-- Products
INSERT INTO public.products (name, category, price, discount_price, stock, rating, image_url, description, is_featured) VALUES
('Pro English Willow Bat - Grade 1 Elite', 'Bats', 299.99, 249.99, 15, 4.9, 'https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=500&auto=format&fit=crop&q=80', 'Handcrafted from hand-selected Grade 1 English Willow. Huge sweet spot, exceptional pickup and ping.', true),
('Match Grade Leather Cricket Balls (Pack of 6)', 'Balls', 89.99, 74.99, 45, 4.8, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80', 'Official 4-piece alum tanned leather balls. Prominent seam, long-lasting shape retention and swing.', true),
('Pro-Shield Titanium Batting Helmet', 'Protective', 129.99, 109.99, 20, 4.9, 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=500&auto=format&fit=crop&q=80', 'High-impact outer shell with titanium grille and air-flow cooling technology. Compliant with ICC safety standards.', true),
('Ultra-Light Professional Batting Legguards', 'Protective', 119.99, 94.99, 18, 4.7, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80', 'High-density contoured foam with 3-piece knee roll for maximum protection and flexibility.', true),
('Official Pro League Team Jersey (Dry-Fit)', 'Apparel', 59.99, 49.99, 60, 4.8, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=80', 'Breathable moisture-wicking aerodynamic athletic fabric with premium sublimated franchise print.', true),
('All-Rounder Cricket Spikes Performance Shoes', 'Footwear', 139.99, 119.99, 25, 4.9, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80', 'Reinforced toe-box, shock-absorbing EVA midsole, and interchangeable metal and rubber spikes.', true),
('Elite Players Wheelie Cricket Kitbag', 'Protective', 149.99, 129.99, 12, 4.8, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80', 'Heavy-duty 1680D nylon with dedicated padded bat compartments, shoe tunnel, and heavy-duty wheels.', false),
('Pro Leather Batting Gloves - Shark Tooth Cut', 'Protective', 69.99, 54.99, 32, 4.9, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80', 'Sheepskin leather palm, fibre insert shield on lead fingers for impact dissipation and supreme grip.', false)
ON CONFLICT DO NOTHING;
