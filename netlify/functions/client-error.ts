import type { Handler } from '@netlify/functions';
import { getSupabaseAdmin } from '../lib/supabase-admin';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: '' };
  try {
    const input = JSON.parse(event.body || '{}');
    const message = String(input.message || '').slice(0, 1000);
    if (!message) return { statusCode: 400, body: '' };
    await getSupabaseAdmin().from('client_error_logs').insert({
      message,
      source: String(input.source || '').slice(0, 500) || null,
      stack: String(input.stack || '').slice(0, 4000) || null,
      page_url: String(input.page_url || '').slice(0, 1000) || null,
      user_agent: event.headers['user-agent']?.slice(0, 500) || null,
    });
    return { statusCode: 204, body: '' };
  } catch { return { statusCode: 204, body: '' }; }
};
