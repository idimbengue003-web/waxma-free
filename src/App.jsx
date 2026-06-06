import { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import DemandForm from './components/DemandForm';
import DemandFeed from './components/DemandFeed';
import Admin from './components/Admin';
import LoginPage from './components/LoginPage';
import { isAdmin } from './utils/storage';

function getRoute() {
  const hash = window.location.hash || '#/';
  return hash.replace('#/', '').replace('#', '') || 'home';
}

export default function App() {
  const [route, setRoute] = useState(getRoute());
  const [newDemand, setNewDemand] = useState(null);
  const [authVersion, setAuthVersion] = useState(0);

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const renderPage = () => {
    switch (route) {
      case 'post': return <DemandForm onPosted={setNewDemand} />;
      case 'feed': return <DemandFeed key={Date.now()} />;
      case 'admin':
        if (!isAdmin()) {
          return (
            <div className="min-h-[50vh] flex items-center justify-center px-4">
              <div className="text-center max-w-sm">
                <div className="text-6xl mb-4">🚫</div>
                <h1 className="text-2xl font-black text-red-600 mb-3">Accès refusé</h1>
                <p className="text-gray-500 mb-6">Seul l'administrateur peut accéder à cette page.</p>
                <a href="#/" className="inline-block bg-wakhma-primary text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition">
                  Retour à l'accueil
                </a>
              </div>
            </div>
          );
        }
        return <Admin />;
      case 'login': return <LoginPage onLogin={() => setAuthVersion(v => v + 1)} />;
      default: return <Home onPosted={setNewDemand} />;
    }
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>Wakhma Free — Le marché rapide de Dakar</title>
          <meta name="description" content="Poste ce que tu veux acheter à Dakar. Gratos." />
        </Helmet>
        <Header key={authVersion} />
        <main className="flex-1">{renderPage()}</main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

function Home({ onPosted }) {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-wakhma-primary via-wakhma-secondary to-wakhma-accent py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-wakhma-highlight/10 text-wakhma-highlight text-xs font-bold px-4 py-1.5 rounded-lg border border-wakhma-highlight/20 mb-6 uppercase tracking-wider">
            100% Gratuit
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Poste ce que tu veux.<br />
            <span className="gradient-text">Les vendeurs te trouvent.</span>
          </h1>
          <p className="text-wakhma-muted text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Wakhma Free, le marché rapide de Dakar. Dis ce que tu cherches, reçois des offres sur WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#post" className="bg-gradient-to-r from-wakhma-highlight to-emerald-600 text-white font-bold px-10 py-4 rounded-xl hover:shadow-xl hover:shadow-wakhma-highlight/20 transition-all text-lg animate-pulse-glow">
              + Poster une demande
            </a>
            <a href="#feed" className="bg-white/10 text-white font-bold px-10 py-4 rounded-xl hover:bg-white/20 transition-all border border-white/20 text-lg">
              Voir les demandes
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-12">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '📝', title: '1. Poste ta demande', desc: 'Décris ce que tu cherches : téléphone, clim, frigo... Dis ton budget et ton quartier.' },
              { emoji: '👀', title: '2. Les vendeurs voient', desc: 'Les vendeurs PRO consultent ta demande et décident de te contacter.' },
              { emoji: '💬', title: '3. Reçois sur WhatsApp', desc: 'Un vendeur t\'écrit directement sur WhatsApp. Tu négocies, tu choisis.' },
            ].map(step => (
              <div key={step.title} className="bg-white rounded-2xl p-8 text-center shadow-lg card-hover">
                <div className="text-5xl mb-4">{step.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA vendeur */}
      <section className="py-16 px-4 bg-wakhma-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Tu es vendeur ?</h2>
          <p className="text-wakhma-muted mb-8">Sur Wakhma PRO, accède aux demandes des clients et révèle leurs numéros WhatsApp pour les contacter directement.</p>
          <a href="https://wakhma-pro.lu" target="_blank" rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-wakhma-highlight to-emerald-600 text-white font-bold px-10 py-4 rounded-xl hover:shadow-xl transition-all text-lg">
            Wakhma PRO →
          </a>
        </div>
      </section>
    </div>
  );
}
