-- 1. Equipment
CREATE TABLE equipment (
    equipment_id SERIAL PRIMARY KEY,
    equipment_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., EQX1001
    type VARCHAR(50) NOT NULL,                  -- Excavator, Crane, etc.
    site_id INT,                                -- FK to sites table (if assigned)
    status VARCHAR(20) DEFAULT 'idle',          -- idle | rented | maintenance
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Sites
CREATE TABLE sites (
    site_id SERIAL PRIMARY KEY,
    site_code VARCHAR(50) UNIQUE NOT NULL,   -- e.g., S003
    site_name VARCHAR(100),
    location VARCHAR(100),                   -- "City, State" (also store lat/long below)
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6)
);

-- 3. Operators
CREATE TABLE operators (
    operator_id SERIAL PRIMARY KEY,
    operator_code VARCHAR(50) UNIQUE NOT NULL, -- OP101
    name VARCHAR(100),
    company_id INT
);

-- 4. Companies
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    reliability_score INT DEFAULT 100,  -- starts at 100, decreases with delays
    past_delays_count INT DEFAULT 0
);

-- 5. Rentals (transaction log)
CREATE TABLE rentals (
    rental_id SERIAL PRIMARY KEY,
    equipment_id INT REFERENCES equipment(equipment_id),
    site_id INT REFERENCES sites(site_id),
    company_id INT REFERENCES companies(company_id),
    operator_id INT REFERENCES operators(operator_id),
    check_out_date DATE NOT NULL,
    check_in_date DATE,
    expected_return_date DATE NOT NULL,
    engine_hours_per_day NUMERIC(5,2),
    idle_hours_per_day NUMERIC(5,2),
    operating_days INT,
    status VARCHAR(20) DEFAULT 'active', -- active | returned | overdue
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Maintenance
CREATE TABLE maintenance (
    maintenance_id SERIAL PRIMARY KEY,
    equipment_id INT REFERENCES equipment(equipment_id),
    service_date DATE NOT NULL,
    service_type VARCHAR(100),     -- Preventive, Breakdown, Predictive
    issue_reported TEXT,
    downtime_days INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Revenue (optional analytics)
CREATE TABLE revenue (
    revenue_id SERIAL PRIMARY KEY,
    equipment_id INT REFERENCES equipment(equipment_id),
    rental_id INT REFERENCES rentals(rental_id),
    rental_rate NUMERIC(10,2),    -- per day
    total_cost NUMERIC(12,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Weather cache (new)
CREATE TABLE weather_cache (
    id SERIAL PRIMARY KEY,
    site_id INT REFERENCES sites(site_id),
    date DATE NOT NULL,
    temp_c NUMERIC(4,1),
    precipitation_mm NUMERIC(5,1),
    wind_kph NUMERIC(5,1),
    fetched_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(site_id, date)
);

-- 9. Telemetry stream (simulated, for realtime)
CREATE TABLE telemetry (
    id SERIAL PRIMARY KEY,
    equipment_id INT REFERENCES equipment(equipment_id),
    ts TIMESTAMP DEFAULT NOW(),
    engine_rpm INT,
    fuel_rate_lph NUMERIC(6,2),
    gps_lat NUMERIC(9,6),
    gps_lng NUMERIC(9,6),
    is_idle BOOLEAN
);

-- Indexes for better performance
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_rentals_dates ON rentals(check_out_date, expected_return_date);
CREATE INDEX idx_equipment_code ON equipment(equipment_code);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_sites_code ON sites(site_code);
CREATE INDEX idx_weather_site_date ON weather_cache(site_id, date);
CREATE INDEX idx_telemetry_equipment_ts ON telemetry(equipment_id, ts);