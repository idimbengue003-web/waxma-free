export default function Footer() {
  return (
    <footer className="bg-wakhma-primary border-t-4 border-orange-500 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-extrabold text-lg px-4 py-1.5 rounded-lg">Wakhma</div>
          <div className="flex flex-col">
            <span className="text-orange-400 font-black text-xs uppercase tracking-widest">FREE</span>
            <span className="text-wakhma-muted text-xs">Pour les acheteurs</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://wakhma-pro.lu" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold text-pro-highlight bg-pro-highlight/10 border border-pro-highlight/20 px-4 py-2 rounded-lg hover:bg-pro-highlight/20 transition">
            🏪 Wakhma PRO → <span className="text-xs font-normal text-gray-400">Pour les vendeurs</span>
          </a>
          <span className="text-wakhma-muted text-xs">© 2024 Wakhma</span>
        </div>
      </div>
    </footer>
  );
}
