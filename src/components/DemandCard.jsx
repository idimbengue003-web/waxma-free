import { formatFCFA, timeAgo, maskPhone, URGENCY_OPTIONS } from '../utils/storage';

export default function DemandCard({ demand }) {
  const urgencyInfo = URGENCY_OPTIONS.find(o => o.value === demand.urgency);

  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up card-hover">
      {demand.photo && (
        <div className="relative">
          <img src={demand.photo} alt={demand.title} className="w-full h-48 object-cover" />
          <span className="absolute top-3 left-3 bg-wakhma-highlight/90 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-sm">
            {demand.category}
          </span>
          {urgencyInfo && (
            <span className="absolute top-3 right-3 bg-orange-500/90 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-sm">
              {urgencyInfo.label}
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        {!demand.photo && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-lg bg-wakhma-highlight/10 text-wakhma-highlight border border-wakhma-highlight/20">
              {demand.category}
            </span>
            {urgencyInfo && (
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
                {urgencyInfo.label}
              </span>
            )}
          </div>
        )}

        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
          <span className="text-wakhma-highlight">Je cherche</span> {demand.title.replace(/^Je cherche\s*/i, '')}
        </h3>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-gray-400 text-xs">{timeAgo(demand.createdAt)}</span>
          {demand.quartier && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-wakhma-highlight/10 text-wakhma-highlight">
              {demand.quartier}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{demand.description}</p>

        {demand.budget > 0 && (
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <span className="text-base">💰</span>
            <span className="font-bold text-emerald-700 text-base">{formatFCFA(demand.budget)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">📱</span>
            <span className="text-sm font-mono text-gray-500">{maskPhone(demand.whatsapp)}</span>
          </div>
          <a href="https://wakhma-pro.lu" target="_blank" rel="noopener noreferrer"
            className="text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-wakhma-highlight to-emerald-600 text-white hover:shadow-lg transition">
            Voir sur PRO →
          </a>
        </div>
      </div>
    </article>
  );
}
