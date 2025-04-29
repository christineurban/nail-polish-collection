-- Grant usage on the schema to all roles
GRANT USAGE ON SCHEMA public TO anon, postgres, service_role;

-- Grant select permissions on all tables to all roles
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, postgres, service_role;

-- Grant usage on sequences to all roles
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, postgres, service_role;

-- Ensure RLS is enabled on all tables
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nail_polish ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nail_polish_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nail_polish_finishes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.brands;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.colors;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.finishes;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.nail_polish;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.nail_polish_colors;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.nail_polish_finishes;

-- Create policies for viewing data
CREATE POLICY "Enable read access for all users" ON public.brands
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.colors
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.finishes
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.nail_polish
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.nail_polish_colors
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.nail_polish_finishes
  FOR SELECT USING (true);

-- Grant execute permission on all functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, postgres, service_role;
