import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUpDown, 
  Trash2, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Filter,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';

export default function WatchlistScreen({ setCurrentScreen }) {
  const { stocks, selectTicker } = useMarket();
  const [sortBy, setSortBy] = useState('ansamaScore'); // 'ansamaScore', 'upside', 'price', 'name'
  const [filterMarket, setFilterMarket] = useState('ALL'); // 'ALL', 'US', 'Europe'

  const stockList = Object.values(stocks);

  const filtered = stockList.filter(s => {
    if (filterMarket === 'ALL') return true;
    return s.market === filterMarket;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'ansamaScore') return b.ansamaScore - a.ansamaScore;
    if (sortBy === 'upside') return b.probabilities.targetReturnPotential - a.probabilities.targetReturnPotential;
    if (sortBy === 'technical') return b.scores.technical - a.scores.technical;
    if (sortBy === 'fundamental') return b.scores.fundamental - a.scores.fundamental;
    if (sortBy === 'price') return b.price - a.price;
    return a.symbol.localeCompare(b.symbol);
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="terminal-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Lista de Seguimiento ANSAMA</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono border border-blue-800">
              {sorted.length} Activos
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitorización en tiempo real con puntuaciones desglosadas por análisis técnico y fundamental.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Market filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setFilterMarket('ALL')}
              className={`px-3 py-1.5 rounded font-mono font-medium transition-colors ${
                filterMarket === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterMarket('US')}
              className={`px-3 py-1.5 rounded font-mono font-medium transition-colors ${
                filterMarket === 'US' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              EE.UU.
            </button>
            <button
              onClick={() => setFilterMarket('Europe')}
              className={`px-3 py-1.5 rounded font-mono font-medium transition-colors ${
                filterMarket === 'Europe' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Europa
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none font-mono"
            >
              <option value="ansamaScore">Score ANSAMA (Mayor a Menor)</option>
              <option value="upside">Potencial Alcista (%)</option>
              <option value="technical">Puntuación Técnica</option>
              <option value="fundamental">Puntuación Fundamental</option>
              <option value="price">Precio de Cotización</option>
            </select>
          </div>
        </div>
      </div>

      {/* Watchlist High Density Financial Table */}
      <div className="terminal-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070b18] text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th className="py-3 px-4">Empresa / Ticker</th>
                <th className="py-3 px-4 text-right">Cotización</th>
                <th className="py-3 px-4 text-right">Variación</th>
                <th className="py-3 px-4 text-center">Técnico</th>
                <th className="py-3 px-4 text-center">Fundamental</th>
                <th className="py-3 px-4 text-center">Score ANSAMA</th>
                <th className="py-3 px-4 text-right">Precio Obj.</th>
                <th className="py-3 px-4 text-right">Potencial</th>
                <th className="py-3 px-4 text-center">Sesgo IA</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-[#0a0f22]">
              {sorted.map((stock) => (
                <tr
                  key={stock.symbol}
                  className="hover:bg-slate-900/80 transition-colors group cursor-pointer"
                  onClick={() => {
                    selectTicker(stock.symbol);
                    setCurrentScreen('analyzer');
                  }}
                >
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-slate-800 font-mono font-bold text-xs text-blue-400 flex items-center justify-center shrink-0">
                        {stock.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="font-mono font-bold text-white text-xs group-hover:text-blue-400 transition-colors">
                          {stock.symbol}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-white whitespace-nowrap">
                    {typeof stock.price === 'number' ? stock.price.toFixed(2) : stock.price} {stock.currency}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className={`inline-flex items-center font-bold ${
                      stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {stock.change >= 0 ? '+' : ''}{typeof stock.changePercent === 'number' ? stock.changePercent.toFixed(2) : stock.changePercent}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-bold">
                      {stock.scores.technical}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-bold">
                      {stock.scores.fundamental}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-950/80 text-blue-300 border border-blue-700/60 font-black text-sm">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{stock.ansamaScore}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right text-slate-300">
                    {stock.targets?.targetPrice} {stock.currency}
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                    +{stock.probabilities?.targetReturnPotential}%
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                      {stock.bias}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        selectTicker(stock.symbol);
                        setCurrentScreen('ai-report');
                      }}
                      className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition-all font-sans text-[11px] font-semibold"
                    >
                      Informe IA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
