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
    <header className="bg-wakhma-primary/95 backdrop-blur-md sticky top-0 z-50 border-b border-wakhma-accent/20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="#/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-gradient-to-br from-wakhma-highlight to-emerald-600 text-white font-extrabold text-xl px-4 py-2 rounded-xl tracking-tight shadow-lg shadow-wakhma-highlight/20 cursor-pointer">
            Wakhma
          </a>
          <span className="text-wakhma-highlight font-bold text-xs bg-wakhma-highlight/10 px-3 py-1 rounded-lg border border-wakhma-highlight/20 uppercase tracking-wider">
            Free
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#/" className="text-wakhma-text font-medium hover:text-wakhma-highlight transition-colors text-sm">Accueil</a>
          <a href="#feed" className="text-wakhma-text font-medium hover:text-wakhma-highlight transition-colors text-sm">📋 Annonces</a>
          <a href="#/recharge" className="flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-500/20 transition">
            💎 Points{getFreeVendor() ? ` (${getFreePoints().toLocaleString('fr-FR')})` : ''}
          </a>
          <a href="#post" className="bg-gradient-to-r from-wakhma-highlight to-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-wakhma-highlight/20 transition-all animate-pulse-glow text-sm">
            Déposer annonce
          </a>
          {getStoredPhone() && (
            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
              limitInfo.reached ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-wakhma-highlight/10 text-wakhma-highlight border border-wakhma-highlight/20'
            }`}>
              {limitInfo.count}/{DEMAND_LIMIT_PER_WEEK} cette semaine
            </span>
          )}
          <a href="https://wakhma-pro.lu" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-wakhma-highlight/10 text-wakhma-highlight border border-wakhma-highlight/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-wakhma-highlight/20 transition">
            Vendeur ? → PRO
          </a>
          {showAdmin ? (
            <>
              <a href="#/admin" className="text-wakhma-highlight font-bold text-sm px-4 py-2 rounded-xl bg-wakhma-highlight/10 border border-wakhma-highlight/20 hover:bg-wakhma-highlight/20 transition">
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
        <div className="md:hidden flex items-center gap-3">
          <a href="#feed" className="flex items-center gap-1.5 bg-wakhma-highlight/10 text-wakhma-highlight border border-wakhma-highlight/20 px-3 py-1.5 rounded-lg text-xs font-bold">
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

      <div className="bg-wakhma-secondary/80 text-center py-2.5 text-sm font-medium tracking-wide border-y border-wakhma-accent/10">
        <span className="text-wakhma-text">Poste ce que tu veux.</span>{' '}
        <span className="text-wakhma-highlight font-semibold">Gratos.</span>
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
            <a href="#post" onClick={() => setMenuOpen(false)} className="bg-gradient-to-r from-wakhma-highlight to-emerald-600 text-white font-bold py-3.5 px-5 rounded-xl text-center text-sm">✏️ Déposer annonce</a>

            <div className="rounded-xl p-4 mt-1 bg-wakhma-highlight/5 border border-wakhma-highlight/15">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <span className="font-bold text-sm text-wakhma-highlight">Tu es vendeur ?</span>
              </div>
              <p className="text-xs text-wakhma-muted mb-3">Sur Wakhma PRO, achète des points A PARTIR DE 1000F pour révéler les numéros WhatsApp des clients.</p>
              <a href="https://wakhma-pro.lu" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}
                className="block text-center bg-gradient-to-r from-wakhma-highlight to-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-sm">
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
                <a href="#/admin" onClick={() => setMenuOpen(false)} className="text-wakhma-highlight font-bold py-3 px-5 rounded-xl bg-wakhma-highlight/10 border border-wakhma-highlight/20 text-sm">ADMIN 🔒</a>
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
