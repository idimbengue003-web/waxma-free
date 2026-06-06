import { useState } from 'react';
import { formatFCFA, timeAgo, URGENCY_OPTIONS, getFreeVendor, getFreePoints, getRevealPrice, deductPoints, recordReveal, maskPhonesInText, getSubscriptionInfo } from '../utils/storage';

export default function DemandCard({ demand }) {
  const urgencyInfo = URGENCY_OPTIONS.find(o => o.value === demand.urgency);
  const displayTitle = maskPhonesInText(demand.title.replace(/^Je cherche\s*/i, ''));
  const displayDescription = maskPhonesInText(demand.description);
  const [revealed, setRevealed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const vendor = getFreeVendor();
  const points = getFreePoints();
  const revealPrice = getRevealPrice();
  const subInfo = getSubscriptionInfo();
  const canReveal = vendor && points >= revealPrice;

  const handleReveal = () => {
    if (deductPoints(revealPrice)) {
      recordReveal(demand.id);
      setRevealed(true);
      setShowConfirm(false);
    }
  };

  const whatsappMessage = subInfo.tier === 'king'
    ? `Salut, j'ai vu ton annonce "${displayTitle}" sur Wakhma. Je suis ⭐ KING VIP Wakhma ⭐.`
    : `Salut, j'ai vu ton annonce "${displayTitle}" sur Wakhma. Je suis vendeur.`;

  return (
    <article className="block bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:border-orange-400 transition-all duration-200 overflow-hidden">
      <div className="relative w-full h-[180px] bg-gray-100">
        {demand.photo ? (
          <img src={demand.photo} alt={displayTitle} className="w-full h-full object-cover rounded-t-xl" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 rounded-t-xl">
            <span className="text-4xl">🔍</span>
          </div>
        )}
        <span className="absolute top-2 left-2 bg-wakhma-highlight/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
          {demand.category}
        </span>
        {urgencyInfo && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
            {demand.urgency === 'urgent' ? 'URGENT' : urgencyInfo.label}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-1">
          <span className="text-orange-500">Je cherche</span> {displayTitle}
        </h3>
        {demand.budget > 0 && (
          <p className="text-xl font-bold text-orange-500 mb-2">{formatFCFA(demand.budget)}</p>
        )}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{displayDescription}</p>
        <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">📍 {demand.quartier || 'Dakar'}</span>
          <span>{timeAgo(demand.createdAt)}</span>
        </div>

        {revealed ? (
          <a href={`https://wa.me/221${demand.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank" rel="noopener noreferrer"
            className="block text-center bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition text-sm">
            💬 WhatsApp {demand.whatsapp}
          </a>
        ) : canReveal ? (
          showConfirm ? (
            <div className="space-y-2">
              <p className="text-xs text-center text-gray-500">Révéler ce numéro pour <span className="font-bold text-orange-500">{revealPrice.toLocaleString('fr-FR')} pts</span> ?</p>
              {subInfo.active && subInfo.tier === 'king' && (
                <p className="text-[10px] text-center text-yellow-600 font-semibold">⭐ Prix KING VIP appliqué</p>
              )}
              {subInfo.active && subInfo.tier === 'diambar' && (
                <p className="text-[10px] text-center text-emerald-600 font-semibold">💎 Prix Diambar appliqué</p>
              )}
              <div className="flex gap-2">
                <button onClick={handleReveal}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-2.5 rounded-xl text-sm hover:shadow-lg transition">
                  ✅ Oui, révéler
                </button>
                <button onClick={() => setShowConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-200 transition">
                  Annuler
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-400">Solde : {points.toLocaleString('fr-FR')} pts</p>
            </div>
          ) : (
            <button onClick={() => setShowConfirm(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition text-sm">
              🔓 Révéler le numéro ({revealPrice.toLocaleString('fr-FR')} pts)
            </button>
          )
        ) : (
          <a href="#/recharge"
            className="block text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition text-sm">
            💎 Acheter des points pour révéler
          </a>
        )}
      </div>
    </article>
  );
}
