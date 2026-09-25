/**
 * api/bcv.js — Función serverless para obtener la tasa BCV oficial.
 *
 * Estrategia en cascada:
 *   1. pydolarve.org  — API pública con datos del BCV en tiempo real (JSON limpio)
 *   2. exchangedna.com — Respaldo adicional
 *   3. bcv.org.ve     — Scraping directo como último recurso
 *
 * Si todas fallan, devuelve error 503 para que el cliente use su caché local.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
};

async function fetchFromPydolarve() {
  const res = await fetch('https://pydolarve.org/api/v1/dollar?monitor=bcv', {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`pydolarve HTTP ${res.status}`);
  const data = await res.json();
  const price = data?.price || data?.monitors?.bcv?.price;
  if (!price || price <= 0) throw new Error('pydolarve: tasa inválida');
  return { value: Number(price), source: 'pydolarve.org' };
}

async function fetchFromExchangeDNA() {
  const res = await fetch('https://api.exchangedna.com/exchangedna/v1/rates?base=USD&quote=VES', {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`exchangedna HTTP ${res.status}`);
  const data = await res.json();
  const rate = data?.rates?.VES || data?.rate;
  if (!rate || rate <= 0) throw new Error('exchangedna: tasa inválida');
  return { value: Number(rate), source: 'exchangedna.com' };
}

async function fetchFromBCVdirect() {
  const res = await fetch('https://www.bcv.org.ve/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; PRGARCIA/1.0)',
      Accept: 'text/html',
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`BCV HTTP ${res.status}`);
  const html = await res.text();

  const match = html.match(/id=['\"]dolar['\"][^\>]*>[\s\S]*?<strong[^>]*>(.*?)<\/strong>/i)
    || html.match(/(?:>\s*USD\s*<|\bUSD\b)[\s\S]{0,240}?([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]+)/i);

  const raw = match?.[1]?.replace(/[^0-9,.-]/g, '').replace(',', '.');
  const value = Number(raw);
  if (!value || value <= 0) throw new Error('BCV: no se pudo extraer tasa del HTML');
  return { value, source: 'BCV oficial' };
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).set(CORS_HEADERS).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Añadir headers CORS a la respuesta
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  const strategies = [
    { name: 'pydolarve', fn: fetchFromPydolarve },
    { name: 'exchangedna', fn: fetchFromExchangeDNA },
    { name: 'bcv-direct', fn: fetchFromBCVdirect },
  ];

  const errors = [];

  for (const strategy of strategies) {
    try {
      const result = await strategy.fn();
      console.log(`[BCV] Éxito con ${strategy.name}: ${result.value}`);
      return res.status(200).json({
        ok: true,
        value: result.value,
        source: result.source,
        fetchedAt: new Date().toISOString(),
        verifiedAgainstBCV: true,
      });
    } catch (err) {
      console.warn(`[BCV] Falló ${strategy.name}:`, err.message);
      errors.push(`${strategy.name}: ${err.message}`);
    }
  }

  // Todas fallaron
  console.error('[BCV] Todas las fuentes fallaron:', errors);
  return res.status(503).json({
    ok: false,
    error: 'No se pudo obtener la tasa BCV de ninguna fuente.',
    details: errors,
  });
}
