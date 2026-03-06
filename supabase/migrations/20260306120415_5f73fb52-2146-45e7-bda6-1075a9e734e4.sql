
-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID NOT NULL,
  diagnosis TEXT NOT NULL DEFAULT '',
  medications JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage prescriptions" ON public.prescriptions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Doctors can manage their prescriptions" ON public.prescriptions
  FOR ALL TO authenticated
  USING (doctor_id IN (SELECT id FROM public.doctors));

CREATE POLICY "Patients can view own prescriptions" ON public.prescriptions
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_prescriptions_updated_at
  BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.prescriptions;
