-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    tier TEXT CHECK (tier IN ('FREE', 'PRO', 'ENTERPRISE')) DEFAULT 'FREE',
    usage_limit INTEGER DEFAULT 10,
    usage_current INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. System Code Maps (Layered System)
CREATE TABLE IF NOT EXISTS public.system_code_maps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL for System Default
    type TEXT NOT NULL CHECK (type IN ('2D', '3D')),
    code TEXT NOT NULL,
    keywords JSONB, -- Array of strings e.g. ["Ice", "Milk"]
    image_url TEXT,
    description TEXT,
    version TEXT DEFAULT '1.0',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint for Layered Logic
-- A user can have only one override per code. System (NULL) can have only one default per code.
-- We use a partial index for system defaults (NULL user_id) to allow easy ON CONFLICT targets
CREATE UNIQUE INDEX IF NOT EXISTS idx_system_defaults ON public.system_code_maps (type, code) WHERE user_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_overrides ON public.system_code_maps (user_id, type, code) WHERE user_id IS NOT NULL;

-- Composite Index for Fast Lookups
CREATE INDEX idx_maps_lookup ON public.system_code_maps (code, type, user_id);

-- 3. Memory Palaces (The Spaces)
CREATE TABLE IF NOT EXISTS public.memory_palaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL for Templates
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK (difficulty IN ('EASY', 'NORMAL', 'HARD')),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Loci (The Locations within Palaces)
CREATE TABLE IF NOT EXISTS public.loci (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    palace_id UUID REFERENCES public.memory_palaces(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    name TEXT NOT NULL,
    image_url TEXT,
    zone TEXT,
    coordinates JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_loci_palace_order ON public.loci (palace_id, order_index);

-- 5. Memories (The Content)
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT CHECK (category IN ('SECURITY', 'PEOPLE', 'STUDY', 'SPEECH', 'DAILY', 'TRAINING')),
    source_type TEXT CHECK (source_type IN ('AI_GENERATED', 'USER_CREATED', 'COMMUNITY_FORKED')) DEFAULT 'USER_CREATED',
    input_data TEXT, -- Should be encrypted at app level
    encoded_data JSONB, -- The story/image pairs
    image_url TEXT,
    metadata JSONB,
    is_bookmarked BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE, -- For Hall of Fame sharing
    
    -- Link to Memory Palace
    palace_id UUID REFERENCES public.memory_palaces(id) ON DELETE SET NULL,
    locus_id UUID REFERENCES public.loci(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Community Posts (Hall of Fame)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    tags TEXT[],
    original_memory_id UUID REFERENCES public.memories(id) ON DELETE SET NULL,
    palace_id UUID REFERENCES public.memory_palaces(id) ON DELETE SET NULL, -- Can share a palace too
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Social Interactions
CREATE TABLE IF NOT EXISTS public.post_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('LIKE', 'SAVE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, post_id, type)
);


-- ==========================================
-- Row Level Security (RLS) Policies
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_code_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_palaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loci ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. System Code Maps (Layered: System Reads + Owner Reads/Writes)
CREATE POLICY "Read System (NULL) and Own Maps" 
ON public.system_code_maps FOR SELECT 
USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can CRUD own maps" 
ON public.system_code_maps FOR ALL 
USING (user_id = auth.uid());

-- Admin override (Assuming specific admin UUID or claim, strictly simplified here to just user ownership for now. 
-- Real admin policies would check `profiles.is_admin` via a custom function to avoid recursion or use service role key)

-- 3. Memory Palaces
CREATE POLICY "Read Public Templates and Own Palaces" 
ON public.memory_palaces FOR SELECT 
USING (
    (user_id IS NULL) OR -- System Templates
    (is_public = true) OR -- Community Shared
    (user_id = auth.uid()) -- Own
);

CREATE POLICY "Users can CRUD own palaces" 
ON public.memory_palaces FOR ALL 
USING (user_id = auth.uid());

-- 4. Loci (Inherits access from Palace, but standard RLS checks palace ownership for write)
CREATE POLICY "Read Loci of accessible Palaces" 
ON public.loci FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.memory_palaces mp 
        WHERE mp.id = loci.palace_id 
        AND (mp.user_id IS NULL OR mp.is_public = true OR mp.user_id = auth.uid())
    )
);

CREATE POLICY "Users can CRUD loci in own palaces" 
ON public.loci FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.memory_palaces mp 
        WHERE mp.id = loci.palace_id 
        AND mp.user_id = auth.uid()
    )
);

-- 5. Memories (STRICTLY PRIVATE unless shared)
CREATE POLICY "Users can see own memories" 
ON public.memories FOR SELECT 
USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can CRUD own memories" 
ON public.memories FOR ALL 
USING (user_id = auth.uid());

-- 6. Community
CREATE POLICY "Public read community" 
ON public.community_posts FOR SELECT USING (true);

CREATE POLICY "Users create posts" 
ON public.community_posts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own posts" 
ON public.community_posts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own posts" 
ON public.community_posts FOR DELETE 
USING (auth.uid() = user_id);

-- 7. Interactions
CREATE POLICY "Public read interactions" 
ON public.post_interactions FOR SELECT USING (true);

CREATE POLICY "Users manage own interactions" 
ON public.post_interactions FOR ALL 
USING (user_id = auth.uid());


-- ==========================================
-- Trigger for `updated_at` (Optional but good practice)
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_system_maps_modtime BEFORE UPDATE ON public.system_code_maps FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_palaces_modtime BEFORE UPDATE ON public.memory_palaces FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_memories_modtime BEFORE UPDATE ON public.memories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
