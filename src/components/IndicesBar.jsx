import React from 'react';
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export default function IndicesBar() {
  const { indices, isLiveMode, lastSync } = useMarket();

  return (
    <div className="h-10 bg-[#070b18] border-b border-slate-800/80 px-6 flex items-center justify-between overflow-x-auto no-scrollbar gap-6 shrink-0 text-xs">
      <div className="flex items-center gap-6 shrink-0">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full ${isLiveMode ? 'bg-emerald-500 animate-ping' : 'bg-cyan-500'}`}></span>
          <span>MERCADOS GLOBALES</span>
        </div>

        <div className="flex items-center gap-6 shrink-0 font-mono">
          {indices.map((index) => {
            const isPositive = index.change >= 0;
            return (
              <div key={index.symbol} className="flex items-center gap-2 group cursor-default">
                <span className="text-slate-400 font-semibold group-hover:text-slate-200 transition-colors">
                  {index.name}
                </span>
                <span className="text-white font-medium">
                  {typeof index.value === 'number' 
                    ? index.value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : index.value}
                </span>
                <span className={`flex items-center text-[11px] font-bold ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                  )}
                  {isPositive ? '+' : ''}{index.changePercent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono text-slate-500 shrink-0">
        <Clock className="w-3 h-3" />
        <span>Último tick: {lastSync}</span>
      </div>
    </div>
  );
}
