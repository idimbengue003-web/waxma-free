import { useState } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/get-demandes');
      const data = await res.json();
      if (data.demands) setDemands(data.demands);
      setAuthenticated(true);
    } catch { setAuthenticated(true); }
    setLoading(false);
  };

  const loadDemands = async () => {
    try {
      const res = await fetch('/api/get-demandes');
      const data = await res.json();
      if (data.demands) setDemands(data.demands);
    } catch {}
  };

  if (!authenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe admin" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wakhma-highlight focus:outline-none text-sm" />
            <button type="submit" disabled={loading}
              className="w-full bg-wakhma-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
              Connexion
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
          <button onClick={loadDemands} className="text-sm text-wakhma-highlight font-semibold hover:underline">Rafraîchir</button>
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
