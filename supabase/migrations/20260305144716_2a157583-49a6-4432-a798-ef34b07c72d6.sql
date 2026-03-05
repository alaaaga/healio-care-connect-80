
-- Enable realtime for bookings and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- Create function to auto-create notification on booking status change
CREATE OR REPLACE FUNCTION public.notify_booking_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  status_label TEXT;
  doctor_name TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT name INTO doctor_name FROM public.doctors WHERE id = NEW.doctor_id;
    
    CASE NEW.status
      WHEN 'confirmed' THEN status_label := 'تم تأكيد';
      WHEN 'completed' THEN status_label := 'تم إكمال';
      WHEN 'cancelled' THEN status_label := 'تم إلغاء';
      ELSE status_label := 'تم تحديث';
    END CASE;
    
    INSERT INTO public.notifications (user_id, message, type)
    VALUES (
      NEW.user_id,
      status_label || ' حجزك مع ' || COALESCE(doctor_name, 'الطبيب') || ' بتاريخ ' || NEW.booking_date,
      CASE NEW.status
        WHEN 'confirmed' THEN 'success'
        WHEN 'cancelled' THEN 'error'
        ELSE 'info'
      END
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_booking_status_change
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_booking_status_change();

-- Create function to notify on new booking
CREATE OR REPLACE FUNCTION public.notify_new_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  doctor_name TEXT;
BEGIN
  SELECT name INTO doctor_name FROM public.doctors WHERE id = NEW.doctor_id;
  
  INSERT INTO public.notifications (user_id, message, type)
  VALUES (
    NEW.user_id,
    'تم حجز موعد جديد مع ' || COALESCE(doctor_name, 'الطبيب') || ' بتاريخ ' || NEW.booking_date || ' وجاري المراجعة',
    'info'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_booking
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_booking();
