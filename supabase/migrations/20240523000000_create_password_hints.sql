-- Create password_hints table
create table if not exists public.password_hints (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null default auth.uid(),
    site_name text not null,
    hint_type text not null check (hint_type in ('sentence', 'visual')),
    hint_text text not null,
    hint_response_format text, -- Structured Hint (e.g., "Subject + Verb + Amount")
    rule_config jsonb not null default '{}'::jsonb,
    image_url text,
    verification_hash text, -- SHA-256 hash of the generated password
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),

    constraint password_hints_pkey primary key (id),
    constraint password_hints_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

-- Enable Row Level Security
alter table public.password_hints enable row level security;

-- Create policies
create policy "Users can view their own hints"
    on public.password_hints for select
    using (auth.uid() = user_id);

create policy "Users can insert their own hints"
    on public.password_hints for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own hints"
    on public.password_hints for update
    using (auth.uid() = user_id);

create policy "Users can delete their own hints"
    on public.password_hints for delete
    using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists password_hints_user_id_idx on public.password_hints (user_id);
