-- Create mentorship_leads table
CREATE TABLE IF NOT EXISTS public.mentorship_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  instagram TEXT NOT NULL,
  location TEXT NOT NULL,
  family_routine TEXT NOT NULL,
  education TEXT NOT NULL,
  experience TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.mentorship_leads ENABLE ROW LEVEL SECURITY;

-- Policy for anon users to insert
CREATE POLICY "Allow anonymous inserts" ON public.mentorship_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for authenticated users to view and update
CREATE POLICY "Allow authenticated users to view all leads" ON public.mentorship_leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update leads" ON public.mentorship_leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on update
CREATE TRIGGER update_mentorship_leads_updated_at
BEFORE UPDATE ON public.mentorship_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
