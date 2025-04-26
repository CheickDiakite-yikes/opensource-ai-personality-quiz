
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.5';
import { corsHeaders } from './cors.ts';

// Create a single supabase client for interacting with your database
export const createSupabaseClient = (req: Request) => {
  const authHeader = req.headers.get('Authorization');

  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      global: {
        headers: { Authorization: authHeader || '' },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

export const handleError = (err: unknown) => {
  console.error('Error:', err);
  return new Response(JSON.stringify({ error: 'Internal server error' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 500,
  });
};

export const handleSuccess = (data: unknown) => {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
};
