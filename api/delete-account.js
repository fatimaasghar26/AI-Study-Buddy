import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = [
  'https://ai-study-buddy-beta-hazel.vercel.app',
  'http://localhost:3000'
];

const SUPABASE_URL = 'https://nsbdvslcanbdcudseqni.supabase.co';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Requests from this origin are not allowed.' });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return res.status(500).json({ error: 'Server not configured (missing service role key).' });
  }

  // The browser sends the logged-in user's own access token in this header.
  const authHeader = req.headers.authorization || '';
  const accessToken = authHeader.replace('Bearer ', '').trim();
  if (!accessToken) {
    return res.status(401).json({ error: 'Not logged in.' });
  }

  const adminClient = createClient(SUPABASE_URL, serviceKey);

  const { data: userData, error: userError } = await adminClient.auth.getUser(accessToken);
  if (userError || !userData?.user) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userData.user.id);
  if (deleteError) {
    console.error('Delete user error:', deleteError.message);
    return res.status(500).json({ error: 'Could not delete account.' });
  }

  return res.status(200).json({ success: true });
}
