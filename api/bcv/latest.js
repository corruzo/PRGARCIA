import { getSupabaseClient } from '../_lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return res.status(500).json({
        ok: false,
        error: 'El servicio de tasas no está disponible.',
      });
    }

    const { data, error } = await supabase
      .from('tasa_bcv')
      .select('*')
      .order('fecha_hora', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ ok: false, error: error.message });
    }

    if (!data) {
      return res.status(404).json({ ok: false, error: 'No hay tasa BCV guardada aún.' });
    }

    return res.status(200).json({
      ok: true,
      value: Number(data.tasa),
      source: data.fuente,
      fetchedAt: data.fecha_hora,
    });
  } catch (error) {
    console.error('Latest BCV fetch error:', error);
    return res.status(500).json({ ok: false, error: 'Error interno del servidor.' });
  }
}
