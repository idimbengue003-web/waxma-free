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
    <header className="sticky top-0 z-50">
      {/* Barre principale */}
      <div className="bg-gradient-to-r from-wakhma-primary via-wakhma-secondary to-wakhma-accent border-b border-wakhma-accent/20">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="#/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-extrabold text-xl px-4 py-2 rounded-xl tracking-tight shadow-lg shadow-orange-500/20 cursor-pointer">
              Wakhma
            </a>
            <div className="flex flex-col">
              <span className="text-white font-black text-[10px] leading-tight uppercase tracking-widest">FREE</span>
              <span className="text-orange-300 text-[9px] leading-tight">Acheteurs</span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            <a href="#/" className="text-wakhma-text font-medium hover:text-orange-400 transition-colors text-sm">Accueil</a>
            <a href="#feed" className="text-wakhma-text font-medium hover:text-orange-400 transition-colors text-sm">📋 Annonces</a>
            <a href="#/recharge" className="flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-500/20 transition">
              💎 Points{getFreeVendor() ? ` (${getFreePoints().toLocaleString('fr-FR')})` : ''}
            </a>
            <a href="#post" className="bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all text-sm">
              Déposer annonce
            </a>
            {getStoredPhone() && (
              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                limitInfo.reached ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
              }`}>
                {limitInfo.count}/{DEMAND_LIMIT_PER_WEEK} cette semaine
              </span>
            )}
            {showAdmin ? (
              <>
                <a href="#/admin" className="text-orange-400 font-bold text-sm px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition">
                  ADMIN 🔒
                </a>
                <button onClick={handleLogout} className="text-wakhma-muted hover:text-red-400 transition-colors text-sm font-medium">
                  Déconnexion
                </button>
              </>
            ) : (
              <a href="#/login" className="text-wakhma-muted hover:text-wakhma-text transition-colors text-sm font-medium">
                Se connecter
              </a>
            )}
          </nav>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-2">
            <a href="#feed" className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-lg text-xs font-bold">
              📋 Annonces
            </a>
            <a href="#/recharge" className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-lg text-xs font-bold">
              💎 Points
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-wakhma-text p-2" aria-label="Menu">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bandeau séparateur FREE */}
      <div className="bg-orange-500 text-white text-center py-2 text-xs font-bold tracking-wide">
        🛒 WAKHMA FREE — Je cherche, les vendeurs me trouvent.
        <span className="ml-3 opacity-70">|</span>
        <a href="https://wakhma-pro.lu" className="ml-3 underline hover:no-underline opacity-90">Tu es vendeur ? → PRO</a>
      </div>

      {limitInfo.reached && (
        <div className="bg-red-500/10 border-b border-red-500/20 text-red-400 text-center py-3 text-xs font-semibold">
          Limite 3/sem atteinte, revenez lundi. Passe sur{' '}
          <a href="https://wakhma-pro.lu" className="underline font-bold hover:text-red-300">Wakhma Pro</a>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden bg-wakhma-secondary border-t border-wakhma-accent/20 animate-fade-in-up">
          <nav className="flex flex-col p-6 gap-3">
            <a href="#/" onClick={() => setMenuOpen(false)} className="text-wakhma-text font-medium py-3 px-5 rounded-xl hover:bg-wakhma-accent/10 transition text-sm">🏠 Accueil</a>
            <a href="#feed" onClick={() => setMenuOpen(false)} className="text-wakhma-text font-medium py-3 px-5 rounded-xl hover:bg-wakhma-accent/10 transition text-sm">📋 Annonces</a>
            <a href="#/recharge" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-orange-400 font-bold py-3 px-5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm">💎 Acheter des points</a>
            <a href="#post" onClick={() => setMenuOpen(false)} className="bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold py-3.5 px-5 rounded-xl text-center text-sm">✏️ Déposer annonce</a>

            <div className="rounded-xl p-4 mt-1 bg-orange-500/5 border border-orange-500/15">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <span className="font-bold text-sm text-orange-400">Tu es vendeur ?</span>
              </div>
              <p className="text-xs text-wakhma-muted mb-3">Sur Wakhma PRO, achète des points A PARTIR DE 1000F pour révéler les numéros WhatsApp des clients.</p>
              <a href="https://wakhma-pro.lu" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}
                className="block text-center bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold py-3 px-4 rounded-xl text-sm">
                Vendeur ? → Wakhma PRO
              </a>
            </div>

            {limitInfo.reached && (
              <div className="bg-red-500/20 text-red-400 font-bold py-3 px-5 rounded-xl text-center text-sm border border-red-500/20">
                Limite 3/sem atteinte → Wakhma Pro
              </div>
            )}

            {showAdmin ? (
              <>
                <a href="#/admin" onClick={() => setMenuOpen(false)} className="text-orange-400 font-bold py-3 px-5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm">ADMIN 🔒</a>
                <button onClick={handleLogout} className="text-red-400 font-medium py-3 px-5 rounded-xl hover:bg-red-500/10 transition text-sm text-left">Déconnexion</button>
              </>
            ) : (
              <a href="#/login" onClick={() => setMenuOpen(false)} className="text-wakhma-muted py-3 px-5 rounded-xl hover:text-wakhma-text hover:bg-wakhma-accent/10 transition text-sm">Se connecter</a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
