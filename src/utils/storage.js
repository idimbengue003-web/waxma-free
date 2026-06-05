// ══════════════════════════════════════════════
// WAXMA FREE — Storage & Business Logic
// ══════════════════════════════════════════════

export const DEMAND_LIMIT_PER_WEEK = 3;
export const PRO_URL = 'https://waxma-pro.lu';

export const CATEGORIES = [
  'Téléphones', 'TV & Écrans', 'Frigo & Congélateur', 'Climatiseur & Ventilateur',
  'Ordinateurs', 'Tablettes', 'Audio & Son', 'Électroménager', 'Plomberie',
  'Électricité', 'Meubles', 'Mode & Vetements', 'Cosmétiques', 'Alimentation',
  'Services', 'Transport', 'Immobilier', 'Autre',
];

export const QUARTIERS = [
  'Médina', 'Plateau', 'Almadies', 'Dakar-Plateau', 'Fann', 'Point E',
  'Mermoz', 'Sacre-Coeur', 'Ouakam', 'Ngor', 'Yoff', 'Parcelles Assainies',
  'Grand Yoff', 'Hann', 'Bel Air', 'Colobane', 'Gueule Tapée', 'Fass',
  'Dieuppeul', 'Sicap Liberte', 'Patte d\'Oie', 'Cambérène', 'Ndiarème',
  'Grand Dakar', 'Biscuiterie', 'HLM', 'Sahm', 'Thiaroye', 'Keur Massar',
];

// ── Week Key ──
export function getWeekKey() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

// ── Weekly Demand Limit ──
export function getWeeklyCount(phone) {
  const key = `waxma_weekly_${phone}_${getWeekKey()}`;
  return parseInt(localStorage.getItem(key) || '0', 10);
}

export function isLimitReached(phone) {
  return getWeeklyCount(phone) >= DEMAND_LIMIT_PER_WEEK;
}

export function incrementWeeklyCount(phone) {
  const key = `waxma_weekly_${phone}_${getWeekKey()}`;
  const count = getWeeklyCount(phone) + 1;
  localStorage.setItem(key, String(count));
}

// ── Phone Storage ──
export function getStoredPhone() {
  return localStorage.getItem('waxma_free_phone') || '';
}
export function setStoredPhone(phone) {
  localStorage.setItem('waxma_free_phone', phone);
}

// ── Demand Storage (localStorage) ──
const DEMANDS_KEY = 'waxma_free_demands';

export function saveDemandLocal(demand) {
  const demands = getDemandsLocal();
  demands.unshift(demand);
  localStorage.setItem(DEMANDS_KEY, JSON.stringify(demands));
}

export function getDemandsLocal() {
  try { return JSON.parse(localStorage.getItem(DEMANDS_KEY) || '[]'); }
  catch { return []; }
}

// ── Helpers ──
export function formatFCFA(n) {
  if (!n) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

export function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

export function maskPhone(phone) {
  if (!phone || phone.length < 8) return phone || '';
  return phone.slice(0, 2) + ' *** ** ' + phone.slice(-2);
}

export function generateId() {
  return 'DEM-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}
