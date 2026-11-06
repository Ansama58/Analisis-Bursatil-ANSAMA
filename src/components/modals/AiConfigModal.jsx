import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Layers, 
  Scale, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { DEFAULT_WEIGHTS } from '../../services/aiScoringEngine';
import { useMarket } from '../../context/MarketContext';

export default function AiConfigModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { aiWeights, updateAiWeights, refreshActiveStock } = useMarket();

  const [weights, setWeights] = useState({ ...aiWeights });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const total = Object.values(weights).reduce((a, b) => a + Number(b || 0), 0);
  const isValidTotal = total === 100;

  const handleSliderChange = (key, value) => {
    setWeights(prev => ({
      ...prev,
      [key]: parseInt(value, 10) || 0,
    }));
  };

  const handleNormalize = () => {
    if (total === 0) {
      setWeights({ ...DEFAULT_WEIGHTS });
      return;
    }
    const factor = 100 / total;
    const normalized = {
      technical: Math.round(weights.technical * factor),
      fundamental: Math.round(weights.fundamental * factor),
      sentiment: Math.round(weights.sentiment * factor),
      valuation: Math.round(weights.valuation * factor),
      trend: Math.round(weights.trend * factor),
      risk: Math.round(weights.risk * factor),
    };
    // Adjust remainder on technical so sum is exactly 100
    const sum = Object.values(normalized).reduce((a, b) => a + b, 0);
    normalized.technical += (100 - sum);
    setWeights(normalized);
  };

  const handleReset = () => {
    setWeights({ ...DEFAULT_WEIGHTS });
  };

  const handleSave = () => {
    updateAiWeights(weights);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const blocks = [
    { key: 'technical', label: '1. Análisis Técnico', desc: 'RSI 14, MACD, Medias 20/50/200, Bollinger, ATR y Soportes', color: 'from-cyan-500 to-blue-500' },
    { key: 'fundamental', label: '2. Análisis Fundamental', desc: 'PER, Crecimiento ingresos, Margen operativo, ROIC y Deuda', color: 'from-emerald-500 to-teal-500' },
    { key: 'sentiment', label: '3. Noticias & Sentimiento', desc: 'Resultados trimestrales, catalizadores y flujo informativo IA', color: 'from-blue-500 to-indigo-500' },
    { key: 'valuation', label: '4. Valoración & Potencial', desc: 'Descuento intrínseco, Upside a precio objetivo y margen seguridad', color: 'from-indigo-500 to-purple-500' },
    { key: 'trend', label: '5. Tendencia & Consenso', desc: 'Recomendaciones Wall Street/Europa y revisiones de estimaciones', color: 'from-purple-500 to-pink-500' },
    { key: 'risk', label: '6. Riesgo & Solvencia', desc: 'Drawdown máximo estimado, Beta de mercado y Stop Loss estructural', color: 'from-amber-500 to-rose-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full terminal-card p-6 bg-[#0a1124] border border-blue-900/60 shadow-2xl rounded-xl max-h-[90vh] flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#0b132b] rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <span>Configuración del Motor Cuantitativo & IA</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800 font-mono">
                  Etapa 3
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ajuste fino de ponderaciones para el algoritmo de puntuación global ANSAMA (0-100).
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Weight Indicator Banner */}
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono shrink-0 ${
          isValidTotal 
            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
            : 'bg-amber-950/40 border-amber-800 text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            {isValidTotal ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>
              Suma total de ponderaciones: <strong className="font-bold text-sm">{total}%</strong>
              {!isValidTotal && ' (Debe sumar exactamente 100%)'}
            </span>
          </div>

          {!isValidTotal && (
            <button
              onClick={handleNormalize}
              className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800 text-amber-200 rounded font-bold text-[11px] transition-colors border border-amber-700/60"
            >
              Auto-Normalizar a 100%
            </button>
          )}
        </div>

        {/* Sliders list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {blocks.map((b) => (
            <div key={b.key} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-xs text-white">{b.label}</div>
                  <div className="text-[11px] text-slate-400">{b.desc}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    {weights[b.key]}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={weights[b.key]}
                  onChange={(e) => handleSliderChange(b.key, e.target.value)}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Actions & Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 shrink-0">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Pesos Oficiales</span>
          </button>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>¡Pesos guardados y recalculados!</span>
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!isValidTotal}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-mono font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              Aplicar y Recalcular Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
