# Copilot / AI Contributor Instructions

Short, actionable notes to help AI agents be productive in this repository.

## Big picture
- App: Next.js (app/router) web + Capacitor Android wrapper. UI lives under `src/app` and `src/components`.
- Core domain: mnemonic memory creation & storage. Key services under `src/lib` implement a `MemoryService` interface (`src/lib/memory-service.ts`).
- Persistent backend: Supabase is primary persistence and auth (`src/utils/supabase/client.ts`, `src/lib/supabase-memory-service.ts`).
- LLM + image: OpenAI used for story and image generation (`src/lib/openai-story-service.ts`) and is intentionally allowed to run in-browser (`dangerouslyAllowBrowser: true`).

## Where to look first (examples)
- Supabase client and feature flags: `src/utils/supabase/client.ts` — returns `null` when env keys are placeholder; check this when debugging auth/storage.
- Memory API surface: `src/lib/memory-service.ts` (interface) and `src/lib/supabase-memory-service.ts` (implementation). Use these when adding or altering memory read/write behavior.
- Story & image generation: `src/lib/openai-story-service.ts` — contains prompt templates, JSON output expectations and DALL·E prompt refinement.
- Query caching: `src/components/Providers.tsx` — `@tanstack/react-query` with localStorage persister (persisted GC/stale times matter).

## Developer workflows & commands
- Local dev: `pnpm dev` (or `npm run dev`) runs Next.js on :3000.
- Build & Android: run `pnpm build` then `pnpm android:dev` (script in `package.json` that runs a Capacitor sync/open flow).
- Lint: `npm run lint`.

## Important environment variables
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — used by `createClient()` in `src/utils/supabase/client.ts`.
- `NEXT_PUBLIC_OPENAI_API_KEY` — OpenAI key used by `src/lib/openai-story-service.ts` (service will gracefully no-op if missing).

## Project-specific patterns & gotchas
- Memory maps & user overrides: `memory_maps` table supports both global (user_id null) and user-specific rows; queries often use `.or('user_id.is.null,user_id.eq.<id>')` and prefer user rows by ordering.
- Image persistence: `SupabaseMemoryService.uploadImage()` uploads to bucket `memory-images` and returns a public URL; missing bucket will surface a clear error message.
- JSON digit sources: base keyword dictionaries are stored as `digits_2_full.json` and `digits_3_full.json` at repo root — code sometimes falls back to Supabase if those aren't loaded client-side.
- OpenAI usage: functions expect strictly formatted JSON responses (see `generateStory` prompt). When editing prompts, preserve the JSON-only output requirement.

## When changing/thinking about codegen or prompts
- Keep the JSON output contract in `openai-story-service.generateStory()` stable; UI expects {"keywords":[], "story":"..."} exactly.
- If moving OpenAI calls to server-side, update env var usage and remove `dangerouslyAllowBrowser` usage; ensure CORS / SSR behavior is considered.

## Quick links (files to reference)
- `src/lib/memory-service.ts`
- `src/lib/supabase-memory-service.ts`
- `src/utils/supabase/client.ts`
- `src/lib/openai-story-service.ts`
- `src/components/Providers.tsx`
- `digits_2_full.json`, `digits_3_full.json`

If anything here is unclear or you want this file to emphasise other parts of the codebase, tell me which areas to expand. I'll iterate quickly.
