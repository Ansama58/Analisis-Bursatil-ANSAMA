import React, { useState, useMemo } from 'react';
import { Maximize2, Layers, BarChart2, TrendingUp, Crosshair } from 'lucide-react';

export default function FinancialChart({ stock, timeHorizon = '3M', onTimeHorizonChange }) {
  const [chartType, setChartType] = useState('candles'); // 'candles' or 'line'
  const [showSMA, setShowSMA] = useState(true);
  const [showLevels, setShowLevels] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Generate or parse historical candlesticks
  const candleData = useMemo(() => {
    // 1. If stock has real candles from Twelve Data API
    if (stock.candles && Array.isArray(stock.candles) && stock.candles.length > 0) {
      const sliceCount = timeHorizon === '1M' ? 22 : timeHorizon === '3M' ? 65 : timeHorizon === '6M' ? 130 : stock.candles.length;
      const sliced = stock.candles.slice(-sliceCount);
      return sliced.map((p, idx, arr) => {
        const sma20 = idx >= 20 ? arr.slice(idx - 20, idx).reduce((s, c) => s + c.close, 0) / 20 : null;
        const sma50 = idx >= 50 ? arr.slice(idx - 50, idx).reduce((s, c) => s + c.close, 0) / 50 : null;
        return {
          ...p,
          sma20: sma20 ? Number(sma20.toFixed(2)) : null,
          sma50: sma50 ? Number(sma50.toFixed(2)) : null
        };
      });
    }

    // 2. Synthetic calibrated historical series
    const pointsCount = timeHorizon === '1M' ? 22 : timeHorizon === '3M' ? 65 : timeHorizon === '6M' ? 130 : 250;
    const basePrice = stock.price * 0.82;
    const points = [];
    let current = basePrice;
    const now = new Date();

    for (let i = pointsCount; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * (timeHorizon === '1A' ? 1.5 : 1));
      
      const volatility = stock.technicalMetrics?.atr14 ? stock.technicalMetrics.atr14 * 0.7 : stock.price * 0.015;
      const trendBias = (stock.price - basePrice) / pointsCount;
      const change = (Math.random() - 0.48) * volatility + trendBias;
      
      const open = current;
      const close = i === 0 ? stock.price : open + change;
      const high = Math.max(open, close) + Math.random() * (volatility * 0.6);
      const low = Math.min(open, close) - Math.random() * (volatility * 0.6);
      const volume = Math.floor(Math.random() * 25000000) + 10000000;

      points.push({
        date: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
        isBull: close >= open
      });

      current = close;
    }

    // Calculate SMAs
    return points.map((p, idx, arr) => {
      const sma20 = idx >= 20 ? arr.slice(idx - 20, idx).reduce((s, c) => s + c.close, 0) / 20 : null;
      const sma50 = idx >= 50 ? arr.slice(idx - 50, idx).reduce((s, c) => s + c.close, 0) / 50 : null;
      return {
        ...p,
        sma20: sma20 ? Number(sma20.toFixed(2)) : null,
        sma50: sma50 ? Number(sma50.toFixed(2)) : null
      };
    });
  }, [stock, timeHorizon]);

  const minPrice = useMemo(() => {
    const lows = candleData.map(c => c.low);
    const supports = stock.targets?.supports || [];
    return Math.min(...lows, ...supports, stock.targets?.stopLoss || 999999) * 0.97;
  }, [candleData, stock]);

  const maxPrice = useMemo(() => {
    const highs = candleData.map(c => c.high);
    const resistances = stock.targets?.resistances || [];
    return Math.max(...highs, ...resistances, stock.targets?.targetPrice || 0) * 1.03;
  }, [candleData, stock]);

  const priceRange = maxPrice - minPrice;
  const maxVolume = useMemo(() => Math.max(...candleData.map(c => c.volume)), [candleData]);

  const getY = (val) => {
    if (!val || priceRange === 0) return 0;
    return 240 - ((val - minPrice) / priceRange) * 210;
  };

  const getVolY = (vol) => {
    return 300 - (vol / maxVolume) * 45;
  };

  const activePoint = hoveredPoint || candleData[candleData.length - 1];

  return (
    <div className="terminal-card overflow-hidden flex flex-col bg-[#0b132b] border border-slate-800">
      {/* Chart top toolbar */}
      <div className="px-5 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-[#080e22]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
            {['1M', '3M', '6M', '1A'].map((horizon) => (
              <button
                key={horizon}
                onClick={() => onTimeHorizonChange && onTimeHorizonChange(horizon)}
                className={`px-2.5 py-1 rounded font-mono font-medium transition-colors ${
                  timeHorizon === horizon ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {horizon}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-slate-800"></div>

          {/* Chart type toggle */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setChartType('candles')}
              className={`px-2 py-1 rounded font-medium flex items-center gap-1 ${
                chartType === 'candles' ? 'bg-slate-800 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Velas</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2 py-1 rounded font-medium flex items-center gap-1 ${
                chartType === 'line' ? 'bg-slate-800 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Línea</span>
            </button>
          </div>

          {/* Overlays toggle */}
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`px-2 py-1 rounded border text-xs font-mono transition-colors ${
              showSMA ? 'border-amber-500/40 bg-amber-500/10 text-amber-300' : 'border-slate-800 text-slate-500'
            }`}
          >
            SMA 20/50
          </button>

          <button
            onClick={() => setShowLevels(!showLevels)}
            className={`px-2 py-1 rounded border text-xs font-mono transition-colors ${
              showLevels ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' : 'border-slate-800 text-slate-500'
            }`}
          >
            Soportes/Resistencias
          </button>
        </div>

        {/* OHLC readout and Data Source Badge */}
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
            stock.candles && stock.candles.length > 0
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}>
            {stock.candles && stock.candles.length > 0 ? '● Twelve Data (Velas Reales)' : '● Serie Calibrada'}
          </span>

          {activePoint && (
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span>F: <b className="text-slate-200">{activePoint.date}</b></span>
              <span>A: <b className="text-slate-200">{activePoint.open}</b></span>
              <span>MAX: <b className="text-emerald-400">{activePoint.high}</b></span>
              <span>MIN: <b className="text-rose-400">{activePoint.low}</b></span>
              <span>C: <b className={activePoint.isBull ? 'text-emerald-400' : 'text-rose-400'}>{activePoint.close}</b></span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative w-full h-[320px] p-2 bg-[#090f23]">
        <svg
          className="w-full h-full select-none"
          viewBox={`0 0 ${candleData.length * 10 + 60} 310`}
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Background grid lines */}
          {[0, 1, 2, 3, 4].map(i => {
            const y = 30 + i * 50;
            const price = (maxPrice - (i / 4) * priceRange).toFixed(1);
            return (
              <g key={i}>
                <line x1="0" y1={y} x2="100%" y2={y} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />
                <text x="10" y={y - 4} fill="#64748b" fontSize="10" fontFamily="monospace">
                  {price} {stock.currency}
                </text>
              </g>
            );
          })}

          {/* Support and resistance zones */}
          {showLevels && stock.targets && (
            <>
              {/* Target price line */}
              <line
                x1="0"
                y1={getY(stock.targets.targetPrice)}
                x2="100%"
                y2={getY(stock.targets.targetPrice)}
                stroke="#10b981"
                strokeDasharray="4 2"
                strokeWidth="1.2"
              />
              <text x="75%" y={getY(stock.targets.targetPrice) - 4} fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
                OBJETIVO: {stock.targets.targetPrice} {stock.currency}
              </text>

              {/* Stop loss line */}
              <line
                x1="0"
                y1={getY(stock.targets.stopLoss)}
                x2="100%"
                y2={getY(stock.targets.stopLoss)}
                stroke="#ef4444"
                strokeDasharray="4 2"
                strokeWidth="1.2"
              />
              <text x="75%" y={getY(stock.targets.stopLoss) - 4} fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
                STOP LOSS: {stock.targets.stopLoss} {stock.currency}
              </text>
            </>
          )}

          {/* Volume bars in lower area */}
          {candleData.map((d, idx) => {
            const x = idx * 10 + 20;
            const yVol = getVolY(d.volume);
            return (
              <rect
                key={`vol-${idx}`}
                x={x - 3}
                y={yVol}
                width="6"
                height={300 - yVol}
                fill={d.isBull ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}
              />
            );
          })}

          {/* Moving averages lines */}
          {showSMA && (
            <>
              {/* SMA 20 */}
              <path
                d={candleData.reduce((acc, d, idx) => {
                  if (!d.sma20) return acc;
                  const x = idx * 10 + 20;
                  const y = getY(d.sma20);
                  return acc === '' ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                }, '')}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              {/* SMA 50 */}
              <path
                d={candleData.reduce((acc, d, idx) => {
                  if (!d.sma50) return acc;
                  const x = idx * 10 + 20;
                  const y = getY(d.sma50);
                  return acc === '' ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                }, '')}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
              />
            </>
          )}

          {/* Candlesticks or Line */}
          {chartType === 'candles' ? (
            candleData.map((d, idx) => {
              const x = idx * 10 + 20;
              const yOpen = getY(d.open);
              const yClose = getY(d.close);
              const yHigh = getY(d.high);
              const yLow = getY(d.low);
              const candleTop = Math.min(yOpen, yClose);
              const candleHeight = Math.max(Math.abs(yClose - yOpen), 2);
              const color = d.isBull ? '#10b981' : '#ef4444';

              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(d)}
                >
                  {/* Wick */}
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.2" />
                  {/* Real body */}
                  <rect
                    x={x - 3.5}
                    y={candleTop}
                    width="7"
                    height={candleHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })
          ) : (
            <path
              d={candleData.reduce((acc, d, idx) => {
                const x = idx * 10 + 20;
                const y = getY(d.close);
                return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
          )}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 left-4 flex items-center gap-4 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400"></span>
            <span>SMA 20 ({stock.technicalMetrics?.sma20 || '-'})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-cyan-400"></span>
            <span>SMA 50 ({stock.technicalMetrics?.sma50 || '-'})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Objetivo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Stop</span>
          </div>
        </div>
      </div>
    </div>
  );
}
