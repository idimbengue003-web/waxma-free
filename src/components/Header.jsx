import { useState, useEffect } from 'react';
import { getStoredPhone, isLimitReached, getWeeklyCount, DEMAND_LIMIT_PER_WEEK, getUser, isAdmin, logoutUser, getFreeVendor, getFreePoints } from '../utils/storage';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [limitInfo, setLimitInfo] = useState({ reached: false, count: 0 });
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const phone = getStoredPhone();
    if (phone) {
      setLimitInfo({ reached: isLimitReached(phone), count: getWeeklyCount(phone) });
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setMenuOpen(false);
  };

  const showAdmin = user && user.role === 'admin';

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-8">
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <a href="#/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-extrabold text-lg md:text-xl px-3 md:px-5 py-2 md:py-2.5 rounded-xl tracking-tight shadow-md shadow-emerald-500/20 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/30 transition-shadow">
            Wakhma
          </a>
          <span className="text-emerald-600 font-bold text-[10px] md:text-xs bg-emerald-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-emerald-200 uppercase tracking-wider">
            Free
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 ml-8">
          <a href="#/" className="text-gray-600 font-medium hover:text-emerald-600 transition-colors text-sm">Accueil</a>
          <a href="#feed" className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-100 transition">📋 Annonces</a>
          <a href="#/recharge" className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-100 transition">
            💎 Points{getFreeVendor() ? ` (${getFreePoints().toLocaleString('fr-FR')})` : ''}
          </a>
          <a href="#post" className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all text-sm">
            Déposer annonce
          </a>
          {getStoredPhone() && (
            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
              limitInfo.reached ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}>
              {limitInfo.count}/{DEMAND_LIMIT_PER_WEEK} cette semaine
            </span>
          )}
          <a href="https://wakhma-pro.lu" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition">
            Vendeur ? → PRO
          </a>
          {showAdmin ? (
            <>
              <a href="#/admin" className="text-emerald-600 font-bold text-sm px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition">
                ADMIN 🔒
              </a>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                Déconnexion
              </button>
            </>
          ) : (
            <a href="#/login" className="text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium">
              Se connecter
            </a>
          )}
        </nav>

        {/* Mobile buttons */}
        <div className="md:hidden flex items-center gap-1.5">
          <a href="#feed" className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1.5 rounded-lg text-[11px] font-bold">
            📋
          </a>
          <a href="#/recharge" className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1.5 rounded-lg text-[11px] font-bold">
            💎
          </a>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 p-1.5" aria-label="Menu">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-center py-2.5 text-sm font-medium tracking-wide border-y border-emerald-200/50">
        <span className="text-gray-600">Poste ce que tu veux.</span>{' '}
        <span className="text-emerald-600 font-semibold">Gratos.</span>
      </div>

      {limitInfo.reached && (
        <div className="bg-red-50 border-b border-red-200 text-red-500 text-center py-3 text-xs font-semibold">
          Limite 3/sem atteinte, revenez lundi. Passe sur{' '}
          <a href="https://wakhma-pro.lu" className="underline font-bold hover:text-red-700">Wakhma Pro</a>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in-up shadow-lg">
          <nav className="flex flex-col p-6 gap-3">
            <a href="#/" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium py-3 px-5 rounded-xl hover:bg-gray-50 transition text-sm">🏠 Accueil</a>
            <a href="#feed" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium py-3 px-5 rounded-xl hover:bg-gray-50 transition text-sm">📋 Annonces</a>
            <a href="#/recharge" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-emerald-700 font-bold py-3 px-5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm">💎 Acheter des points</a>
            <a href="#post" onClick={() => setMenuOpen(false)} className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold py-3.5 px-5 rounded-xl text-center text-sm">✏️ Déposer annonce</a>

            <div className="rounded-xl p-4 mt-1 bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <span className="font-bold text-sm text-blue-600">Tu es vendeur ?</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Sur Wakhma PRO, achète des points A PARTIR DE 1000F pour révéler les numéros WhatsApp des clients.</p>
              <a href="https://wakhma-pro.lu" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}
                className="block text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm">
                Vendeur ? → Wakhma PRO
              </a>
            </div>

            {limitInfo.reached && (
              <div className="bg-red-50 text-red-500 font-bold py-3 px-5 rounded-xl text-center text-sm border border-red-200">
                Limite 3/sem atteinte → Wakhma Pro
              </div>
            )}

            {showAdmin ? (
              <>
                <a href="#/admin" onClick={() => setMenuOpen(false)} className="text-emerald-600 font-bold py-3 px-5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm">ADMIN 🔒</a>
                <button onClick={handleLogout} className="text-red-500 font-medium py-3 px-5 rounded-xl hover:bg-red-50 transition text-sm text-left">Déconnexion</button>
              </>
            ) : (
              <a href="#/login" onClick={() => setMenuOpen(false)} className="text-gray-400 py-3 px-5 rounded-xl hover:text-gray-700 hover:bg-gray-50 transition text-sm">Se connecter</a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
