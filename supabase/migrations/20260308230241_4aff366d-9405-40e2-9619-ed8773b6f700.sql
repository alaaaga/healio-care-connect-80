
-- Add offer_id to bookings so we can track which offer was applied
ALTER TABLE public.bookings ADD COLUMN offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL;

-- Add discount_percentage to offers for calculating actual discounts
ALTER TABLE public.offers ADD COLUMN discount_percentage INTEGER DEFAULT 0;
