
-- Allow doctors to view profiles of their patients (for patient names)
CREATE POLICY "Doctors can view patient profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  user_id IN (
    SELECT b.user_id FROM public.bookings b
    WHERE b.doctor_id IN (
      SELECT d.id FROM public.doctors d WHERE d.user_id = auth.uid()
    )
  )
);
