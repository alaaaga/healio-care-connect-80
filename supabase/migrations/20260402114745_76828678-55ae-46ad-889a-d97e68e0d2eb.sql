
-- Function to assign queue position automatically when a booking is inserted
CREATE OR REPLACE FUNCTION public.assign_queue_position()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  pos INTEGER;
  avg_wait INTEGER := 15; -- average minutes per patient
BEGIN
  -- Count existing bookings for the same doctor, date, and time
  SELECT COUNT(*) + 1 INTO pos
  FROM public.bookings
  WHERE doctor_id = NEW.doctor_id
    AND booking_date = NEW.booking_date
    AND booking_time = NEW.booking_time
    AND status NOT IN ('cancelled')
    AND id != NEW.id;

  NEW.queue_position := pos;
  
  IF pos > 1 THEN
    NEW.estimated_wait := (pos - 1) * avg_wait || ' دقيقة';
  ELSE
    NEW.estimated_wait := NULL;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger on INSERT
CREATE TRIGGER trg_assign_queue_position
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.assign_queue_position();

-- Function to recalculate queue positions when a booking is cancelled/completed
CREATE OR REPLACE FUNCTION public.recalculate_queue_positions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  avg_wait INTEGER := 15;
  rec RECORD;
  pos INTEGER := 0;
BEGIN
  -- Only recalculate when status changes to cancelled or completed
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('cancelled', 'completed') THEN
    FOR rec IN
      SELECT id
      FROM public.bookings
      WHERE doctor_id = NEW.doctor_id
        AND booking_date = NEW.booking_date
        AND booking_time = NEW.booking_time
        AND status NOT IN ('cancelled', 'completed')
      ORDER BY created_at ASC
    LOOP
      pos := pos + 1;
      UPDATE public.bookings
      SET queue_position = pos,
          estimated_wait = CASE WHEN pos > 1 THEN (pos - 1) * avg_wait || ' دقيقة' ELSE NULL END
      WHERE id = rec.id;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger on UPDATE
CREATE TRIGGER trg_recalculate_queue
AFTER UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.recalculate_queue_positions();
