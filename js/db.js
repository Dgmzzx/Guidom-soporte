import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase-config.js';
import { showToast } from './ui.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let materials = [];
let movements = [];

async function loadData() {
  const { data: mats, error: errMats } = await supabase
    .from('materials')
    .select('*')
    .order('name');
  if (errMats) { console.error(errMats); return; }
  materials = mats || [];

  const { data: movs, error: errMovs } = await supabase
    .from('movements')
    .select('*')
    .order('date', { ascending: false });
  if (errMovs) { console.error(errMovs); return; }
  movements = movs || [];
}

function computeFor(materialId) {
  let entradas = 0, salidas = 0, lastSalida = null;
  for (const mv of movements) {
    if (mv.material_id !== materialId) continue;
    if (mv.type === 'Entrada') entradas += Number(mv.qty);
    else {
      salidas += Number(mv.qty);
      if (!lastSalida || mv.date > lastSalida) lastSalida = mv.date;
    }
  }
  return { entradas, salidas, lastSalida };
}

export { supabase, materials, movements, loadData, computeFor };
