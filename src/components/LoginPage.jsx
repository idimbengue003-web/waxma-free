import { useState } from 'react';
import { loginAdmin, getUser } from '../utils/storage';

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small delay to feel like real auth
    await new Promise(r => setTimeout(r, 500));

    const success = loginAdmin(password);
    if (success) {
      onLogin?.();
      window.location.hash = '#/admin';
    } else {
      setError('Mot de passe incorrect');
    }
    setLoading(false);
  };

  const user = getUser();

  if (user && user.role === 'admin') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-black text-gray-800 mb-3">Connecté en tant qu'admin</h1>
          <a href="#/admin" className="inline-block bg-wakhma-primary text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition">
            Accéder au Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-black text-gray-800">Connexion</h1>
          <p className="text-gray-500 text-sm mt-2">Réservé à l'administrateur</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm text-center font-semibold">
              {error}
            </div>
          )}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe admin" autoFocus
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wakhma-highlight focus:outline-none text-sm" />
          <button type="submit" disabled={loading || !password}
            className="w-full bg-wakhma-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">
          Accès réservé à l'administrateur du site
        </p>
      </div>
    </div>
  );
}
