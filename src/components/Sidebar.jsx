import React from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  BrainCircuit, 
  ListOrdered, 
  ScanSearch, 
  Scale, 
  History, 
  Database, 
  ShieldCheck, 
  DownloadCloud,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function Sidebar({ currentScreen, setCurrentScreen, openModal }) {
  const navItems = [
    { id: 'dashboard', label: '1. Panel Principal', icon: LayoutDashboard, badge: 'En Vivo' },
    { id: 'analyzer', label: '2. Analizador de Valores', icon: LineChart },
    { id: 'ai-report', label: '3. Resultado IA & Debate', icon: BrainCircuit, highlight: true },
    { id: 'watchlist', label: '4. Lista de Seguimiento', icon: ListOrdered },
    { id: 'screener', label: '5. Buscador Oportunidades', icon: ScanSearch },
    { id: 'comparator', label: '6. Comparador Empresas', icon: Scale },
    { id: 'history', label: '7. Histórico y Resultados', icon: History, badge: 'Auditoría' },
  ];

  return (
    <aside className="w-64 bg-[#090f20] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none z-30">
      <div>
        {/* Logo & Identity */}
        <div className="p-5 border-b border-slate-800/80 bg-[#070b18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#0b132b] rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-base text-white font-mono">ANSAMA</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">PRO</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">ANALYTICS &bull; Terminal IA</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
            Módulos del Sistema
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                } ${item.highlight && !isActive ? 'hover:border-blue-500/20 hover:border' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                    isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom system utilities & status */}
      <div className="p-3 border-t border-slate-800/80 bg-[#070b18]/60 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Configuración & Datos
        </div>
        <button
          onClick={() => openModal('aiconfig')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-cyan-300 hover:text-cyan-200 hover:bg-blue-950/40 rounded-md transition-colors font-medium"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
          <span>Pesos & Motor IA (Etapa 3)</span>
        </button>
        <button
          onClick={() => openModal('sources')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span>Fuentes de Datos</span>
        </button>
        <button
          onClick={() => openModal('backup')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors"
        >
          <DownloadCloud className="w-3.5 h-3.5 text-slate-400" />
          <span>Copia de Seguridad</span>
        </button>
        <button
          onClick={() => openModal('auth')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Seguridad de Acceso</span>
        </button>

        {/* Engine status indicator */}
        <div className="mt-3 pt-3 border-t border-slate-800 px-3 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[10px] text-slate-300">MOTOR CUÁNTICO IA</span>
          </div>
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
        </div>
      </div>
    </aside>
  );
}
