-- Fix signup failure: avoid pgcrypto.digest() dependency in referral trigger.
-- md5() is provided by pg_catalog and is available in the function search_path.
CREATE OR REPLACE FUNCTION public.cg_handle_new_referral_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, nombre, role, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    'customer',
    UPPER(SUBSTR(MD5(NEW.id::text), 1, 8))
  )
  ON CONFLICT (id) DO UPDATE
    SET email = COALESCE(public.profiles.email, EXCLUDED.email),
        referral_code = COALESCE(public.profiles.referral_code, EXCLUDED.referral_code);

  RETURN NEW;
END;
$function$;
