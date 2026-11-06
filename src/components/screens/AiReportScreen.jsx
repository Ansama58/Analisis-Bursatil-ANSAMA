import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  CheckCircle, 
  CheckCircle2,
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  ShieldCheck, 
  HelpCircle,
  Scale, 
  Users, 
  Award, 
  ArrowRight, 
  MessageSquare,
  Sliders,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  Layers,
  PlusCircle
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { HORIZONS } from '../../services/aiPredictiveModel';

export default function AiReportScreen({ onOpenAiConfig }) {
  const { 
    currentStock, 
    selectTicker, 
    selectedTicker, 
    isAiDeliberating, 
    runAiDeliberation,
    selectedHorizon,
    setSelectedHorizon,
    aiWeights,
    recordRecommendation
  } = useMarket();

  const [copied, setCopied] = useState(false);
  const [recordedSuccess, setRecordedSuccess] = useState(false);
  const stock = currentStock;
  const deliberation = stock.agentsDeliberation;
  const probabilities = stock.probabilities || {};

  const quickTickers = ['NVDA', 'MSFT', 'IBE', 'ITX', 'AMZN', 'SAN', 'SAP'];

  const handleCopyReport = () => {
    const reportText = `=== INFORME DE INVERSIÓN ANSAMA ANALYTICS ===
Activo: ${stock.name} (${stock.symbol})
Cotización: ${stock.price} ${stock.currency}
Puntuación Global ANSAMA: ${stock.ansamaScore}/100 (${stock.bias})
Horizonte: ${probabilities.horizon || selectedHorizon}

[Métricas del Modelo Predictivo]
- Probabilidad de superar al índice: ${probabilities.outperform3M}%
- Probabilidad de retorno positivo: ${probabilities.positiveReturn}%
- Drawdown máximo estimado: ${probabilities.downsideRisk}%
- Potencial alcista estimado: +${probabilities.targetReturnPotential}%
- Ratio Beneficio/Riesgo: ${probabilities.riskRewardRatio}

[Veredicto de los Agentes]
1. Agente Técnico (${deliberation?.technicalAgent?.score}/100): ${deliberation?.technicalAgent?.opinion}
2. Agente Fundamental (${deliberation?.fundamentalAgent?.score}/100): ${deliberation?.fundamentalAgent?.opinion}
3. Agente Sentimiento (${deliberation?.sentimentAgent?.score}/100): ${deliberation?.sentimentAgent?.opinion}
4. Agente de Riesgo (${deliberation?.riskAgent?.score}/100): ${deliberation?.riskAgent?.opinion}

[Tesis Alcista (Bull)]: ${deliberation?.bullThesis?.summary}
[Tesis Bajista (Bear)]: ${deliberation?.bearThesis?.summary}

[Veredicto Coordinador]: ${deliberation?.coordinator?.recommendation}
- Zona de Entrada: ${deliberation?.coordinator?.entryZone}
- Precio Objetivo: ${deliberation?.coordinator?.targetPrice}
- Stop Loss: ${deliberation?.coordinator?.stopLoss}
============================================`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner with Ticker Selector */}
      <div className="terminal-card p-6 bg-gradient-to-r from-[#0d163a] via-[#091026] to-[#070b1a] border border-blue-900/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              <span>MOTOR DE INFERENCIA MULTI-AGENTE &bull; ETAPA 3</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {stock.symbol}-DECISION-2026</span>
          </div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-3">
            <span>ANSAMA — Informe de Inversión: {stock.name}</span>
            <span className="text-sm px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded font-normal font-sans">
              ({stock.symbol})
            </span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Deliberación autónoma entre 6 agentes de inteligencia artificial especializados. Confrontación dialéctica entre tesis alcista y tesis bajista con arbitraje del Agente Coordinador.
          </p>
        </div>

        {/* Quick ticker switcher */}
        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-mono">SELECCIONAR ACTIVO:</span>
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
            {quickTickers.map((t) => (
              <button
                key={t}
                onClick={() => selectTicker(t)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  (selectedTicker || 'NVDA').toUpperCase().startsWith(t)
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Controls & Multi-Horizon Toolbar */}
      <div className="bg-[#090f23] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        {/* Horizon selector */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Horizonte Temporal de Proyección:</span>
          </span>
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            {Object.keys(HORIZONS).map((hk) => (
              <button
                key={hk}
                onClick={() => setSelectedHorizon(hk)}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  selectedHorizon === hk
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {HORIZONS[hk].label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Run Deliberation, Config Weights & Copy */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAiConfig}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-lg flex items-center gap-1.5 transition-colors text-xs"
            title="Ajustar pesos de los 6 bloques cuantitativos"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pesos del Algoritmo</span>
          </button>

          <button
            onClick={runAiDeliberation}
            disabled={isAiDeliberating}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all disabled:opacity-50 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAiDeliberating ? 'animate-spin' : ''}`} />
            <span>{isAiDeliberating ? 'Deliberando...' : 'Re-ejecutar IA'}</span>
          </button>

          <button
            onClick={handleCopyReport}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-lg flex items-center gap-1.5 transition-colors text-xs"
            title="Copiar informe completo al portapapeles"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copiado' : 'Copiar Informe'}</span>
          </button>
        </div>
      </div>

      {/* Main Score & Predictive Probability Section (Spec from Page 6 of PDF) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prominent Score Card (Page 6 layout) */}
        <div className="lg:col-span-5 terminal-card p-6 bg-gradient-to-b from-[#0b1432] to-[#080d21] border border-blue-800/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                Puntuación Cuantitativa ANSAMA
              </span>
              <span className={`px-3 py-1 rounded text-xs font-bold font-mono border flex items-center gap-1.5 ${
                stock.ansamaScore >= 75
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-700/60'
                  : stock.ansamaScore >= 50
                  ? 'bg-blue-950 text-blue-300 border-blue-700/60'
                  : 'bg-rose-950 text-rose-400 border-rose-700/60'
              }`}>
                <span className={`w-2 h-2 rounded-full ${stock.ansamaScore >= 75 ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`}></span>
                {stock.bias}
              </span>
            </div>

            {/* Huge Score badge */}
            <div className="py-5 text-center">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-black font-mono text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200">
                  {stock.ansamaScore}
                </span>
                <span className="text-xl font-mono text-slate-500 font-semibold">/100</span>
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1">
                Nivel de Confianza: <strong className="text-cyan-300 font-mono">{probabilities.confidence || 'Alta (89%)'}</strong>
              </div>
            </div>

            {/* 6-Block Progress Bars with configurable weights (Page 2 & 6) */}
            <div className="space-y-2.5 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Técnico ({aiWeights.technical}%)</span>
                  <span className="text-white font-bold">{stock.scores?.technical}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full transition-all duration-500" style={{ width: `${stock.scores?.technical}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Fundamental ({aiWeights.fundamental}%)</span>
                  <span className="text-white font-bold">{stock.scores?.fundamental}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${stock.scores?.fundamental}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Sentimiento & Noticias ({aiWeights.sentiment}%)</span>
                  <span className="text-white font-bold">{stock.scores?.sentiment}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${stock.scores?.sentiment}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Valoración & Potencial ({aiWeights.valuation}%)</span>
                  <span className="text-white font-bold">{stock.scores?.valuation}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full transition-all duration-500" style={{ width: `${stock.scores?.valuation}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Tendencia & Consenso ({aiWeights.trend}%)</span>
                  <span className="text-white font-bold">{stock.scores?.trend || 75}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full transition-all duration-500" style={{ width: `${stock.scores?.trend || 75}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Riesgo & Solvencia ({aiWeights.risk}%)</span>
                  <span className="text-white font-bold">{stock.scores?.risk}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${stock.scores?.risk}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Pesos activos: {aiWeights.technical}/{aiWeights.fundamental}/{aiWeights.sentiment}/{aiWeights.valuation}/{aiWeights.trend}/{aiWeights.risk}</span>
            <button onClick={onOpenAiConfig} className="text-cyan-400 hover:underline">Modificar</button>
          </div>
        </div>

        {/* Predictive Probabilities Model (Separate from score, page 3 & 6 of PDF) */}
        <div className="lg:col-span-7 terminal-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Estimaciones del Modelo Predictivo Cuantitativo ({probabilities.horizon || selectedHorizon})
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                Modelo Estocástico Calibrado
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              <strong>Metodología Oficial ANSAMA:</strong> Las probabilidades se calculan mediante distribución de factores empíricos, separadas de la puntuación para evitar falsas seguridades.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {/* Outperform Index */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <span className="text-xs text-slate-400 font-medium block">
                  Probabilidad de superar al índice ({probabilities.horizon || selectedHorizon})
                </span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-4xl font-black font-mono text-emerald-400">
                    {probabilities.outperform3M}%
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">ALTA</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${probabilities.outperform3M}%` }}></div>
                </div>
              </div>

              {/* Positive Return */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <span className="text-xs text-slate-400 font-medium block">
                  Probabilidad de rentabilidad positiva
                </span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-4xl font-black font-mono text-emerald-400">
                    {probabilities.positiveReturn}%
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">FAVORABLE</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${probabilities.positiveReturn}%` }}></div>
                </div>
              </div>

              {/* Downside Risk */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <span className="text-xs text-slate-400 font-medium block">
                  Riesgo de caída estimada (Drawdown máx 95%)
                </span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-3xl font-black font-mono text-rose-400">
                    {probabilities.downsideRisk}%
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-semibold">Acotado</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${probabilities.downsideRisk}%` }}></div>
                </div>
              </div>

              {/* Risk / Reward ratio */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <span className="text-xs text-slate-400 font-medium block">
                  Ratio Beneficio / Pérdida Potencial
                </span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-3xl font-black font-mono text-cyan-400">
                    {probabilities.riskRewardRatio || '3.2 : 1'}
                  </span>
                  <span className="text-xs font-mono text-cyan-300 font-semibold">Asimétrico</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-2">
                  Potencial: <b className="text-emerald-400">+{probabilities.targetReturnPotential}%</b> | Pérdida máx: <b className="text-rose-400">{probabilities.potentialLoss}%</b>
                </div>
              </div>
            </div>

            {/* Multi-Horizon Probability Table (1M, 3M, 6M, 12M) */}
            {probabilities.allHorizons && (
              <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <div className="text-[11px] font-mono font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>PROYECCIÓN MULTI-HORIZONTE:</span>
                  <span className="text-slate-500 font-normal">Superar Índice | Rentabilidad + | Upside</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
                  {Object.keys(probabilities.allHorizons).map((hk) => {
                    const hData = probabilities.allHorizons[hk];
                    const isCurrent = selectedHorizon === hk;
                    return (
                      <div 
                        key={hk} 
                        onClick={() => setSelectedHorizon(hk)}
                        className={`p-2 rounded-lg border cursor-pointer transition-all ${
                          isCurrent 
                            ? 'bg-blue-950/80 border-blue-500 text-white' 
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-[10px] font-bold">{HORIZONS[hk].label}</div>
                        <div className="text-emerald-400 font-black mt-0.5">{hData.outperform}%</div>
                        <div className="text-[10px] text-slate-400">+{hData.upside}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-950/30 border border-blue-800/40 rounded-lg text-xs text-blue-300 flex items-center justify-between">
            <span>Objetivo cuantitativo activo para {probabilities.horizon}:</span>
            <span className="font-mono font-bold text-white">{stock.targets?.targetPrice} {stock.currency}</span>
          </div>
        </div>
      </div>

      {/* Factors that Elevate or Reduce the Score (Page 3 requirement) */}
      <div className="terminal-card p-6 bg-gradient-to-r from-[#0a1124] via-[#0b1530] to-[#0a1124] border border-slate-800">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Explicación Causal del Modelo: Factores Determinantes de la Calificación
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Boosters */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5 uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>Factores que han elevado la nota</span>
            </div>
            <div className="space-y-1.5">
              {(stock.elevatingFactors || [
                'Crecimiento de ingresos de doble dígito con expansión de márgenes.',
                'Cruce de medias móviles SMA 20 sobre SMA 50 en gráfico diario.',
                'Fuerte generación de flujo de caja libre y balance desendeudado.'
              ]).map((factor, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-xs text-slate-200 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">&bull;</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Penalizers */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5 uppercase">
              <AlertCircle className="w-4 h-4" />
              <span>Factores que han reducido la nota / Puntos de Atención</span>
            </div>
            <div className="space-y-1.5">
              {(stock.reducingFactors || [
                'Múltiplo PER exigente frente a la media histórica del sector.',
                'Nivel de volatilidad ATR que incrementa el riesgo de corrección a corto plazo.'
              ]).map((factor, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs text-slate-200 flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">&bull;</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Agent Architecture: 4 Specialized Agents (Page 2 & 10 of PDF) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Deliberación de los 4 Agentes Especializados
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Technical Agent */}
          <div className="terminal-card p-4 space-y-2 border-t-2 border-t-cyan-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 font-mono">1. AGENTE TÉCNICO</span>
              <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                {deliberation?.technicalAgent?.score}/100
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {deliberation?.technicalAgent?.opinion}
            </p>
          </div>

          {/* Fundamental Agent */}
          <div className="terminal-card p-4 space-y-2 border-t-2 border-t-emerald-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono">2. AGENTE FUNDAMENTAL</span>
              <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                {deliberation?.fundamentalAgent?.score}/100
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {deliberation?.fundamentalAgent?.opinion}
            </p>
          </div>

          {/* Sentiment & News Agent */}
          <div className="terminal-card p-4 space-y-2 border-t-2 border-t-blue-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 font-mono">3. AGENTE NOTICIAS & SENTIMIENTO</span>
              <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                {deliberation?.sentimentAgent?.score}/100
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {deliberation?.sentimentAgent?.opinion}
            </p>
          </div>

          {/* Risk Management Agent */}
          <div className="terminal-card p-4 space-y-2 border-t-2 border-t-amber-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 font-mono">4. AGENTE DE RIESGOS</span>
              <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                {deliberation?.riskAgent?.score}/100
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {deliberation?.riskAgent?.opinion}
            </p>
          </div>
        </div>
      </div>

      {/* Dialectical Debate: Bull Agent vs Bear Agent (Page 2 of PDF) */}
      <div className="terminal-card p-6 bg-gradient-to-r from-slate-900 via-[#0a1024] to-slate-900">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <Scale className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Debate Dialéctico de IA: Tesis Alcista vs. Tesis Bajista
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bull Researcher */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
              <TrendingUp className="w-4 h-4" />
              <span>Agente Alcista (Bull Thesis)</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {deliberation?.bullThesis?.summary}
            </p>
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Pilares a favor:</span>
              {deliberation?.bullThesis?.points?.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bear Researcher */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wide">
              <TrendingDown className="w-4 h-4" />
              <span>Agente Bajista (Bear Thesis)</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {deliberation?.bearThesis?.summary}
            </p>
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold">Puntos de fricción & riesgo:</span>
              {deliberation?.bearThesis?.points?.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coordinator Agent Final Decision */}
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                Veredicto Final del Agente Coordinador
              </span>
            </div>
            <div className="text-sm font-extrabold text-white font-mono">
              RECOMENDACIÓN: {deliberation?.coordinator?.recommendation}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {deliberation?.coordinator?.summary}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
              <span>Zona de entrada: <strong className="text-white">{deliberation?.coordinator?.entryZone}</strong></span>
              <span>&bull;</span>
              <span>Precio Objetivo: <strong className="text-emerald-400">{deliberation?.coordinator?.targetPrice}</strong></span>
              <span>&bull;</span>
              <button
                onClick={() => {
                  recordRecommendation(stock, selectedHorizon);
                  setRecordedSuccess(true);
                  setTimeout(() => setRecordedSuccess(false), 2500);
                }}
                className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded font-bold transition-all flex items-center gap-1.5"
                title="Añadir esta recomendación al registro histórico auditable"
              >
                {recordedSuccess ? <Check className="w-3 h-3 text-emerald-400" /> : <PlusCircle className="w-3 h-3 text-emerald-400" />}
                <span>{recordedSuccess ? '¡Guardada en Histórico!' : 'Registrar en Track Record'}</span>
              </button>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-[10px] text-slate-400 block font-mono">STOP DINÁMICO ESTRUCTURAL</span>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded border border-rose-800/60 inline-block mt-0.5">
              {deliberation?.coordinator?.stopLoss || stock.targets?.stopLoss} {stock.currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
