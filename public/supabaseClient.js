// Shared Supabase client used across every page.
// Must be loaded AFTER the Supabase CDN script tag and BEFORE any page
// script that uses `db` (authGuard.js, account.js, planner.js).
//
// The anon key below is safe to expose in frontend code — it is not a
// secret. Row Level Security policies on the tasks/profiles tables are
// what actually restrict access, not this key.

const SUPABASE_URL = 'https://nsbdvslcanbdcudseqni.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYmR2c2xjYW5iZGN1ZHNlcW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjIzODYsImV4cCI6MjEwMDE5ODM4Nn0.c0gZVUy9WZD0FBGbpN6FCBIghztSByUpW8fknJVh09g';

// The CDN script exposes a global called `supabase` with `.createClient`.
// We store our client in `db` instead of reusing the name `supabase`,
// so it doesn't collide with that global.
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
