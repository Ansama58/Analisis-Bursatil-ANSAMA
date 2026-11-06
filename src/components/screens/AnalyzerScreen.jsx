import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  ShieldAlert, 
  Activity, 
  Sparkles, 
  BarChart2, 
  DollarSign, 
  Compass, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Database,
  Clock,
  RefreshCw,
  FileText,
  ExternalLink,
  Users,
  Building2,
  PlusCircle
} from 'lucide-react';
import FinancialChart from '../FinancialChart';
import { useMarket } from '../../context/MarketContext';

export default function AnalyzerScreen({ setCurrentScreen }) {
  const { 
    currentStock, 
    selectTicker, 
    selectedTicker, 
    isLoading, 
    refreshActiveStock, 
    lastSync, 
    isLiveMode,
    aiWeights,
    recordRecommendation,
    selectedHorizon
  } = useMarket();

  const [timeHorizon, setTimeHorizon] = useState('3M');
  const [recordedSuccess, setRecordedSuccess] = useState(false);
  const stock = currentStock;

  const quickTickers = ['NVDA', 'MSFT', 'IBE', 'ITX', 'AMZN', 'SAN', 'SAP'];

  return (
    <div className="space-y-6">
      {/* Top Asset Banner & Quick Selection */}
      <div className="terminal-card p-5 bg-[#0b132b] border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-800 flex items-center justify-center font-mono font-black text-xl text-white shadow-lg shadow-blue-900/40">
            {stock.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white font-mono">{stock.symbol}</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                {stock.exchange} &bull; {stock.market === 'US' ? 'EE.UU.' : 'EUROPA'}
              </span>
              <span className="text-xs text-slate-400 font-medium">| {stock.sector}</span>
            </div>
            <div className="text-sm text-slate-300 font-medium mt-0.5">{stock.name}</div>
          </div>
        </div>

        {/* Quick ticker switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs text-slate-500 font-mono mr-1">RÁPIDO:</span>
          {quickTickers.map(t => {
            const isSelected = (selectedTicker || 'NVDA').toUpperCase().startsWith(t);
            return (
              <button
                key={t}
                onClick={() => selectTicker(t)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Action Button to AI Report */}
        <button
          onClick={() => setCurrentScreen('ai-report')}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-950/40 transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Ver Debate de Agentes IA</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>

      {/* Connectivity & Data Provenance Bar (Etapa 2) */}
      <div className="bg-[#090f23] border border-slate-800 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Fuente Activa:</span>
            <strong className="text-white font-bold">{stock._dataSource || (isLiveMode ? 'Twelve Data & Finnhub' : 'Demostración Calibrada')}</strong>
          </span>

          <span className="text-slate-600 hidden sm:inline">&bull;</span>

          <span className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Última sincronización:</span>
            <strong className="text-slate-200">{stock._lastUpdated || lastSync}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            stock._isLive 
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80' 
              : 'bg-amber-950 text-amber-400 border border-amber-800/80'
          }`}>
            {stock._isLive ? '● COTIZACIÓN EN VIVO' : '● RESPALDO CALIBRADO'}
          </span>

          <button
            onClick={refreshActiveStock}
            disabled={isLoading}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded flex items-center gap-1.5 transition-colors text-[11px] disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refrescar</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Grid: Price & Chart on Left, ANSAMA Score & Execution Targets on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Candlestick Chart & Details */}
        <div className="lg:col-span-2 space-y-6">
          <FinancialChart
            stock={stock}
            timeHorizon={timeHorizon}
            onTimeHorizonChange={setTimeHorizon}
          />

          {/* Technical and Fundamental Summary Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Technical Indicators Box */}
            <div className="terminal-card p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Indicadores Técnicos Clave</h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-cyan-400">
                  {stock.scores?.technical}/100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">RSI 14 SESIONES</span>
                  <span className={`font-bold ${
                    stock.technicalMetrics?.rsi14 > 70 ? 'text-amber-400' : stock.technicalMetrics?.rsi14 < 35 ? 'text-emerald-400' : 'text-slate-200'
                  }`}>
                    {stock.technicalMetrics?.rsi14}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">MACD (12,26,9)</span>
                  <span className="text-slate-200 font-bold truncate block">{stock.technicalMetrics?.macd}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">BOLLINGER (SUP/INF)</span>
                  <span className="text-slate-200 font-bold">{stock.technicalMetrics?.bollingerUpper} / {stock.technicalMetrics?.bollingerLower}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">VOLATILIDAD ATR (14)</span>
                  <span className="text-slate-200 font-bold">{stock.technicalMetrics?.atr14} {stock.currency}</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-300">
                <strong className="text-slate-400 block mb-0.5">Diagnóstico Técnico:</strong>
                {stock.technicalMetrics?.trendSummary}
              </div>
            </div>

            {/* Fundamental Metrics Box */}
            <div className="terminal-card p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Fundamentales & Valoración</h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-400">
                  {stock.scores?.fundamental}/100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">PER (TTM) / FWD</span>
                  <span className="text-slate-200 font-bold">{stock.fundamentalMetrics?.per}x / {stock.fundamentalMetrics?.forwardPer}x</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">EV / EBITDA</span>
                  <span className="text-slate-200 font-bold">{stock.fundamentalMetrics?.evEbitda}x</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">CREC. INGRESOS YoY</span>
                  <span className="text-emerald-400 font-bold">{stock.fundamentalMetrics?.revenueGrowthYoY}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">RENT. DIVIDENDO</span>
                  <span className="text-slate-300 font-bold">{stock.fundamentalMetrics?.dividendYield}</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Deuda Neta / EBITDA:</span>
                  <span className="font-mono text-white font-semibold">{stock.fundamentalMetrics?.debtEbitda}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400">Retorno ROIC:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{stock.fundamentalMetrics?.roic}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SEC EDGAR Official Regulatory Filings Section (Etapa 2) */}
          <div className="terminal-card p-5 space-y-3.5 bg-[#0a1024]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Documentación Oficial & Filings (SEC EDGAR & Euronext)
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-950 text-blue-300 border border-blue-800">
                Verificación Contable
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(stock.secFilings || [
                { form: '10-K', description: 'Informe Anual Auditado', filingDate: '2026-02-21', status: 'Auditado', url: 'https://www.sec.gov/edgar' },
                { form: '10-Q', description: 'Informe Trimestral Q3', filingDate: '2026-08-28', status: 'Conforme', url: 'https://www.sec.gov/edgar' },
                { form: '8-K', description: 'Hecho Relevante Estratégico', filingDate: '2026-09-14', status: 'Verificado', url: 'https://www.sec.gov/edgar' }
              ]).map((filing, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-white px-1.5 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/50">
                        {filing.form}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{filing.filingDate}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{filing.description}</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/60 mt-2 text-[10px] font-mono">
                    <span className="text-emerald-400">{filing.status}</span>
                    <a
                      href={filing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>Ver Filing</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company News Feed Section */}
          <div className="terminal-card p-5 space-y-3 bg-[#0a1024]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Noticias Relevantes & Flujo Informativo</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Filtrado por IA de ANSAMA</span>
            </div>

            <div className="space-y-2.5">
              {(stock.recentNews || []).map((news, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{news.source}</span>
                      <span className="text-[10px] font-mono text-slate-500">&bull; {news.date || news.time}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        news.impact?.includes('Positivo') ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {news.impact}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-white leading-snug">{news.headline || news.title}</h4>
                    {news.summary && <p className="text-[11px] text-slate-400 line-clamp-2">{news.summary}</p>}
                  </div>
                  {news.url && (
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-500 hover:text-cyan-300 rounded hover:bg-slate-800 shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Execution Plan, Levels, Targets & Risks */}
        <div className="space-y-6">
          {/* ANSAMA Global Score Card */}
          <div className="terminal-card p-5 bg-gradient-to-b from-[#0c1635] to-[#090e24] border border-blue-900/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase">
                Puntuación Global ANSAMA
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                {stock.bias}
              </span>
            </div>

            <div className="my-4 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-black font-mono text-white tracking-tight">
                {stock.ansamaScore}
              </span>
              <span className="text-lg font-mono text-slate-500 font-semibold">/100</span>
            </div>

            {/* Score progress bars */}
            <div className="space-y-2 mt-4 text-xs font-mono">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Técnico ({aiWeights?.technical || 25}%)</span>
                  <span className="text-white font-semibold">{stock.scores?.technical}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${stock.scores?.technical}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Fundamental ({aiWeights?.fundamental || 25}%)</span>
                  <span className="text-white font-semibold">{stock.scores?.fundamental}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${stock.scores?.fundamental}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Sentimiento & Noticias ({aiWeights?.sentiment || 15}%)</span>
                  <span className="text-white font-semibold">{stock.scores?.sentiment}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${stock.scores?.sentiment}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Valoración & Potencial ({aiWeights?.valuation || 15}%)</span>
                  <span className="text-white font-semibold">{stock.scores?.valuation}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${stock.scores?.valuation}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Tendencia & Consenso ({aiWeights?.trend || 10}%)</span>
                  <span className="text-white font-semibold">{stock.scores?.trend || 75}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${stock.scores?.trend || 75}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Riesgo & Solvencia ({aiWeights?.risk || 10}%)</span>
                  <span className="text-white font-semibold">{stock.scores?.risk}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${stock.scores?.risk}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Plan: Zones, Targets, Stop Loss */}
          <div className="terminal-card p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Plan Operativo & Zonas Clave</span>
              </h3>
              <button
                onClick={() => {
                  recordRecommendation(stock, selectedHorizon);
                  setRecordedSuccess(true);
                  setTimeout(() => setRecordedSuccess(false), 2500);
                }}
                className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/50 text-[10px] font-mono text-emerald-300 transition-colors flex items-center gap-1"
                title="Registrar plan en el Track Record auditable"
              >
                <PlusCircle className="w-3 h-3 text-emerald-400" />
                <span>{recordedSuccess ? '¡Registrado!' : 'Añadir a Histórico'}</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold block">PRECIO OBJETIVO ESTIMADO</span>
                  <span className="text-emerald-300 font-extrabold text-sm">{stock.targets?.targetPrice} {stock.currency}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-900/50 px-2 py-1 rounded">
                  +{stock.probabilities?.targetReturnPotential}%
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-800/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-400 font-bold block">ZONA DE ENTRADA RECOMENDADA</span>
                  <span className="text-white font-bold text-xs">{stock.targets?.entryZoneMin} - {stock.targets?.entryZoneMax} {stock.currency}</span>
                </div>
                <span className="text-[10px] text-slate-400">Acumular</span>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-rose-400 font-bold block">STOP LOSS ESTRUCTURAL</span>
                  <span className="text-rose-300 font-bold text-xs">{stock.targets?.stopLoss} {stock.currency}</span>
                </div>
                <span className="text-xs font-bold text-rose-400 bg-rose-900/50 px-2 py-1 rounded">
                  {stock.probabilities?.potentialLoss}%
                </span>
              </div>
            </div>

            {/* S/R levels */}
            <div className="pt-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/80 text-[11px]">
                <span className="text-slate-400">Resistencias:</span>
                <span className="text-rose-400 font-semibold">{stock.targets?.resistances?.join(' | ')}</span>
              </div>
              <div className="flex justify-between py-1 text-[11px]">
                <span className="text-slate-400">Soportes:</span>
                <span className="text-emerald-400 font-semibold">{stock.targets?.supports?.join(' | ')}</span>
              </div>
            </div>
          </div>

          {/* Wall Street Consensus Breakdown Card (Finnhub Feed) */}
          {stock.analystConsensus && (
            <div className="terminal-card p-4 space-y-2.5 bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Consenso de Analistas (Finnhub)</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {stock.analystConsensus.consensusPercentBullish}% Alcista
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
                <div className="p-1.5 rounded bg-emerald-950/60 border border-emerald-800/60">
                  <span className="text-[9px] text-emerald-400 block font-bold">STRONG BUY</span>
                  <span className="text-white font-extrabold">{stock.analystConsensus.strongBuy}</span>
                </div>
                <div className="p-1.5 rounded bg-blue-950/60 border border-blue-800/60">
                  <span className="text-[9px] text-blue-400 block font-bold">BUY</span>
                  <span className="text-white font-extrabold">{stock.analystConsensus.buy}</span>
                </div>
                <div className="p-1.5 rounded bg-amber-950/60 border border-amber-800/60">
                  <span className="text-[9px] text-amber-400 block font-bold">HOLD</span>
                  <span className="text-white font-extrabold">{stock.analystConsensus.hold}</span>
                </div>
                <div className="p-1.5 rounded bg-rose-950/60 border border-rose-800/60">
                  <span className="text-[9px] text-rose-400 block font-bold">SELL</span>
                  <span className="text-white font-extrabold">{(stock.analystConsensus.sell || 0) + (stock.analystConsensus.strongSell || 0)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Detected Risks Alert Box */}
          <div className="terminal-card p-4 border-l-4 border-l-amber-500 bg-slate-900/90">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-amber-300 uppercase">Riesgos Detectados por la IA</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {stock.agentsDeliberation?.riskAgent?.opinion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
