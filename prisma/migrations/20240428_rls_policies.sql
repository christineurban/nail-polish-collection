-- Enable Row Level Security
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE finishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nail_polish ENABLE ROW LEVEL SECURITY;
ALTER TABLE nail_polish_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE nail_polish_finishes ENABLE ROW LEVEL SECURITY;

-- Create policies for brands
CREATE POLICY "Brands are viewable by everyone" ON brands
  FOR SELECT USING (true);

CREATE POLICY "Brands are insertable by authenticated users" ON brands
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Brands are updatable by authenticated users" ON brands
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for colors
CREATE POLICY "Colors are viewable by everyone" ON colors
  FOR SELECT USING (true);

CREATE POLICY "Colors are insertable by authenticated users" ON colors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Colors are updatable by authenticated users" ON colors
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for finishes
CREATE POLICY "Finishes are viewable by everyone" ON finishes
  FOR SELECT USING (true);

CREATE POLICY "Finishes are insertable by authenticated users" ON finishes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Finishes are updatable by authenticated users" ON finishes
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for nail_polish
CREATE POLICY "Nail polish is viewable by everyone" ON nail_polish
  FOR SELECT USING (true);

CREATE POLICY "Nail polish is insertable by authenticated users" ON nail_polish
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Nail polish is updatable by authenticated users" ON nail_polish
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for junction tables
CREATE POLICY "Nail polish colors are viewable by everyone" ON nail_polish_colors
  FOR SELECT USING (true);

CREATE POLICY "Nail polish colors are insertable by authenticated users" ON nail_polish_colors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Nail polish finishes are viewable by everyone" ON nail_polish_finishes
  FOR SELECT USING (true);

CREATE POLICY "Nail polish finishes are insertable by authenticated users" ON nail_polish_finishes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
