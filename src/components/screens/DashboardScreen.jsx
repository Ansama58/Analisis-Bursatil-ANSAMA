import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  AlertTriangle, 
  ArrowUpRight, 
  Sparkles, 
  Bell, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Target,
  RefreshCw,
  Clock,
  Database
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';

export default function DashboardScreen({ setCurrentScreen }) {
  const { 
    stocks, 
    selectTicker, 
    marketNews, 
    freshnessAlerts, 
    isLiveMode, 
    lastSync, 
    refreshAll, 
    isLoading 
  } = useMarket();

  const stockList = Object.values(stocks);
  const topStocks = [...stockList].sort((a, b) => b.ansamaScore - a.ansamaScore).slice(0, 4);
  const bottomStocks = [...stockList].sort((a, b) => a.ansamaScore - b.ansamaScore).slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Welcome & Terminal status banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-[#0b132b] to-slate-900 border border-blue-900/40 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-blue-950/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              ANSAMA ANALYTICS v1.0
            </span>
            <span className="text-xs text-slate-400">Terminal Cuantitativo & IA Multiactor &bull; Sistema Validado</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Centro de Análisis Bursátil Inteligente</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Supervisión simultánea de renta variable estadounidense (NASDAQ/NYSE) y europea (IBEX 35, DAX, Euronext).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshAll}
            disabled={isLoading}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-semibold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
            title="Refrescar cotizaciones, índices y noticias del terminal"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refrescar Todo</span>
          </button>

          <button
            onClick={() => {
              selectTicker('NVDA');
              setCurrentScreen('ai-report');
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Ver Informe IA Destacado (NVDA)</span>
          </button>
        </div>
      </div>

      {/* Data Freshness & Outdated Data Notices (PDF Page 10 requirement) */}
      {freshnessAlerts && freshnessAlerts.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-start justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-mono uppercase font-bold text-amber-300">Aviso de Integridad de Datos:</strong>
              <div className="mt-0.5 text-amber-200/90 text-[11px]">
                Se detectaron {freshnessAlerts.length} valores con cotizaciones almacenadas con más de 15 minutos de antigüedad. Se recomienda refrescar para sincronizar con Twelve Data / Finnhub.
              </div>
            </div>
          </div>
          <button
            onClick={refreshAll}
            className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 text-[11px] font-mono font-bold rounded border border-amber-700/60 shrink-0"
          >
            Actualizar Datos Ahora
          </button>
        </div>
      )}

      {/* Grid: Top Scores & Bottom Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top ANSAMA Scores */}
        <div className="lg:col-span-2 terminal-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Valores con Mejores Puntuaciones ANSAMA</h2>
                <p className="text-[11px] text-slate-400">Ponderación cuantitativa: Técnico 25%, Fundamental 25%, Sentimiento 15%, Valoración 15%</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentScreen('screener')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              <span>Ver Screener</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {topStocks.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => {
                  selectTicker(stock.symbol);
                  setCurrentScreen('analyzer');
                }}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all hover:shadow-md hover:bg-slate-850 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {stock.exchange}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5 font-medium">{stock.name}</div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">
                      Sector: <span className="text-slate-400">{stock.sector}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-mono text-xl font-black text-emerald-400">
                        {stock.ansamaScore}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">/100</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 inline-block mt-0.5">
                      {stock.bias}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <div className="text-white font-semibold">
                    {typeof stock.price === 'number' ? stock.price.toFixed(2) : stock.price} {stock.currency}
                    <span className={`ml-2 text-[11px] ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stock.change >= 0 ? '+' : ''}{typeof stock.changePercent === 'number' ? stock.changePercent.toFixed(2) : stock.changePercent}%
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-1">
                    <span>Upside:</span>
                    <strong className="text-emerald-400">+{stock.probabilities?.targetReturnPotential}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Watchlist / Peores Puntuaciones */}
        <div className="terminal-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Vigilancia de Riesgo ANSAMA</h2>
                <p className="text-[11px] text-slate-400">Valores con señales bajistas o deterioro fundamental</p>
              </div>
            </div>

            <div className="space-y-3">
              {bottomStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => {
                    selectTicker(stock.symbol);
                    setCurrentScreen('analyzer');
                  }}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-rose-900/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-xs text-white flex items-center gap-1.5">
                        <span>{stock.symbol}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({stock.name})</span>
                      </div>
                      <div className="text-[11px] text-rose-400 font-mono mt-0.5">
                        Alerta: Deuda elevada y compresión de múltiplos
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black font-mono text-rose-400">
                        {stock.ansamaScore}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">/100</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Opportunity Alerts Callout */}
          <div className="mt-4 p-3.5 rounded-xl bg-blue-950/40 border border-blue-900/40">
            <div className="flex items-center gap-2 text-blue-300 font-bold text-xs mb-1">
              <Bell className="w-3.5 h-3.5 text-cyan-400" />
              <span>Oportunidad Detectada en Tiempo Real</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong>NVDA</strong> ha rebotado en soporte de 180,20$ con incremento de volumen (+18%) y confirmación de cruce MACD.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Latest AI Reports and Live Global Financial News Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest analyses conducted */}
        <div className="terminal-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Últimos Informes Generados por la IA</span>
            </h3>
            <button
              onClick={() => setCurrentScreen('history')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium font-mono"
            >
              Auditoría Histórica &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {stockList.slice(0, 4).map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => {
                  selectTicker(stock.symbol);
                  setCurrentScreen('ai-report');
                }}
                className="py-3 flex items-center justify-between hover:bg-slate-900/60 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-blue-400">
                    {stock.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{stock.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Probabilidad + retorno: <span className="text-emerald-400 font-bold">{stock.probabilities?.positiveReturn}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-white">{stock.price} {stock.currency}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    Score {stock.ansamaScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Financial News Feed (Dynamic from Finnhub / Curated Feed) */}
        <div className="terminal-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Noticias Relevantes & Eventos de Mercado</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {isLiveMode ? '● Finnhub Live API' : '● Feed Curado ANSAMA'}
            </span>
          </div>

          <div className="space-y-3">
            {marketNews.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="text-blue-400 font-bold uppercase">{item.source || item.tag}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{item.time}</span>
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-100 mt-1 leading-snug">
                  {item.title}
                </h4>
                {item.summary && (
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                )}
                {item.url && (
                  <div className="pt-1.5 flex justify-end">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Leer artículo</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
