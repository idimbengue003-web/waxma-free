export default function Footer() {
  return (
    <footer className="bg-wakhma-primary border-t border-wakhma-accent/20 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-wakhma-highlight to-emerald-600 text-white font-extrabold text-lg px-4 py-1.5 rounded-lg">Wakhma</div>
          <span className="text-wakhma-muted text-sm">Le marché rapide de Dakar</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://wakhma-pro.lu" target="_blank" rel="noopener noreferrer" className="text-wakhma-highlight text-sm font-bold hover:underline">Wakhma Pro →</a>
          <span className="text-wakhma-muted text-xs">© 2024 Wakhma</span>
        </div>
      </div>
    </footer>
  );
}
