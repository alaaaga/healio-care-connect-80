-- Coupon helpers (validation + redemption)

-- Ensure coupon codes are unique (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS coupons_code_upper_unique
ON public.coupons (upper(code));

-- Validate coupon without consuming it
CREATE OR REPLACE FUNCTION public.validate_coupon(_code text, _amount integer)
RETURNS TABLE(
  id uuid,
  code text,
  discount_type text,
  discount_value integer,
  min_amount integer,
  max_uses integer,
  used_count integer,
  expires_at timestamptz,
  is_active boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.coupons%ROWTYPE;
BEGIN
  IF _code IS NULL OR btrim(_code) = '' THEN
    RAISE EXCEPTION 'invalid_coupon';
  END IF;

  SELECT *
  INTO c
  FROM public.coupons
  WHERE upper(code) = upper(btrim(_code))
    AND is_active = true
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invalid_coupon';
  END IF;

  IF c.expires_at IS NOT NULL AND c.expires_at <= now() THEN
    RAISE EXCEPTION 'expired_coupon';
  END IF;

  IF c.min_amount IS NOT NULL AND _amount < c.min_amount THEN
    RAISE EXCEPTION 'min_amount';
  END IF;

  IF c.max_uses IS NOT NULL AND c.used_count >= c.max_uses THEN
    RAISE EXCEPTION 'max_uses';
  END IF;

  RETURN QUERY
  SELECT c.id, c.code, c.discount_type, c.discount_value, c.min_amount, c.max_uses, c.used_count, c.expires_at, c.is_active;
END;
$$;

-- Redeem coupon (consume 1 use) and return it
CREATE OR REPLACE FUNCTION public.redeem_coupon(_code text, _amount integer)
RETURNS TABLE(
  id uuid,
  code text,
  discount_type text,
  discount_value integer,
  min_amount integer,
  max_uses integer,
  used_count integer,
  expires_at timestamptz,
  is_active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.coupons%ROWTYPE;
BEGIN
  -- Reuse same validation rules
  SELECT *
  INTO c
  FROM public.validate_coupon(_code, _amount)
  LIMIT 1;

  -- Consume one usage safely
  UPDATE public.coupons
  SET used_count = used_count + 1,
      updated_at = now()
  WHERE id = c.id
    AND (max_uses IS NULL OR used_count < max_uses)
  RETURNING * INTO c;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'max_uses';
  END IF;

  RETURN QUERY
  SELECT c.id, c.code, c.discount_type, c.discount_value, c.min_amount, c.max_uses, c.used_count, c.expires_at, c.is_active;
END;
$$;

-- Permissions
REVOKE ALL ON FUNCTION public.validate_coupon(text, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.redeem_coupon(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_coupon(text, integer) TO authenticated;
