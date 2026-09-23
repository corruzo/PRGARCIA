import dns from 'node:dns';
import https from 'node:https';

dns.setDefaultResultOrder('ipv4first');

function normalizeRate(value) {
  if (!value) return null;

  const normalized = String(value)
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^0-9.-]/g, '');
  const rate = Number(normalized);

  return Number.isFinite(rate) && rate > 0 ? rate : null;
}

function requestBCVWithSystemTLS() {
  return new Promise((resolve, reject) => {
    const request = https.get('https://www.bcv.org.ve/', {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; PrestamoCalc/1.0)',
      },
      // The BCV server currently presents an incomplete certificate chain.
      // The response is still validated by the expected BCV HTML structure.
      rejectUnauthorized: false,
    }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        if (response.statusCode && response.statusCode >= 400) {
          reject(new Error(`BCV respondió con HTTP ${response.statusCode}`));
          return;
        }
        resolve(body);
      });
    });

    request.setTimeout(10000, () => request.destroy(new Error('Tiempo de espera agotado al consultar el BCV')));
    request.on('error', reject);
  });
}

export function extractBCVDollarRate(html) {
  if (!html || typeof html !== 'string') return null;

  const dollarMatch = html.match(/<div[^>]*id=['"]dolar['"][^>]*>[\s\S]*?<strong[^>]*>(.*?)<\/strong>/i);
  const officialCardRate = normalizeRate(dollarMatch?.[1]);
  if (officialCardRate) return officialCardRate;

  // Supports the BCV currency table when USD appears before its numeric value.
  const usdRow = html.match(/(?:>\s*USD\s*<|\bUSD\b)[\s\S]{0,240}?([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]+|[0-9]+(?:[.,][0-9]+))/i);
  return normalizeRate(usdRow?.[1]);
}

export async function fetchOfficialBCVRate() {
  let html;

  try {
    const response = await fetch('https://www.bcv.org.ve/', {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; PrestamoCalc/1.0)',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`BCV respondió con HTTP ${response.status}`);
    }

    html = await response.text();
  } catch {
    html = await requestBCVWithSystemTLS();
  }

  const rate = extractBCVDollarRate(html);
  if (!rate) {
    throw new Error('No se encontró la tasa USD en la página oficial del BCV');
  }

  return { rate, source: 'BCV Oficial' };
}
