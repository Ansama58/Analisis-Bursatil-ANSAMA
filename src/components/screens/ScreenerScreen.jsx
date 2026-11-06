import React, { useState } from 'react';
import { 
  ScanSearch, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Flame, 
  Anchor, 
  Sparkles, 
  AlertTriangle, 
  ArrowDownRight,
  Globe,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { SCREENER_PRESETS, SCREENER_STOCKS } from '../../data/screenerData';
import { useMarket } from '../../context/MarketContext';

export default function ScreenerScreen({ setCurrentScreen }) {
  const { selectTicker } = useMarket();
  const [activePreset, setActivePreset] = useState('top_ansama');
  const [marketFilter, setMarketFilter] = useState('ALL'); // 'ALL', 'US', 'Europe'

  const currentPresetObj = SCREENER_PRESETS.find(p => p.id === activePreset);

  const filteredStocks = SCREENER_STOCKS.filter(stock => {
    // Check preset category
    const matchesCategory = stock.categories.includes(activePreset);
    if (!matchesCategory) return false;

    // Check market filter
    if (marketFilter === 'ALL') return true;
    return stock.market === marketFilter;
  });

  return (
    <div className="space-y-6">
      {/* Screener Header Banner */}
      <div className="terminal-card p-5 bg-[#0b132b] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-500/20 text-blue-400">
              <ScanSearch className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              MOTOR DE RASTREO CUANTITATIVO
            </span>
          </div>
          <h1 className="text-lg font-bold text-white mt-1">Buscador de Oportunidades de Inversión</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Filtrado automatizado sobre el universo de renta variable de Wall Street y Bolsas Europeas.
          </p>
        </div>

        {/* Region Selector (USA, Europa, Ambos) - Page 8 of PDF */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-400">Mercados:</span>
          <div className="flex items-center bg-slate-900 border border-slate-700 p-0.5 rounded-lg text-xs font-mono">
            <button
              onClick={() => setMarketFilter('ALL')}
              className={`px-3 py-1 rounded transition-colors ${
                marketFilter === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ambos
            </button>
            <button
              onClick={() => setMarketFilter('US')}
              className={`px-3 py-1 rounded transition-colors ${
                marketFilter === 'US' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              EE.UU.
            </button>
            <button
              onClick={() => setMarketFilter('Europe')}
              className={`px-3 py-1 rounded transition-colors ${
                marketFilter === 'Europe' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Europa
            </button>
          </div>
        </div>
      </div>

      {/* Preset Pills (Directly from Page 8 of PDF) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {SCREENER_PRESETS.map((preset) => {
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => setActivePreset(preset.id)}
              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-900/30'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-mono font-bold uppercase truncate">
                  {preset.name.split(' ')[0]} {preset.name.split(' ')[1] || ''}
                </span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
              </div>
              <div className="text-[11px] font-semibold text-slate-200 line-clamp-1">
                {preset.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Filter Description */}
      {currentPresetObj && (
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-white font-semibold font-mono">{currentPresetObj.name}:</span>
            <span className="text-slate-400">{currentPresetObj.description}</span>
          </div>
          <span className="font-mono text-[11px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            {filteredStocks.length} resultados encontrados
          </span>
        </div>
      )}

      {/* Screener Results Table */}
      <div className="terminal-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070b18] text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Ticker / Empresa</th>
                <th className="py-3 px-4">Mercado</th>
                <th className="py-3 px-4 text-right">Cotización</th>
                <th className="py-3 px-4 text-right">Variación 1D</th>
                <th className="py-3 px-4 text-center">Score ANSAMA</th>
                <th className="py-3 px-4 text-right">PER (TTM)</th>
                <th className="py-3 px-4 text-right">EV / EBITDA</th>
                <th className="py-3 px-4 text-right">Crecimiento EPS</th>
                <th className="py-3 px-4 text-center">Momentum</th>
                <th className="py-3 px-4 text-center">Zona Soporte</th>
                <th className="py-3 px-4 text-right">Analizar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-[#0a0f22]">
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="hover:bg-slate-900/90 transition-colors cursor-pointer group"
                    onClick={() => {
                      selectTicker(stock.symbol);
                      setCurrentScreen('analyzer');
                    }}
                  >
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-xs group-hover:text-blue-400 transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-slate-400 text-[11px] truncate max-w-[130px]">
                          {stock.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono">
                        {stock.exchange}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right text-white font-bold">
                      {stock.price}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className={stock.changePercent >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded font-black text-xs ${
                        stock.ansamaScore >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' :
                        stock.ansamaScore >= 70 ? 'bg-blue-950 text-blue-300 border border-blue-800/60' :
                        'bg-rose-950 text-rose-400 border border-rose-800/60'
                      }`}>
                        {stock.ansamaScore}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right text-slate-300">
                      {stock.per}x
                    </td>

                    <td className="py-3 px-4 text-right text-slate-300">
                      {stock.evEbitda}x
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-cyan-300">
                      {stock.epsGrowth}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        stock.momentum.includes('Alto') ? 'text-emerald-400 bg-emerald-950/60' :
                        stock.momentum.includes('Bajo') ? 'text-rose-400 bg-rose-950/60' : 'text-slate-400 bg-slate-800'
                      }`}>
                        {stock.momentum}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {stock.nearSupport ? (
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          SOPORTE ({stock.distanceToSupport})
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          {stock.distanceToSupport}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          selectTicker(stock.symbol);
                          setCurrentScreen('analyzer');
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors text-[11px] font-sans"
                      >
                        Examinar &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="py-8 text-center text-slate-500 text-xs">
                    No hay valores que coincidan con los filtros seleccionados para este mercado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
