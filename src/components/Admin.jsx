import { useState } from 'react';
import { isAdmin, loginAdmin, logoutUser } from '../utils/storage';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(isAdmin());
  const [error, setError] = useState('');
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = loginAdmin(password);
    if (success) {
      setAuthenticated(true);
      // Load demands after auth
      try {
        const res = await fetch('/api/get-demandes');
        const data = await res.json();
        if (data.demands) setDemands(data.demands);
      } catch {}
    } else {
      setError('Mot de passe incorrect');
    }
    setLoading(false);
  };

  const loadDemands = async () => {
    try {
      const res = await fetch('/api/get-demandes');
      const data = await res.json();
      if (data.demands) setDemands(data.demands);
    } catch {}
  };

  const handleLogout = () => {
    logoutUser();
    setAuthenticated(false);
    window.location.hash = '#/';
  };

  if (!authenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔒</div>
            <h1 className="text-xl font-black text-gray-800">Admin Wakhma Free</h1>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 p-4 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe admin" autoFocus
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wakhma-highlight focus:outline-none text-sm" />
            <button type="submit" disabled={loading}
              className="w-full bg-wakhma-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50">
              {loading ? 'Connexion...' : 'Connexion'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">Admin Wakhma Free</h1>
          <div className="flex items-center gap-3">
            <button onClick={loadDemands} className="text-sm text-wakhma-highlight font-semibold hover:underline">Rafraîchir</button>
            <button onClick={handleLogout} className="text-sm text-red-500 font-semibold hover:underline">Déconnexion</button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b"><h2 className="font-bold text-gray-800">Demandes ({demands.length})</h2></div>
          {demands.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Aucune demande</div>
          ) : (
            <div className="divide-y">
              {demands.map(d => (
                <div key={d.id} className="p-4 flex items-start gap-3 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm text-gray-800">{d.title}</span>
                    <p className="text-xs text-gray-500">{d.quartier} · {d.category} · {d.whatsapp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
