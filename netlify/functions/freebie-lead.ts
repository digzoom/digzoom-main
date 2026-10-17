import type { Handler } from '@netlify/functions';
import { createHash } from 'node:crypto';
import { getSupabaseAdmin } from '../lib/supabase-admin';

const freebieIds = new Set(['social-square', 'story-background', 'offer-card', 'marketing-checklist']);
const allowedOrigins = new Set(['https://digzoom.com', 'https://www.digzoom.com']);

export const handler: Handler = async event => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  if (event.body && event.body.length > 8192) return { statusCode: 413, body: JSON.stringify({ error: 'Request too large' }) };
  const origin = event.headers.origin;
  if (origin && !allowedOrigins.has(origin) && !/^http:\/\/localhost:(3000|5173)$/.test(origin)) {
    return { statusCode: 403, body: JSON.stringify({ error: 'Invalid origin' }) };
  }

  try {
    const raw = JSON.parse(event.body || '{}');
    // Honeypot: silently discard automated submissions, without writing personal data.
    if (raw.website) return { statusCode: 200, body: JSON.stringify({ success: true }) };
    const email = typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : '';
    const phone = typeof raw.phone === 'string' ? raw.phone.trim() : '';
    const freebieId = typeof raw.freebieId === 'string' ? raw.freebieId : '';
    const marketingConsent = raw.marketingConsent === true;
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        phone.length > 30 || !/^\+?[0-9\s()\-]{7,30}$/.test(phone) || !freebieIds.has(freebieId) ||
        typeof raw.marketingConsent !== 'boolean') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid fields' }) };
    }

    const ip = event.headers['x-nf-client-connection-ip'] || '';
    const ipHash = ip ? createHash('sha256').update(ip).digest('hex') : null;
    const db = getSupabaseAdmin();
    if (ipHash) {
      const { count, error: countError } = await db.from('freebie_leads')
        .select('id', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
      if (countError) throw countError;
      if ((count || 0) >= 10) return { statusCode: 429, body: JSON.stringify({ error: 'Too many requests' }) };
    }

    const { error } = await db.from('freebie_leads').insert({
      email, phone, freebie_id: freebieId, marketing_consent: marketingConsent,
      consent_at: marketingConsent ? new Date().toISOString() : null,
      source: 'freebies', ip_hash: ipHash,
    });
    if (error) throw error;
    return { statusCode: 200, headers: { 'Cache-Control': 'no-store' }, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error('[freebie-lead] Failed to save:', error instanceof Error ? error.message : error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not save your request' }) };
  }
};
