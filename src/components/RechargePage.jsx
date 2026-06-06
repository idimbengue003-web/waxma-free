import { useState } from 'react';
import { getFreeVendor, getFreePoints, addFreePoints, TARIFS_RECHARGE, getRevealsFromPoints, generateRef, POINTS_PAR_REVELATION } from '../utils/storage';

export default function RechargePage() {
  const vendor = getFreeVendor();
  const [selectedTier, setSelectedTier] = useState(null);
  const [method, setMethod] = useState(null);
  const [step, setStep] = useState('choose');
  const [phone, setPhone] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [error, setError] = useState('');

  if (!vendor) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-5">🏪</div>
          <h1 className="text-2xl font-black gradient-text mb-4">Deviens vendeur</h1>
          <p className="text-gray-500 mb-8">Crée ton profil vendeur pour acheter des points et révéler les numéros WhatsApp des clients.</p>
          <VendorRegister onDone={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  const currentPoints = getFreePoints();
  const revealsFromPoints = getRevealsFromPoints();

  const processPayment = () => {
    if (selectedTier) {
      addFreePoints(selectedTier.points);
    }
    setStep('success');
  };

  // ── Step: Choose tier ──
  if (step === 'choose' && !selectedTier) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">💎</div>
            <h1 className="text-2xl font-black gradient-text">Acheter des Points</h1>
            <p className="text-gray-500 mt-2">Révèle les numéros WhatsApp des clients intéressés</p>
            <p className="text-sm text-gray-400 mt-1">1 numéro = <span className="font-bold text-orange-500">1 500 pts</span></p>
            <div className="mt-3 inline-flex items-center gap-3 bg-orange-50 border border-orange-200 px-5 py-2.5 rounded-xl">
              <span className="text-lg">💎</span>
              <span className="font-bold text-orange-600">{currentPoints.toLocaleString('fr-FR')} pts</span>
              <span className="text-xs text-gray-400">({revealsFromPoints} révélations)</span>
            </div>
          </div>

          {/* Message vendeur */}
          <div className="max-w-2xl mx-auto mb-8 bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center">
            <p className="font-bold text-orange-600 text-sm">📢 Les annonces arrivent à tout moment — {vendor.name} — Reste connecté</p>
          </div>

          {/* Recharges */}
          <h2 className="text-xl font-black text-gray-900 text-center mb-6">💎 Recharger des points</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {TARIFS_RECHARGE.map(tier => {
              const reveals = Math.floor(tier.points / POINTS_PAR_REVELATION);
              return (
                <button key={tier.prix} onClick={() => setSelectedTier(tier)}
                  className="w-full rounded-2xl p-5 flex items-center gap-5 transition-all hover:shadow-xl active:scale-[0.99] border-2 text-left bg-white border-gray-200 hover:border-orange-400">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0 bg-orange-50 text-orange-500">
                    {tier.points >= 1000 ? `${(tier.points / 1000).toFixed(tier.points % 1000 === 0 ? 0 : 1)}k` : tier.points}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 text-lg">{tier.prix.toLocaleString('fr-FR')} FCFA</p>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500">{tier.label}</span>
                      {tier.prix === 10000 && <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-lg">MEILLEUR</span>}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      <span className="font-bold text-gray-700">{tier.points.toLocaleString('fr-FR')} points</span> — {reveals} numéro{reveals > 1 ? 's' : ''} WhatsApp
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Step: Choose payment
  if (step === 'choose' && selectedTier && !method) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-lg mx-auto">
          <button onClick={() => setSelectedTier(null)} className="text-gray-400 text-sm mb-6 hover:text-gray-600">← Retour</button>
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">💎</div>
            <h1 className="text-2xl font-black gradient-text">{selectedTier.points.toLocaleString('fr-FR')} Points</h1>
            <div className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-50 border border-orange-200">
              <span className="text-2xl font-black text-orange-600">{selectedTier.prix.toLocaleString('fr-FR')}</span>
              <span className="text-gray-400 font-bold text-sm">FCFA</span>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-5 text-center">Choisis ton moyen de paiement</h3>
          <div className="space-y-4">
            <button onClick={() => { setMethod('wave'); setError(''); }}
              className="w-full bg-[#1DC3E0] hover:bg-[#17a8c4] text-white rounded-2xl p-5 flex items-center gap-5 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🌊</div>
              <div className="text-left"><p className="font-bold text-lg">Wave</p><p className="text-white/80 text-xs">Paiement instantané</p></div>
              <span className="ml-auto text-xl">→</span>
            </button>
            <button onClick={() => { setMethod('orange'); setError(''); }}
              className="w-full bg-[#FF6600] hover:bg-[#e55c00] text-white rounded-2xl p-5 flex items-center gap-5 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🟠</div>
              <div className="text-left"><p className="font-bold text-lg">Orange Money</p><p className="text-white/80 text-xs">Paiement mobile</p></div>
              <span className="ml-auto text-xl">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step: Phone input
  if (step === 'choose' && method) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => { setMethod(null); setError(''); }} className="text-gray-400 text-sm mb-6 hover:text-gray-600">← Retour</button>
          <div className={`rounded-2xl p-8 text-white text-center mb-8 ${method === 'wave' ? 'bg-[#1DC3E0]' : 'bg-[#FF6600]'}`}>
            <div className="text-5xl mb-3">{method === 'wave' ? '🌊' : '🟠'}</div>
            <h2 className="text-xl font-bold">Payer avec {method === 'wave' ? 'Wave' : 'Orange Money'}</h2>
            <p className="text-white/80 text-sm mt-2">{selectedTier.prix.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div className="rounded-2xl shadow-xl bg-white p-8 space-y-6">
            {error && <div className="bg-red-50 border-2 border-red-300 text-red-700 p-4 rounded-xl text-sm text-center font-medium">{error}</div>}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Ton numéro {method === 'wave' ? 'Wave' : 'Orange Money'} *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="77 000 00 00"
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm" />
            </div>
            <button onClick={() => { if (!phone.trim() || phone.trim().length < 9) { setError('Entre ton numéro'); return; } setPaymentRef(generateRef()); setStep('paying'); }}
              className={`w-full text-white font-bold py-4 rounded-xl transition ${method === 'wave' ? 'bg-[#1DC3E0] hover:bg-[#17a8c4]' : 'bg-[#FF6600] hover:bg-[#e55c00]'}`}>
              Payer {selectedTier.prix.toLocaleString('fr-FR')} FCFA
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step: Manual payment
  if (step === 'paying') {
    const isWave = method === 'wave';
    const color = isWave ? '#1DC3E0' : '#FF6600';
    return (
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl p-8 text-white text-center mb-8" style={{ background: color }}>
            <div className="text-5xl mb-3">{isWave ? '🌊' : '🟠'}</div>
            <h2 className="text-xl font-bold">Envoie le paiement</h2>
          </div>
          <div className="rounded-2xl shadow-xl bg-white p-8 space-y-6">
            <div className="rounded-xl p-5 text-center bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-400 mb-2">Ta référence</p>
              <p className="text-2xl font-mono font-black text-gray-900 tracking-wider">{paymentRef}</p>
            </div>
            <div className="space-y-5">
              {[
                { n: '1', t: `Ouvre ${isWave ? 'Wave' : 'Orange Money'}`, d: 'Sur ton téléphone' },
                { n: '2', t: `Envoie ${selectedTier.prix.toLocaleString('fr-FR')} FCFA`, d: isWave ? 'Au numéro : 221 77 000 00 00' : 'Via #144#' },
                { n: '3', t: 'Mets la référence', d: `Ajoute ${paymentRef} dans le motif` },
              ].map(s => (
                <div key={s.n} className="flex gap-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: color }}>{s.n}</div>
                  <div><p className="font-semibold text-sm text-gray-900">{s.t}</p><p className="text-xs text-gray-400 mt-0.5">{s.d}</p></div>
                </div>
              ))}
            </div>
            <button onClick={processPayment}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition">
              ✅ J'ai fait le paiement
            </button>
            <p className="text-xs text-gray-400 text-center">Mode démo : activation instantanée</p>
          </div>
        </div>
      </div>
    );
  }

  // Step: Success
  if (step === 'success') {
    const newPoints = getFreePoints();
    const newReveals = getRevealsFromPoints();
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="text-7xl mb-5 animate-bounce">💎</div>
          <h2 className="text-2xl font-black gradient-text mb-3">Points ajoutés !</h2>
          <p className="text-gray-600 mb-2">Ton solde : <span className="font-bold text-orange-500">{newPoints.toLocaleString('fr-FR')} points</span> ({newReveals} révélations)</p>
          <p className="text-sm text-orange-500 font-semibold mb-3">1 numéro WhatsApp = 1 500 pts</p>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <p className="font-bold text-orange-600 text-sm">📢 Les annonces arrivent à tout moment — {vendor.name} — Reste connecté</p>
          </div>
          <a href="#feed" className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-10 py-4 rounded-xl hover:shadow-xl transition">
            📋 Voir les annonces
          </a>
        </div>
      </div>
    );
  }

  return null;
}

// ── Vendor Register ──
function VendorRegister({ onDone }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Nom obligatoire'); return; }
    if (!phone.trim() || !/^7[0-8]\d{7}$/.test(phone.trim())) { setError('Numéro WhatsApp invalide'); return; }
    const vendor = {
      name: name.trim(),
      numero: phone.trim(),
      points: 0,
      role: 'free',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('wakhma_free_vendor', JSON.stringify(vendor));
    localStorage.setItem('wakhma_free_phone', phone.trim());
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-5 text-left">
      {error && <div className="bg-red-50 border-2 border-red-300 text-red-700 p-4 rounded-xl text-sm text-center font-medium">{error}</div>}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Ton nom / boutique</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Chez Modou, Digital Shop..."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm" required />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">WhatsApp *</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
          placeholder="77 000 00 00"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm" required />
      </div>
      <button type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition text-sm">
        🏪 Créer mon profil vendeur
      </button>
    </form>
  );
}
