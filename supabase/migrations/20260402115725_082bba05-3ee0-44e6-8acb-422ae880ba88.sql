
GRANT EXECUTE ON FUNCTION public.validate_coupon(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.redeem_coupon(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_coupon(text, integer) TO anon;
