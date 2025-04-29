-- First, ensure RLS is enabled on all tables
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nail_polish ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nail_polish_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nail_polish_finishes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Brands are viewable by everyone" ON public.brands;
DROP POLICY IF EXISTS "Brands are insertable by authenticated users" ON public.brands;
DROP POLICY IF EXISTS "Brands are updatable by authenticated users" ON public.brands;

DROP POLICY IF EXISTS "Colors are viewable by everyone" ON public.colors;
DROP POLICY IF EXISTS "Colors are insertable by authenticated users" ON public.colors;
DROP POLICY IF EXISTS "Colors are updatable by authenticated users" ON public.colors;

DROP POLICY IF EXISTS "Finishes are viewable by everyone" ON public.finishes;
DROP POLICY IF EXISTS "Finishes are insertable by authenticated users" ON public.finishes;
DROP POLICY IF EXISTS "Finishes are updatable by authenticated users" ON public.finishes;

DROP POLICY IF EXISTS "Nail polish is viewable by everyone" ON public.nail_polish;
DROP POLICY IF EXISTS "Nail polish is insertable by authenticated users" ON public.nail_polish;
DROP POLICY IF EXISTS "Nail polish is updatable by authenticated users" ON public.nail_polish;

DROP POLICY IF EXISTS "Nail polish colors are viewable by everyone" ON public.nail_polish_colors;
DROP POLICY IF EXISTS "Nail polish colors are insertable by authenticated users" ON public.nail_polish_colors;

DROP POLICY IF EXISTS "Nail polish finishes are viewable by everyone" ON public.nail_polish_finishes;
DROP POLICY IF EXISTS "Nail polish finishes are insertable by authenticated users" ON public.nail_polish_finishes;

-- Create policies for brands
CREATE POLICY "Brands are viewable by everyone" ON public.brands
  FOR SELECT USING (true);

CREATE POLICY "Brands are insertable by authenticated users" ON public.brands
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Brands are updatable by authenticated users" ON public.brands
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for colors
CREATE POLICY "Colors are viewable by everyone" ON public.colors
  FOR SELECT USING (true);

CREATE POLICY "Colors are insertable by authenticated users" ON public.colors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Colors are updatable by authenticated users" ON public.colors
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for finishes
CREATE POLICY "Finishes are viewable by everyone" ON public.finishes
  FOR SELECT USING (true);

CREATE POLICY "Finishes are insertable by authenticated users" ON public.finishes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Finishes are updatable by authenticated users" ON public.finishes
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for nail_polish
CREATE POLICY "Nail polish is viewable by everyone" ON public.nail_polish
  FOR SELECT USING (true);

CREATE POLICY "Nail polish is insertable by authenticated users" ON public.nail_polish
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Nail polish is updatable by authenticated users" ON public.nail_polish
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for junction tables
CREATE POLICY "Nail polish colors are viewable by everyone" ON public.nail_polish_colors
  FOR SELECT USING (true);

CREATE POLICY "Nail polish colors are insertable by authenticated users" ON public.nail_polish_colors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Nail polish finishes are viewable by everyone" ON public.nail_polish_finishes
  FOR SELECT USING (true);

CREATE POLICY "Nail polish finishes are insertable by authenticated users" ON public.nail_polish_finishes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
