-- Seed sample catalog items for local Supabase
-- Note: seed runs with elevated privileges in local reset, so it can insert even with RLS.

-- Customizable base product (one product with two example images for white/black)
insert into public.products (
  name,
  slug,
  description,
  price,
  images,
  sizes,
  colors,
  in_stock,
  is_customizable
) values (
  'Kaos EUY Basic',
  'kaos-euy-basic',
  'Plain cotton tee. Perfect base for custom prints.',
  150000,
  array['/products/blank-tee-white.svg','/products/blank-tee-black.svg']::text[],
  array['XS','S','M','L','XL','XXL','3XL']::text[],
  '[{"code":"#ffffff","name":"White"},{"code":"#111827","name":"Black"}]'::jsonb,
  true,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  images = excluded.images,
  sizes = excluded.sizes,
  colors = excluded.colors,
  in_stock = excluded.in_stock,
  is_customizable = excluded.is_customizable,
  updated_at = now();

-- Remove older seed-only products if they exist (keeps catalog clean)
delete from public.products
where slug in ('blank-tee-white', 'blank-tee-black');

-- Seed local admin auth user + profile
do $$
declare
  v_admin_email text := 'admin@local.test';
  v_admin_password text := 'Admin1234!';
  v_admin_id uuid;
begin
  select id
  into v_admin_id
  from auth.users
  where email = v_admin_email
  limit 1;

  if v_admin_id is null then
    v_admin_id := gen_random_uuid();

    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_admin_id,
      'authenticated',
      'authenticated',
      v_admin_email,
      crypt(v_admin_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"email_verified":true}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  else
    update auth.users
    set
      encrypted_password = crypt(v_admin_password, gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"provider":"email","providers":["email"]}'::jsonb,
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"email_verified":true}'::jsonb,
      updated_at = now()
    where id = v_admin_id;
  end if;

  insert into auth.identities (
    id,
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    v_admin_id::text,
    v_admin_id,
    jsonb_build_object(
      'sub', v_admin_id::text,
      'email', v_admin_email,
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    now(),
    now(),
    now()
  )
  on conflict (provider_id, provider) do update
  set
    identity_data = excluded.identity_data,
    updated_at = now();

  insert into public.users (id, email, name, is_admin)
  values (v_admin_id, v_admin_email, 'Local Admin', true)
  on conflict (id) do update
  set
    email = excluded.email,
    name = excluded.name,
    is_admin = true,
    updated_at = now();

  update public.users
  set
    is_admin = true,
    updated_at = now()
  where email = v_admin_email;
end
$$;
