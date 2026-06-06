import { formatFCFA, timeAgo, maskPhone, URGENCY_OPTIONS } from '../utils/storage';

export default function DemandCard({ demand }) {
  const urgencyInfo = URGENCY_OPTIONS.find(o => o.value === demand.urgency);
  const displayTitle = demand.title.replace(/^Je cherche\s*/i, '');

  return (
    <article className="block bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:border-orange-400 transition-all duration-200 overflow-hidden">
      {/* IMAGE 4:3 style Leboncoin */}
      <div className="relative w-full h-[180px] bg-gray-100">
        {demand.photo ? (
          <img src={demand.photo} alt={displayTitle} className="w-full h-full object-cover rounded-t-xl" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-wakhma-highlight/10 to-emerald-50 rounded-t-xl">
            <span className="text-4xl">🔍</span>
          </div>
        )}

        {/* Badge Catégorie */}
        <span className="absolute top-2 left-2 bg-wakhma-highlight/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
          {demand.category}
        </span>

        {/* Badge Urgent */}
        {urgencyInfo && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
            {demand.urgency === 'urgent' ? 'URGENT' : urgencyInfo.label}
          </span>
        )}
      </div>

      {/* CONTENU */}
      <div className="p-4">
        {/* TITRE 2 lignes max */}
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-1">
          <span className="text-wakhma-highlight">Je cherche</span> {displayTitle}
        </h3>

        {/* BUDGET gros orange style Leboncoin */}
        {demand.budget > 0 && (
          <p className="text-xl font-bold text-orange-500 mb-2">
            {formatFCFA(demand.budget)}
          </p>
        )}

        {/* DESCRIPTION 2 lignes max */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {demand.description}
        </p>

        {/* QUARTIER + DATE en bas */}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span className="flex items-center gap-1">
            📍 {demand.quartier || 'Dakar'}
          </span>
          <span>{timeAgo(demand.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
