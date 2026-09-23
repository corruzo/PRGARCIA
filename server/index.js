import { createServer } from 'node:http';
import { getLatestBCVRate, saveBCVRate } from './db.js';
import { fetchOfficialBCVRate } from './bcv.js';

const port = Number(process.env.API_PORT || 8787);
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction && !getLatestBCVRate()) {
  const developmentRate = Number(process.env.BCV_DEV_RATE || 852.4168);

  if (Number.isFinite(developmentRate) && developmentRate > 0) {
    saveBCVRate({
      rate: developmentRate,
      source: 'BCV local (desarrollo)',
    });
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(payload));
}

async function handleBCV(response) {
  try {
    const previous = getLatestBCVRate();
    const { rate, source } = await fetchOfficialBCVRate();
    const saved = saveBCVRate({ rate, source });
    const changed = Boolean(previous && Number(previous.value) !== Number(rate));

    sendJson(response, 200, {
      ok: true,
      value: Number(saved.value),
      source: saved.source,
      fetchedAt: saved.fetchedAt,
      storage: 'sqlite',
      verifiedAgainstBCV: true,
      changed,
    });
  } catch (error) {
    console.error('[api/bcv]', error.message);
    const latest = getLatestBCVRate();

    if (latest) {
      sendJson(response, 200, {
        ok: true,
        value: Number(latest.value),
        source: latest.source,
        fetchedAt: latest.fetchedAt,
        storage: 'sqlite',
        stale: true,
        verifiedAgainstBCV: false,
        changed: false,
      });
      return;
    }

    sendJson(response, 502, {
      ok: false,
      error: 'No se pudo obtener la tasa oficial del BCV y no hay una tasa local.',
      details: error.message,
    });
  }
}

function handleLatest(response) {
  const latest = getLatestBCVRate();

  if (!latest) {
    sendJson(response, 404, {
      ok: false,
      error: 'No hay una tasa BCV guardada todavía.',
    });
    return;
  }

  sendJson(response, 200, {
    ok: true,
    value: Number(latest.value),
    source: latest.source,
    fetchedAt: latest.fetchedAt,
    storage: 'sqlite',
  });
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method !== 'GET') {
    sendJson(response, 405, { ok: false, error: 'Method not allowed' });
    return;
  }

  if (url.pathname === '/api/bcv') {
    await handleBCV(response);
    return;
  }

  if (url.pathname === '/api/bcv/latest') {
    handleLatest(response);
    return;
  }

  sendJson(response, 404, { ok: false, error: 'Not found' });
});

server.listen(port, () => {
  console.log(`Local API listening on http://localhost:${port}`);
});
