import { createClient } from "@refinedev/supabase";

console.log('import.meta.env.VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL);
console.log('import.meta.env', import.meta.env);
export const supabaseClient = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY, {
    db: {
        schema: "public",
    },
    auth: {
        persistSession: true,
    },
});
