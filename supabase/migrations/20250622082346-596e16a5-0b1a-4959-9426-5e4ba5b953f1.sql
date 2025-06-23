
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create user_bugs table to store each user's bug collection
CREATE TABLE public.user_bugs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  bug_data jsonb NOT NULL,
  level integer DEFAULT 1 NOT NULL,
  caught_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create game_progress table to track user's game state
CREATE TABLE public.game_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  current_npc_level integer DEFAULT 1 NOT NULL,
  victories integer DEFAULT 0 NOT NULL,
  points integer DEFAULT 0 NOT NULL,
  trophies integer DEFAULT 0 NOT NULL,
  badges integer DEFAULT 0 NOT NULL,
  boss_wins integer DEFAULT 0 NOT NULL,
  upgrades jsonb DEFAULT '{"catchChance": 0, "rareBugLuck": 0, "bugStrength": 0}' NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for user_bugs
CREATE POLICY "Users can view own bugs" ON public.user_bugs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bugs" ON public.user_bugs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bugs" ON public.user_bugs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bugs" ON public.user_bugs
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for game_progress
CREATE POLICY "Users can view own progress" ON public.game_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.game_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.game_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'name', 'Bug Trainer')
  );
  
  INSERT INTO public.game_progress (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
