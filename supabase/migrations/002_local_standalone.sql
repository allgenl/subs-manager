-- Standalone migration for local PostgreSQL (without Supabase Auth)
-- Creates users table that replaces auth.users dependency

-- Skip if auth schema exists (Supabase environment)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN

    -- Users table (standalone, replaces auth.users)
    CREATE TABLE IF NOT EXISTS public.users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text UNIQUE NOT NULL,
      password_hash text NOT NULL,
      display_name text,
      email_confirmed boolean DEFAULT true,
      raw_user_meta_data jsonb DEFAULT '{}',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Profiles (references public.users instead of auth.users)
    CREATE TABLE IF NOT EXISTS public.profiles (
      id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
      display_name text,
      default_currency text NOT NULL DEFAULT 'RUB' CHECK (default_currency IN ('RUB', 'USD', 'EUR')),
      monthly_budget numeric,
      theme text NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Subscriptions
    CREATE TABLE IF NOT EXISTS public.subscriptions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
      name text NOT NULL,
      price numeric NOT NULL CHECK (price > 0),
      currency text NOT NULL DEFAULT 'RUB' CHECK (currency IN ('RUB', 'USD', 'EUR')),
      frequency text NOT NULL CHECK (frequency IN ('monthly', 'yearly', 'weekly', 'custom')),
      custom_frequency_days integer,
      category text NOT NULL DEFAULT 'other',
      next_payment_date date NOT NULL,
      start_date date NOT NULL,
      notes text,
      color text,
      is_active boolean NOT NULL DEFAULT true,
      reminder_days_before integer,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS subscriptions_next_payment_idx ON public.subscriptions(next_payment_date);

    -- Auto-update updated_at
    CREATE OR REPLACE FUNCTION public.update_updated_at()
    RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$;

    CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
    CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

    -- Auto-create profile on user creation
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      INSERT INTO public.profiles (id, display_name)
      VALUES (NEW.id, NEW.display_name);
      RETURN NEW;
    END;
    $$;

    CREATE TRIGGER on_user_created AFTER INSERT ON public.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

    -- Enable pgcrypto for password hashing
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

  END IF;
END $$;
