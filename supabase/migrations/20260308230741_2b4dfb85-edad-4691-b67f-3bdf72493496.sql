
-- Add 'doctor' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'doctor';

-- Add user_id to doctors table to link doctor to their user account
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Allow doctors to view their own bookings via RLS
CREATE POLICY "Doctors can view their bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  doctor_id IN (
    SELECT id FROM public.doctors WHERE doctors.user_id = auth.uid()
  )
);
