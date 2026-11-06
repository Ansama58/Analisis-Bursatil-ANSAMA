import React, { useState } from 'react';
import { Scale, Check, Plus, X, Sparkles, TrendingUp, DollarSign, ShieldAlert, BarChart, ArrowRight } from 'lucide-react';
import { STOCKS_DATA } from '../../data/marketData';
import { useMarket } from '../../context/MarketContext';

export default function ComparatorScreen({ setCurrentScreen }) {
  const { stocks, selectTicker } = useMarket();
  const [selectedKeys, setSelectedKeys] = useState(['NVDA', 'MSFT', 'IBE', 'ITX']);

  const allStocks = Object.keys(stocks);

  const toggleStock = (key) => {
    if (selectedKeys.includes(key)) {
      if (selectedKeys.length > 2) {
        setSelectedKeys(selectedKeys.filter(k => k !== key));
      }
    } else {
      if (selectedKeys.length < 4) {
        setSelectedKeys([...selectedKeys, key]);
      }
    }
  };

  const applyPreset = (keys) => {
    setSelectedKeys(keys);
  };

  const comparedStocks = selectedKeys.map(k => stocks[k] || STOCKS_DATA[k] || stocks.NVDA);

  const comparisonRows = [
    { label: 'Puntuación Global ANSAMA', key: 'ansamaScore', format: (s) => `${s.ansamaScore ?? '-'} / 100`, isScore: true },
    { label: 'Sesgo del Motor IA', key: 'bias', format: (s) => String(s.bias || '-') },
    { label: 'Probabilidad Superar Índice (3M)', key: 'outperform', format: (s) => `${s.probabilities?.outperform3M ?? '-'}%` },
    { label: 'Probabilidad Retorno Positivo', key: 'posRet', format: (s) => `${s.probabilities?.positiveReturn ?? '-'}%` },
    { label: 'Precio Actual', key: 'price', format: (s) => `${s.price ?? '-'} ${s.currency || ''}` },
    { label: 'Variación 1D (%)', key: 'changePercent', format: (s) => `${s.changePercent >= 0 ? '+' : ''}${s.changePercent ?? 0}%` },
    { label: 'Precio Objetivo IA', key: 'targetPrice', format: (s) => `${s.targets?.targetPrice ?? '-'} ${s.currency || ''}` },
    { label: 'Potencial Estimado', key: 'targetPotential', format: (s) => `+${s.probabilities?.targetReturnPotential ?? 0}%` },
    { label: 'PER Actual (TTM)', key: 'per', format: (s) => s.fundamentalMetrics?.per ? `${s.fundamentalMetrics.per}x` : '-' },
    { label: 'PER Forward', key: 'forwardPer', format: (s) => s.fundamentalMetrics?.forwardPer ? `${s.fundamentalMetrics.forwardPer}x` : '-' },
    { label: 'EV / EBITDA', key: 'evEbitda', format: (s) => s.fundamentalMetrics?.evEbitda ? `${s.fundamentalMetrics.evEbitda}x` : '-' },
    { label: 'Crecimiento Ingresos YoY', key: 'revGrowth', format: (s) => String(s.fundamentalMetrics?.revenueGrowthYoY || '-') },
    { label: 'Margen Operativo', key: 'opMargin', format: (s) => String(s.fundamentalMetrics?.operatingMargin || '-') },
    { label: 'Retorno sobre Capital (ROIC)', key: 'roic', format: (s) => String(s.fundamentalMetrics?.roic || '-') },
    { label: 'Rentabilidad por Dividendo', key: 'divYield', format: (s) => String(s.fundamentalMetrics?.dividendYield || '-') },
    { label: 'RSI 14 Sesiones', key: 'rsi14', format: (s) => s.technicalMetrics?.rsi14 != null ? String(s.technicalMetrics.rsi14) : '-' },
    { label: 'Score Técnico (25%)', key: 'techScore', format: (s) => `${s.scores?.technical ?? '-'} / 100` },
    { label: 'Score Fundamental (25%)', key: 'fundScore', format: (s) => `${s.scores?.fundamental ?? '-'} / 100` },
    { label: 'Score Sentimiento (15%)', key: 'sentScore', format: (s) => `${s.scores?.sentiment ?? '-'} / 100` },
    { label: 'Control de Riesgo (10%)', key: 'riskScore', format: (s) => `${s.scores?.risk ?? '-'} / 100` },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner and Asset Picker */}
      <div className="terminal-card p-5 bg-[#0b132b] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-500/20 text-blue-400">
              <Scale className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              MATRIZ DE COMPARACIÓN MULTI-FACTORIAL
            </span>
          </div>
          <h1 className="text-lg font-bold text-white mt-1">Comparador Cuantitativo Cara a Cara</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Analiza simultáneamente hasta 4 valores en valoración, múltiplos, márgenes y momentum técnico.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Presets:</span>
          <button
            onClick={() => applyPreset(['NVDA', 'MSFT', 'AMZN'])}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
          >
            Big Tech USA
          </button>
          <button
            onClick={() => applyPreset(['IBE', 'ITX', 'SAN'])}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
          >
            Líderes IBEX 35
          </button>
          <button
            onClick={() => applyPreset(['NVDA', 'MSFT', 'IBE', 'ITX'])}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
          >
            USA vs Europa
          </button>
        </div>
      </div>

      {/* Asset Selector Chips */}
      <div className="terminal-card p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-mono font-semibold">Seleccionar Activos (2 a 4):</span>
          {allStocks.map((key) => {
            const isSelected = selectedKeys.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleStock(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-500'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{key}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-300" />}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Comparando <strong className="text-white font-bold">{comparedStocks.length}</strong> empresas
        </span>
      </div>

      {/* Comparison Grid Table */}
      <div className="terminal-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            {/* Table Header with Company Cards */}
            <thead className="bg-[#070b18] border-b border-slate-800">
              <tr>
                <th className="py-4 px-5 text-slate-400 font-mono uppercase text-[11px] w-64 bg-[#050814]">
                  Métricas de Análisis
                </th>
                {comparedStocks.map((stock) => (
                  <th key={stock.symbol} className="py-4 px-5 text-center min-w-[210px]">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-mono text-base font-extrabold text-white">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {stock.exchange}
                        </span>
                      </div>
                      <div className="text-[11px] font-sans text-slate-400 truncate max-w-[180px] mx-auto">
                        {stock.name}
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            selectTicker(stock.symbol);
                            setCurrentScreen('ai-report');
                          }}
                          className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[10px] font-sans font-bold transition-all"
                        >
                          Ver Informe IA
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Comparison Rows */}
            <tbody className="divide-y divide-slate-800/80 bg-[#0a0f22]">
              {comparisonRows.map((row, idx) => (
                <tr key={row.key} className={idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-transparent'}>
                  <td className="py-3 px-5 text-slate-300 font-sans font-medium text-xs bg-[#070b18]/60">
                    {row.label}
                  </td>
                  {comparedStocks.map((stock) => {
                    const rawVal = row.format(stock);
                    const val = String(rawVal ?? '-');
                    const isScore = row.isScore;
                    const isGreen = val.includes('+') || val.includes('Fuerte Compra') || val.includes('Alcista');
                    const isRed = val.includes('Bajista');

                    return (
                      <td key={stock.symbol} className="py-3 px-5 text-center font-mono">
                        {isScore ? (
                          <span className="inline-block px-3 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-700/60 font-black text-sm">
                            {val}
                          </span>
                        ) : (
                          <span className={`font-semibold ${
                            isGreen ? 'text-emerald-400' :
                            isRed ? 'text-rose-400' :
                            'text-slate-200'
                          }`}>
                            {val}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
