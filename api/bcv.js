import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function extractBCVRatesFromHtml(html) {
  if (!html || typeof html !== 'string') return null;

  const normalize = (value) => {
    if (!value) return null;
    const cleanedValue = value.replace(/[^0-9,.-]/g, '');
    const cleaned = cleanedValue.includes(',')
      ? cleanedValue.replace(/\./g, '').replace(',', '.')
      : cleanedValue;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const dolarMatch = html.match(/<div[^>]*id=['"]dolar['"][^>]*>[\s\S]*?<strong[^>]*>(.*?)<\/strong>/i);
  const usdTableMatch = html.match(/(?:>\s*USD\s*<|\bUSD\b)[\s\S]{0,240}?([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]+|[0-9]+(?:[.,][0-9]+))/i);
  const euroMatch = html.match(/<div[^>]*id=['"]euro['"][^>]*>[\s\S]*?<strong[^>]*>(.*?)<\/strong>/i);

  return {
    dolar: normalize(dolarMatch?.[1]) || normalize(usdTableMatch?.[1]),
    euro: normalize(euroMatch?.[1]),
  };
}

async function fetchBCVOfficialPage() {
  const response = await fetch('https://www.bcv.org.ve/', {
    headers: { Accept: 'text/html' },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error('No se pudo consultar el BCV.');
  }

  return response.text();
}

function buildSuccessPayload(rate, source) {
  return {
    ok: true,
    source,
    value: Number(rate),
    fetchedAt: new Date().toISOString(),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    let previousRate = null;
    if (supabase) {
      try {
        const { data } = await supabase
          .from('tasa_bcv')
          .select('tasa')
          .order('fecha_hora', { ascending: false })
          .limit(1)
          .maybeSingle();
        previousRate = data;
      } catch (err) {
        console.warn('Supabase query error (continuing without DB):', err?.message);
      }
    }

    const html = await fetchBCVOfficialPage();
    const { dolar } = extractBCVRatesFromHtml(html);

    const value = dolar;

    if (!value) {
      return res.status(422).json({ ok: false, error: 'No se pudo extraer la tasa del BCV.' });
    }

    const payload = buildSuccessPayload(value, 'BCV Oficial');

    if (supabase) {
      try {
        await supabase.from('tasa_bcv').insert({
          tasa: value,
          fuente: 'BCV Oficial',
          fecha_hora: new Date().toISOString(),
          estado: 'ok',
        });
      } catch (dbErr) {
        console.warn('Supabase insert error (continuing without saving):', dbErr?.message);
      }
    }

    return res.status(200).json({
      ...payload,
      verifiedAgainstBCV: true,
      changed: Boolean(previousRate && Number(previousRate.tasa) !== Number(value)),
    });
  } catch (error) {
    console.error('BCV fetch error:', error);
    return res.status(500).json({
      ok: false,
      error: 'No se pudo obtener la tasa del BCV.',
      details: process.env.NODE_ENV === 'development' ? error?.message || 'unknown' : undefined,
    });
  }
}
