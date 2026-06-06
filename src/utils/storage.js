// ══════════════════════════════════════════════
// Wakhma FREE — Storage & Business Logic
// ══════════════════════════════════════════════

export const DEMAND_LIMIT_PER_WEEK = 3;
export const PRO_URL = 'https://wakhma-pro.lu';

export const POINTS_PAR_REVELATION = 1500;

export const TARIFS_RECHARGE = [
  { prix: 1000, points: 8000, label: 'Découverte' },
  { prix: 2000, points: 17000, label: 'Standard' },
  { prix: 5000, points: 50000, label: 'Pro' },
  { prix: 10000, points: 105000, label: 'VIP Max' },
];

export const URGENCY_OPTIONS = [
  { value: 'urgent', label: '🔥 Urgent', desc: 'J\'en ai besoin tout de suite' },
  { value: '2jours', label: '⏳ Dans 2 jours', desc: 'J\'en ai besoin sous 2 jours' },
  { value: '1semaine', label: '📅 Dans 1 semaine', desc: 'J\'en ai besoin sous 1 semaine' },
  { value: 'flexible', label: '😊 Flexible', desc: 'Pas de pressing' },
];

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
  const key = `wakhma_weekly_${phone}_${getWeekKey()}`;
  return parseInt(localStorage.getItem(key) || '0', 10);
}

export function isLimitReached(phone) {
  return getWeeklyCount(phone) >= DEMAND_LIMIT_PER_WEEK;
}

export function incrementWeeklyCount(phone) {
  const key = `wakhma_weekly_${phone}_${getWeekKey()}`;
  const count = getWeeklyCount(phone) + 1;
  localStorage.setItem(key, String(count));
}

// ── Phone Storage ──
export function getStoredPhone() {
  return localStorage.getItem('wakhma_free_phone') || '';
}
export function setStoredPhone(phone) {
  localStorage.setItem('wakhma_free_phone', phone);
}

// ── Demand Storage (localStorage) ──
const DEMANDS_KEY = 'wakhma_free_demands';

export function saveDemandLocal(demand) {
  const demands = getDemandsLocal();
  demands.unshift(demand);
  localStorage.setItem(DEMANDS_KEY, JSON.stringify(demands));
}

export function getDemandsLocal() {
  try { return JSON.parse(localStorage.getItem(DEMANDS_KEY) || '[]'); }
  catch { return []; }
}

// ── Auth & Roles ──
const AUTH_KEY = 'wakhma_free_auth';
const ADMIN_PASSWORD = 'wakhma2024';

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
  } catch { return null; }
}

export function isAdmin() {
  const user = getUser();
  return user && user.role === 'admin';
}

export function loginAdmin(password) {
  if (password === ADMIN_PASSWORD) {
    const user = { role: 'admin', loggedIn: true, since: new Date().toISOString() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return true;
  }
  return false;
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
}

// ── Points Storage ──
const POINTS_KEY = 'wakhma_free_points';
const VENDOR_KEY = 'wakhma_free_vendor';

export function getFreeVendor() {
  try { return JSON.parse(localStorage.getItem(VENDOR_KEY) || 'null'); }
  catch { return null; }
}

export function setFreeVendor(v) {
  localStorage.setItem(VENDOR_KEY, JSON.stringify(v));
}

export function getFreePoints() {
  const v = getFreeVendor();
  return v ? (v.points || 0) : 0;
}

export function addFreePoints(amount) {
  const v = getFreeVendor();
  if (v) { v.points = (v.points || 0) + amount; setFreeVendor(v); }
}

export function getRevealsFromPoints() {
  return Math.floor(getFreePoints() / POINTS_PAR_REVELATION);
}

export function generateRef() {
  return 'WKF-' + Date.now().toString(36).toUpperCase();
}

// ── Reveal tracking ──
const REVEALS_KEY = 'wakhma_free_reveals';

export function recordReveal(demandId) {
  const reveals = JSON.parse(localStorage.getItem(REVEALS_KEY) || '[]');
  reveals.push({ demandId, date: new Date().toISOString() });
  localStorage.setItem(REVEALS_KEY, JSON.stringify(reveals));
}

export function deductPoints(amount) {
  const v = getFreeVendor();
  if (v && (v.points || 0) >= amount) { v.points -= amount; setFreeVendor(v); return true; }
  return false;
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

// ── Detect & mask phone numbers in text ──
// Matches Senegalese phone patterns: 7X XXX XX XX, 7XXXXXXXX, +221 7X..., etc.
const PHONE_REGEX = /(\+221\s*)?7[0-8](\s?\d){7}/g;

export function containsPhoneInText(text) {
  if (!text) return false;
  PHONE_REGEX.lastIndex = 0;
  return PHONE_REGEX.test(text);
}

export function maskPhonesInText(text) {
  if (!text) return text;
  return text.replace(PHONE_REGEX, (match) => {
    // Extract just the digits
    const digits = match.replace(/\D/g, '');
    // Get last 8 digits (the SN number)
    const sn = digits.slice(-8);
    if (sn.length >= 8) {
      return sn.slice(0, 2) + ' ─── ── ' + sn.slice(-2);
    }
    return '███ ─── ── ██';
  });
}

export function generateId() {
  return 'DEM-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}
