import { useState } from 'react';
import { CATEGORIES, QUARTIERS, generateId, saveDemandLocal, isLimitReached, incrementWeeklyCount, getStoredPhone, setStoredPhone, DEMAND_LIMIT_PER_WEEK } from '../utils/storage';

export default function DemandForm({ onPosted }) {
  const [form, setForm] = useState({
    category: '', title: '', description: '', budget: '', whatsapp: getStoredPhone(), quartier: '', photo: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError('Photo max 2 Mo'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) { setError('Titre obligatoire'); return; }
    if (!form.description.trim()) { setError('Description obligatoire'); return; }
    if (!form.whatsapp.trim() || form.whatsapp.trim().length < 9) { setError('Numéro WhatsApp valide obligatoire'); return; }
    if (!/^7[0-8]\d{7}$/.test(form.whatsapp.trim())) { setError('Numéro WhatsApp invalide (format 77/78/76/70...)'); return; }

    if (isLimitReached(form.whatsapp.trim())) {
      setError(`Limite ${DEMAND_LIMIT_PER_WEEK}/sem atteinte, revenez lundi.`);
      return;
    }

    setLoading(true);

    const demand = {
      id: generateId(),
      category: form.category.trim() || 'Autre',
      title: form.title.trim(),
      description: form.description.trim(),
      budget: parseInt(form.budget) || 0,
      photo: form.photo,
      whatsapp: form.whatsapp.trim(),
      quartier: form.quartier.trim(),
      createdAt: new Date().toISOString(),
      status: 'active',
      source: 'free',
    };

    saveDemandLocal(demand);
    setStoredPhone(form.whatsapp.trim());
    incrementWeeklyCount(form.whatsapp.trim());

    // Best-effort API push
    try {
      await fetch('/api/post-demande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demand),
      });
    } catch {}

    setSuccess(true);
    setLoading(false);
    onPosted?.(demand);
  };

  if (success) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="text-6xl mb-5">✅</div>
          <h2 className="text-2xl font-black gradient-text mb-3">Demande postée !</h2>
          <p className="text-wakhma-muted mb-6">Les vendeurs te contacteront sur WhatsApp.</p>
          <a href="#feed" className="inline-block bg-gradient-to-r from-wakhma-highlight to-emerald-600 text-white font-bold px-8 py-3.5 rounded-xl hover:shadow-lg transition">
            Voir les demandes
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black gradient-text">Poster une demande</h1>
          <p className="text-wakhma-muted mt-2">Décris ce que tu cherches, les vendeurs te trouvent.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
          {error && <div className="bg-red-50 border-2 border-red-300 text-red-700 p-4 rounded-xl text-sm text-center font-medium">{error}</div>}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Catégorie</label>
            <input type="text" name="category" value={form.category} onChange={handleChange}
              list="cat-suggestions" placeholder="Ex: Téléphones, Clim, Frigo..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wakhma-highlight focus:outline-none text-sm" />
            <datalist id="cat-suggestions">
              {CATEGORIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Titre *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="Ex: iPhone 15 Pro Max, Clim 12000 BTU..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wakhma-highlight focus:outline-none text-sm" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="Décris ce que tu cherches en détail..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wakhma-highlight focus:outline-none text-sm resize-none" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Budget (FCFA)</label>
            <input type="number" name="budget" value={form.budget} onChange={handleChange}
              placeholder="Ex: 850000"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wakhma-highlight focus:outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Quartier (Dakar)</label>
            <input type="text" name="quartier" value={form.quartier} onChange={handleChange}
              list="quartier-suggestions" placeholder="Ex: Almadies, Médina..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wakhma-highlight focus:outline-none text-sm" />
            <datalist id="quartier-suggestions">
              {QUARTIERS.map(q => <option key={q} value={q} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">WhatsApp *</label>
            <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange}
              placeholder="77 000 00 00"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wakhma-highlight focus:outline-none text-sm" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Photo (optionnel, max 2 Mo)</label>
            <input type="file" accept="image/*" onChange={handlePhoto}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-wakhma-highlight focus:outline-none text-sm" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-wakhma-highlight to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-wakhma-highlight/20 transition disabled:opacity-60 text-sm">
            {loading ? 'Envoi...' : 'Poster ma demande'}
          </button>

          <p className="text-xs text-gray-400 text-center">Limite : {DEMAND_LIMIT_PER_WEEK} demandes par semaine par numéro WhatsApp</p>
        </form>
      </div>
    </div>
  );
}
