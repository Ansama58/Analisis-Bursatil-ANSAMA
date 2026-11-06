import React, { useState } from 'react';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Target,
  FileCheck,
  Percent,
  Download,
  PlusCircle,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Zap,
  BarChart2
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';

export default function HistoryScreen({ setCurrentScreen }) {
  const { 
    recommendations, 
    historicalSummary, 
    selectTicker, 
    currentStock, 
    recordRecommendation, 
    auditLiveRecommendations,
    selectedHorizon 
  } = useMarket();

  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'HIT', 'STOP', 'ACTIVE'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [auditSuccess, setAuditSuccess] = useState(false);
  const [recordAddedSuccess, setRecordAddedSuccess] = useState(false);

  const filtered = recommendations.filter(rec => {
    // Status filter
    const status = String(rec.status || '').toUpperCase();
    if (filterStatus === 'HIT' && !(status.includes('CUMPLIDO') || status.includes('ALCANZADO'))) return false;
    if (filterStatus === 'STOP' && !status.includes('STOP')) return false;
    if (filterStatus === 'ACTIVE' && !status.includes('EN CURSO')) return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const sym = String(rec.symbol).toLowerCase();
      const name = String(rec.name).toLowerCase();
      const id = String(rec.id).toLowerCase();
      return sym.includes(q) || name.includes(q) || id.includes(q);
    }
    return true;
  });

  const handleRunLiveAudit = () => {
    auditLiveRecommendations();
    setAuditSuccess(true);
    setTimeout(() => setAuditSuccess(false), 2500);
  };

  const handleRecordActiveStock = () => {
    recordRecommendation(currentStock, selectedHorizon);
    setRecordAddedSuccess(true);
    setTimeout(() => setRecordAddedSuccess(false), 3000);
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Fecha', 'Ticker', 'Empresa', 'Score', 'Recomendacion', 'Precio_Inicial', 'Objetivo', 'Stop_Loss', 'Acierto_Direccion', 'Retorno_Actual', 'Alfa_vs_Benchmark', 'Estado'];
    const rows = recommendations.map(r => [
      r.id,
      r.date,
      r.symbol,
      `"${r.name}"`,
      r.score,
      `"${r.recommendation}"`,
      r.initialPrice,
      r.targetPrice,
      r.stopLoss,
      r.directionCorrect ? 'SI' : 'NO',
      `"${r.actualReturn}"`,
      `"${r.alpha}"`,
      `"${r.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ANSAMA_TRACK_RECORD_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header and Mission Statement */}
      <div className="terminal-card p-6 bg-gradient-to-r from-[#0d163a] via-[#091026] to-[#070b1a] border border-blue-900/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-500/20 text-cyan-400">
              <FileCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              REGISTRO AUDITABLE & VALIDACIÓN HISTÓRICA &bull; ETAPA 4
            </span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Histórico y Rendimiento de Predicciones</h1>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
            "Sin este histórico no sabremos si nuestra IA es realmente buena o simplemente parece convincente."
            Contraste objetivo a 1, 3, 6 y 12 meses respecto a la cotización real y al índice de referencia.
          </p>
        </div>

        {/* Global Track Record KPIs */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-mono">Tasa de Acierto Global:</div>
            <div className="text-3xl font-black font-mono text-emerald-400">
              {historicalSummary.directionAccuracy}%
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {historicalSummary.targetReached} Objetivos | {historicalSummary.stopHit} Stops
            </div>
          </div>
          <div className="h-10 w-[1px] bg-slate-800 hidden sm:block"></div>
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400 font-mono">Alfa Medio vs Índice:</div>
            <div className="text-2xl font-black font-mono text-cyan-400">
              {historicalSummary.avgReturnVsBenchmark}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Ratio {historicalSummary.winLossRatio} : 1</div>
          </div>
        </div>
      </div>

      {/* Audit KPI Cards (1M, 3M, 6M, 12M Horizons) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1 Month */}
        <div className="terminal-card p-4 space-y-1 bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Horizonte 1 Mes</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {historicalSummary.validatedHorizons.m1.accuracy}%
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {historicalSummary.validatedHorizons.m1.avgAlpha} Alfa
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {historicalSummary.validatedHorizons.m1.hits} aciertos de {historicalSummary.validatedHorizons.m1.total} señales
          </p>
        </div>

        {/* 3 Months */}
        <div className="terminal-card p-4 space-y-1 bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Horizonte 3 Meses</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {historicalSummary.validatedHorizons.m3.accuracy}%
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {historicalSummary.validatedHorizons.m3.avgAlpha} Alfa
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {historicalSummary.validatedHorizons.m3.hits} aciertos de {historicalSummary.validatedHorizons.m3.total} señales
          </p>
        </div>

        {/* 6 Months */}
        <div className="terminal-card p-4 space-y-1 bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Horizonte 6 Meses</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {historicalSummary.validatedHorizons.m6.accuracy}%
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {historicalSummary.validatedHorizons.m6.avgAlpha} Alfa
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {historicalSummary.validatedHorizons.m6.hits} aciertos de {historicalSummary.validatedHorizons.m6.total} señales
          </p>
        </div>

        {/* 12 Months */}
        <div className="terminal-card p-4 space-y-1 bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Horizonte 12 Meses</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {historicalSummary.validatedHorizons.m12.accuracy}%
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {historicalSummary.validatedHorizons.m12.avgAlpha} Alfa
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {historicalSummary.validatedHorizons.m12.hits} aciertos de {historicalSummary.validatedHorizons.m12.total} señales
          </p>
        </div>
      </div>

      {/* Action Toolbar: Live Audit, Add Recommendation, Search & Export */}
      <div className="terminal-card p-4 flex flex-wrap items-center justify-between gap-4 bg-[#0a1124] border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filters */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 p-0.5 rounded-lg font-mono text-xs">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1 rounded transition-colors ${
                filterStatus === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({recommendations.length})
            </button>
            <button
              onClick={() => setFilterStatus('HIT')}
              className={`px-3 py-1 rounded transition-colors ${
                filterStatus === 'HIT' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Alcanzados ({historicalSummary.targetReached})
            </button>
            <button
              onClick={() => setFilterStatus('ACTIVE')}
              className={`px-3 py-1 rounded transition-colors ${
                filterStatus === 'ACTIVE' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              En Curso ({historicalSummary.pending})
            </button>
            <button
              onClick={() => setFilterStatus('STOP')}
              className={`px-3 py-1 rounded transition-colors ${
                filterStatus === 'STOP' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Stop Loss ({historicalSummary.stopHit})
            </button>
          </div>

          {/* Quick search input */}
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ticker o ref..."
              className="w-full pl-8 pr-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live audit against market */}
          <button
            onClick={handleRunLiveAudit}
            className="px-3.5 py-1.5 bg-blue-900/50 hover:bg-blue-800/80 text-cyan-300 border border-blue-700/60 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
            title="Contrasta las cotizaciones de entrada con los precios actuales en vivo"
          >
            {auditSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>{auditSuccess ? '¡Auditado en Vivo!' : 'Verificar con Mercado'}</span>
          </button>

          {/* Record current active stock */}
          <button
            onClick={handleRecordActiveStock}
            className="px-3.5 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            title={`Añadir recomendación actual de ${currentStock?.symbol} al registro auditable`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Registrar {currentStock?.symbol}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Exportar archivo CSV con todo el Track Record"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {recordAddedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Nueva predicción de <strong>{currentStock?.symbol}</strong> registrada con éxito en el Track Record auditable.</span>
        </div>
      )}

      {/* Detailed Historical Recommendations Table */}
      <div className="terminal-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070b18] text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Ref. / Fecha</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4">Recomendación</th>
                <th className="py-3 px-4 text-right">Cotización Inicial</th>
                <th className="py-3 px-4 text-right">Precio Actual</th>
                <th className="py-3 px-4 text-right">Objetivo / Stop</th>
                <th className="py-3 px-4 text-center">Acierto Dir.</th>
                <th className="py-3 px-4 text-right">Retorno Real</th>
                <th className="py-3 px-4 text-right">Alfa vs Índice</th>
                <th className="py-3 px-4 text-center">Estado Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-[#0a0f22]">
              {filtered.map((rec) => (
                <tr 
                  key={rec.id} 
                  className="hover:bg-slate-900/90 transition-colors cursor-pointer group"
                  onClick={() => {
                    selectTicker(rec.symbol);
                    setSelectedRecord(rec);
                  }}
                >
                  <td className="py-3.5 px-4 text-slate-400">
                    <div className="font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">{rec.id}</div>
                    <div className="text-[10px] text-slate-500">{rec.date}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-xs">{rec.symbol}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{rec.name}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded font-black bg-blue-950 text-blue-300 border border-blue-800">
                      {rec.score}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans font-bold text-xs text-slate-200">
                    {rec.recommendation}
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-slate-300">
                    {rec.initialPrice}
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-white">
                    {rec.currentPrice || rec.initialPrice}
                  </td>

                  <td className="py-3.5 px-4 text-right text-slate-300">
                    <div>Obj: <span className="text-emerald-400 font-bold">{rec.targetPrice}</span></div>
                    <div className="text-[10px] text-rose-400">Stop: {rec.stopLoss}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {rec.directionCorrect ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Sí
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                        <XCircle className="w-4 h-4" /> No
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-white">
                    <span className={String(rec.actualReturn).startsWith('-') ? 'text-rose-400' : 'text-emerald-400'}>
                      {rec.actualReturn}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-cyan-400">
                    {rec.alpha}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      rec.statusColor === 'emerald' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      rec.statusColor === 'blue' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      rec.statusColor === 'amber' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Audit Record Detail Card */}
      {selectedRecord && (
        <div className="terminal-card p-5 bg-[#0b1430] border border-blue-900/60 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase font-mono">
                Dictamen de Auditoría: {selectedRecord.id} &bull; {selectedRecord.name} ({selectedRecord.symbol})
              </h3>
            </div>
            <button
              onClick={() => {
                selectTicker(selectedRecord.symbol);
                setCurrentScreen('analyzer');
              }}
              className="text-xs text-cyan-400 hover:underline font-mono flex items-center gap-1"
            >
              <span>Abrir en Analizador</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Notas del Dictamen:</strong> {selectedRecord.notes}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
            <span>Fecha de emisión: <strong className="text-white">{selectedRecord.date}</strong></span>
            <span>&bull;</span>
            <span>Cotización Inicial: <strong className="text-white">{selectedRecord.initialPrice}</strong></span>
            <span>&bull;</span>
            <span>Cotización Auditada: <strong className="text-emerald-400">{selectedRecord.currentPrice}</strong></span>
            <span>&bull;</span>
            <span>Alfa Generado: <strong className="text-cyan-400">{selectedRecord.alpha}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
