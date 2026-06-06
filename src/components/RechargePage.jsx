import { useState } from 'react';
import { getFreeVendor, getFreePoints, addFreePoints, TARIFS_RECHARGE, getRevealsFromPoints, generateRef, getRevealPrice, SUBSCRIPTION_TIERS, activateSubscription, getSubscriptionInfo, setFreeVendor } from '../utils/storage';

export default function RechargePage() {
  const vendor = getFreeVendor();
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [method, setMethod] = useState(null);
  const [step, setStep] = useState('choose');
  const [phone, setPhone] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('abonnement'); // 'abonnement' or 'points'

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
  const revealPrice = getRevealPrice();
  const subInfo = getSubscriptionInfo();

  const processPayment = () => {
    if (selectedTier) {
      addFreePoints(selectedTier.points);
    }
    setStep('success');
  };

  const processSubscription = () => {
    if (selectedSub) {
      const success = activateSubscription(selectedSub.id);
      if (success) {
        setStep('sub-success');
      }
    }
  };

  // ── Step: Subscription success ──
  if (step === 'sub-success') {
    const updatedSub = getSubscriptionInfo();
    const updatedPoints = getFreePoints();
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="text-7xl mb-5 animate-bounce">{updatedSub.badge}</div>
          <h2 className="text-2xl font-black gradient-text mb-3">Abonnement activé !</h2>
          <p className="text-gray-600 mb-2">Tu es maintenant <span className="font-bold">{updatedSub.badge} {updatedSub.tierName}</span></p>
          <p className="text-sm text-gray-500 mb-2">Révélation à <span className="font-bold text-orange-500">{getRevealPrice().toLocaleString('fr-FR')} pts</span> au lieu de 1 500 pts</p>
          <p className="text-gray-600 mb-4">Ton solde : <span className="font-bold text-orange-500">{updatedPoints.toLocaleString('fr-FR')} points</span></p>
          <div className={`rounded-xl p-4 mb-6 border ${updatedSub.tier === 'king' ? 'bg-yellow-50 border-yellow-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <p className="font-bold text-sm mb-1">{updatedSub.badge} Valable 30 jours</p>
            <p className="text-xs text-gray-500">Expire le {new Date(updatedSub.endDate).toLocaleDateString('fr-FR')}</p>
          </div>
          <a href="#feed" className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-10 py-4 rounded-xl hover:shadow-xl transition">
            📋 Voir les annonces
          </a>
        </div>
      </div>
    );
  }

  // ── Step: Points success ──
  if (step === 'success') {
    const newPoints = getFreePoints();
    const newReveals = getRevealsFromPoints();
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="text-7xl mb-5 animate-bounce">💎</div>
          <h2 className="text-2xl font-black gradient-text mb-3">Points ajoutés !</h2>
          <p className="text-gray-600 mb-2">Ton solde : <span className="font-bold text-orange-500">{newPoints.toLocaleString('fr-FR')} points</span> ({newReveals} révélations)</p>
          <p className="text-sm text-orange-500 font-semibold mb-3">1 numéro WhatsApp = {revealPrice.toLocaleString('fr-FR')} pts</p>
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

  // ── Step: Choose tier (main page) ──
  if (step === 'choose' && !selectedTier && !selectedSub) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">💎</div>
            <h1 className="text-2xl font-black gradient-text">Points & Abonnements</h1>
            <p className="text-gray-500 mt-2">Révèle les numéros WhatsApp des clients intéressés</p>
            <div className="mt-3 inline-flex items-center gap-3 bg-orange-50 border border-orange-200 px-5 py-2.5 rounded-xl">
              <span className="text-lg">💎</span>
              <span className="font-bold text-orange-600">{currentPoints.toLocaleString('fr-FR')} pts</span>
              <span className="text-xs text-gray-400">({revealsFromPoints} révélations)</span>
            </div>
            {subInfo.active && (
              <div className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${
                subInfo.tier === 'king' ? 'bg-yellow-50 border-yellow-200' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <span>{subInfo.badge}</span>
                <span className={`font-bold text-sm ${subInfo.tier === 'king' ? 'text-yellow-600' : 'text-emerald-600'}`}>
                  {subInfo.tierName} · {subInfo.daysLeft}j restants
                </span>
                <span className="text-xs text-gray-400">· {revealPrice.toLocaleString('fr-FR')} pts/révélation</span>
              </div>
            )}
          </div>

          {/* Tab switcher */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-100 rounded-xl p-1.5 gap-1">
              <button onClick={() => setActiveTab('abonnement')}
                className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                  activeTab === 'abonnement'
                    ? 'bg-white shadow-md text-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                ⭐ Abonnements
              </button>
              <button onClick={() => setActiveTab('points')}
                className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                  activeTab === 'points'
                    ? 'bg-white shadow-md text-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                💎 Recharger des points
              </button>
            </div>
          </div>

          {/* ── ABONNEMENTS TAB ── */}
          {activeTab === 'abonnement' && (
            <div>
              <div className="max-w-2xl mx-auto mb-8 text-center">
                <h2 className="text-xl font-black text-gray-900 mb-2">Choisis ton abonnement</h2>
                <p className="text-gray-500 text-sm">Les abonnements durent 30 jours et incluent des points bonus + des prix de révélation réduits</p>
              </div>
              <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {SUBSCRIPTION_TIERS.map(tier => {
                  const isCurrent = subInfo.tier === tier.id;
                  const savings = Math.round((1 - tier.revealPrice / 1500) * 100);
                  return (
                    <div key={tier.id} className={`relative rounded-2xl p-6 border-2 transition-all ${
                      isCurrent
                        ? tier.id === 'king' ? 'border-yellow-400 bg-yellow-50/50 shadow-lg shadow-yellow-200/20' : 'border-emerald-400 bg-emerald-50/50 shadow-lg shadow-emerald-200/20'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                    }`}>
                      {tier.id === 'king' && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                          LE PLUS POPULAIRE
                        </div>
                      )}
                      <div className="text-center mb-5">
                        <div className="text-4xl mb-2">{tier.badge}</div>
                        <h3 className="text-xl font-black text-gray-900">{tier.name}</h3>
                        <p className="text-gray-400 text-xs mt-1">Valable 30 jours</p>
                      </div>
                      <div className="text-center mb-5">
                        <span className="text-3xl font-black text-gray-900">{tier.price.toLocaleString('fr-FR')}</span>
                        <span className="text-gray-400 font-bold text-sm"> FCFA/mois</span>
                      </div>
                      <div className="space-y-3 mb-6">
                        {tier.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-emerald-500 text-sm mt-0.5">✓</span>
                            <span className="text-sm text-gray-600">{feat}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-5 text-center">
                        <p className="text-xs text-gray-500">Révélation à</p>
                        <p className="font-black text-orange-500 text-lg">{tier.revealPrice.toLocaleString('fr-FR')} pts</p>
                        <p className="text-xs text-emerald-600 font-semibold">-{savings}% vs Free</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-center">
                        <p className="text-xs text-gray-500">Points bonus inclus</p>
                        <p className="font-black text-blue-600 text-lg">{tier.bonusPoints.toLocaleString('fr-FR')} pts</p>
                      </div>
                      {isCurrent ? (
                        <div className={`text-center py-3 rounded-xl font-bold text-sm ${
                          tier.id === 'king' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {subInfo.badge} Actif · {subInfo.daysLeft}j restants
                        </div>
                      ) : (
                        <button onClick={() => setSelectedSub(tier)}
                          className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:shadow-lg ${
                            tier.id === 'king'
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-yellow-300/30'
                              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-emerald-300/30'
                          }`}>
                          S'abonner — {tier.price.toLocaleString('fr-FR')} FCFA
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Current subscription info */}
              {subInfo.active && (
                <div className="max-w-2xl mx-auto mt-8 bg-gray-50 rounded-2xl p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Ton abonnement actuel</p>
                  <p className="font-bold text-gray-800">{subInfo.badge} {subInfo.tierName} — expire le {new Date(subInfo.endDate).toLocaleDateString('fr-FR')}</p>
                  <p className="text-xs text-gray-400 mt-1">Tu peux renouveler ou changer à tout moment. Les points restent si l'abonnement expire.</p>
                </div>
              )}
            </div>
          )}

          {/* ── POINTS TAB ── */}
          {activeTab === 'points' && (
            <div>
              <div className="max-w-2xl mx-auto mb-8 text-center">
                <h2 className="text-xl font-black text-gray-900 mb-2">Recharger des points</h2>
                <p className="text-gray-500 text-sm">1 numéro = <span className="font-bold text-orange-500">{revealPrice.toLocaleString('fr-FR')} pts</span>
                  {subInfo.active && <span className="text-emerald-600"> (prix réduit grâce à ton abonnement)</span>}
                </p>
              </div>
              <div className="max-w-3xl mx-auto space-y-3">
                {TARIFS_RECHARGE.map(tier => {
                  const reveals = Math.floor(tier.points / revealPrice);
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

              {/* Message vendeur */}
              <div className="max-w-2xl mx-auto mt-8 bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center">
                <p className="font-bold text-orange-600 text-sm">📢 Les annonces arrivent à tout moment — {vendor.name} — Reste connecté</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Step: Subscription payment - choose method ──
  if (selectedSub && !method && step === 'choose') {
    return (
      <div className="py-12 px-4">
        <div className="max-w-lg mx-auto">
          <button onClick={() => setSelectedSub(null)} className="text-gray-400 text-sm mb-6 hover:text-gray-600">← Retour</button>
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">{selectedSub.badge}</div>
            <h1 className="text-2xl font-black gradient-text">Abonnement {selectedSub.name}</h1>
            <div className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-50 border border-orange-200">
              <span className="text-2xl font-black text-orange-600">{selectedSub.price.toLocaleString('fr-FR')}</span>
              <span className="text-gray-400 font-bold text-sm">FCFA/mois</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">Valable 30 jours · {selectedSub.bonusPoints.toLocaleString('fr-FR')} pts bonus · Révélation à {selectedSub.revealPrice.toLocaleString('fr-FR')} pts</p>
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

  // ── Step: Points payment - choose method ──
  if (selectedTier && !method && step === 'choose') {
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

  // ── Step: Phone input ──
  if (step === 'choose' && method) {
    const isSub = !!selectedSub;
    const amount = isSub ? selectedSub.price : selectedTier.prix;
    const label = isSub ? `Abonnement ${selectedSub.name}` : `${selectedTier.points.toLocaleString('fr-FR')} Points`;
    return (
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => { setMethod(null); setError(''); }} className="text-gray-400 text-sm mb-6 hover:text-gray-600">← Retour</button>
          <div className={`rounded-2xl p-8 text-white text-center mb-8 ${method === 'wave' ? 'bg-[#1DC3E0]' : 'bg-[#FF6600]'}`}>
            <div className="text-5xl mb-3">{isSub ? selectedSub.badge : method === 'wave' ? '🌊' : '🟠'}</div>
            <h2 className="text-xl font-bold">Payer avec {method === 'wave' ? 'Wave' : 'Orange Money'}</h2>
            <p className="text-white/80 text-sm mt-2">{label} — {amount.toLocaleString('fr-FR')} FCFA</p>
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
              Payer {amount.toLocaleString('fr-FR')} FCFA
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Manual payment ──
  if (step === 'paying') {
    const isSub = !!selectedSub;
    const amount = isSub ? selectedSub.price : selectedTier.prix;
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
                { n: '2', t: `Envoie ${amount.toLocaleString('fr-FR')} FCFA`, d: isWave ? 'Au numéro : 221 77 000 00 00' : 'Via #144#' },
                { n: '3', t: 'Mets la référence', d: `Ajoute ${paymentRef} dans le motif` },
              ].map(s => (
                <div key={s.n} className="flex gap-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: color }}>{s.n}</div>
                  <div><p className="font-semibold text-sm text-gray-900">{s.t}</p><p className="text-xs text-gray-400 mt-0.5">{s.d}</p></div>
                </div>
              ))}
            </div>
            <button onClick={isSub ? processSubscription : processPayment}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition">
              ✅ J'ai fait le paiement
            </button>
            <p className="text-xs text-gray-400 text-center">Mode démo : activation instantanée</p>
          </div>
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
