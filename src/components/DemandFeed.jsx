import { useState, useEffect } from 'react';
import DemandCard from './DemandCard';
import { getDemandsLocal, CATEGORIES } from '../utils/storage';

export default function DemandFeed() {
  const [demands, setDemands] = useState(getDemandsLocal());
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Toutes');

  useEffect(() => {
    const local = getDemandsLocal();
    // Fetch from API too
    fetch('/api/get-demandes')
      .then(r => r.json())
      .then(data => {
        const apiDemands = data.demands || [];
        // Merge: API first, then local that aren't in API
        const apiIds = new Set(apiDemands.map(d => d.id));
        const merged = [...apiDemands, ...local.filter(d => !apiIds.has(d.id))];
        setDemands(merged);
      })
      .catch(() => setDemands(local));
  }, []);

  // Get unique categories from demands
  const categories = ['Toutes', ...new Set(demands.map(d => d.category).filter(Boolean))];

  const filtered = demands.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || (d.quartier && d.quartier.toLowerCase().includes(q));
    const matchCat = selectedCat === 'Toutes' || d.category === selectedCat;
    return matchSearch && matchCat && d.status !== 'rejected';
  });

  return (
    <div className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold gradient-text">Demandes récentes</h2>
          <p className="text-waxma-muted mt-1 text-sm">Les acheteurs cherchent, les vendeurs trouvent.</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, quartier, description..."
            className="w-full pl-12 pr-5 py-3.5 rounded-xl border-2 border-gray-200 focus:border-waxma-highlight focus:outline-none text-sm bg-white" />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.slice(0, 12).map(cat => (
            <button key={cat} onClick={() => setSelectedCat(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition ${
                selectedCat === cat
                  ? 'bg-waxma-highlight text-white shadow-lg shadow-waxma-highlight/20'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-waxma-highlight/30'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(d => <DemandCard key={d.id} demand={d} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-5">📋</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Aucune demande</h3>
            <p className="text-gray-500">Les demandes apparaîtront ici quand des clients posteront.</p>
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">{filtered.length} demande{filtered.length > 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
  );
}
