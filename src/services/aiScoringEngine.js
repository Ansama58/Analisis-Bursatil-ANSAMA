// ANSAMA ANALYTICS — Quantitative Scoring Engine (Etapa 3)
// Implements the 6-block weighted model defined in the project specification:
// 1. Technical Analysis (25%)
// 2. Fundamental Analysis (25%)
// 3. News & Sentiment (15%)
// 4. Valuation & Potential (15%)
// 5. Trend & Analyst Consensus (10%)
// 6. Financial & Market Risk (10%)
// Features configurable weights and identifies specific factors that elevate or reduce the score.

export const DEFAULT_WEIGHTS = {
  technical: 25,
  fundamental: 25,
  sentiment: 15,
  valuation: 15,
  trend: 10,
  risk: 10,
};

const STORAGE_KEY_WEIGHTS = 'ansama_ai_weights';

export function getStoredWeights() {
  if (typeof window === 'undefined') return { ...DEFAULT_WEIGHTS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEIGHTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.technical !== undefined && parsed.fundamental !== undefined) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored weights:', e);
  }
  return { ...DEFAULT_WEIGHTS };
}

export function saveStoredWeights(weights) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(weights));
    } catch (e) {
      console.warn('Error saving weights:', e);
    }
  }
}

/**
 * Calculates quantitative scores (0-100) for all 6 blocks and determines driving factors.
 * @param {Object} stock - Stock data object with technical, fundamental, and market metrics
 * @param {Object} customWeights - Optional custom weights
 * @returns {Object} Comprehensive scoring assessment
 */
export function calculateAnsamaScores(stock, customWeights = null) {
  const weights = customWeights || getStoredWeights();
  const elevatingFactors = [];
  const reducingFactors = [];

  // ----------------------------------------------------
  // 1. TÉCNICO (0 - 100)
  // ----------------------------------------------------
  let techScore = 70; // baseline
  const tech = stock.technicalMetrics || {};
  const rsi = typeof tech.rsi14 === 'number' ? tech.rsi14 : 55;

  // RSI Assessment
  if (rsi >= 50 && rsi <= 65) {
    techScore += 12;
    elevatingFactors.push(`RSI saludable (${rsi}) en zona de expansión sin sobrecompra.`);
  } else if (rsi > 70) {
    techScore -= 10;
    reducingFactors.push(`RSI elevado (${rsi}) en zona de sobrecompra a corto plazo.`);
  } else if (rsi < 35 && rsi >= 25) {
    techScore += 6;
    elevatingFactors.push(`RSI en sobreventa (${rsi}) con potencial de rebote técnico.`);
  } else if (rsi < 25) {
    techScore -= 14;
    reducingFactors.push(`RSI extremo (${rsi}) denota fuerte debilidad de momento.`);
  }

  // MACD Assessment
  const macdStr = String(tech.macd || '').toLowerCase();
  if (macdStr.includes('alcista') || macdStr.includes('+')) {
    techScore += 10;
    elevatingFactors.push('Cruce de MACD en terreno positivo y momento alcista.');
  } else if (macdStr.includes('bajista') || macdStr.includes('-')) {
    techScore -= 10;
    reducingFactors.push('Señal de MACD bajista o divergencia negativa.');
  }

  // Moving Averages Alignment (SMA 20, 50, 200)
  if (tech.sma20 && tech.sma50 && tech.sma20 > tech.sma50) {
    techScore += 8;
    elevatingFactors.push('Media móvil SMA 20 por encima de SMA 50 (alineación favorable).');
  }

  techScore = Math.max(15, Math.min(98, Math.round(techScore)));

  // ----------------------------------------------------
  // 2. FUNDAMENTAL (0 - 100)
  // ----------------------------------------------------
  let fundScore = 72;
  const fund = stock.fundamentalMetrics || {};

  // Revenue Growth
  const revGrowthStr = String(fund.revenueGrowthYoY || '');
  const revNum = parseFloat(revGrowthStr.replace(/[^0-9.-]/g, '')) || 0;
  if (revNum >= 25) {
    fundScore += 15;
    elevatingFactors.push(`Crecimiento acelerado de ingresos (${fund.revenueGrowthYoY}).`);
  } else if (revNum >= 10) {
    fundScore += 8;
    elevatingFactors.push(`Crecimiento sostenido de ventas (${fund.revenueGrowthYoY}).`);
  } else if (revNum < 0) {
    fundScore -= 14;
    reducingFactors.push(`Contracción en cifra de negocios (${fund.revenueGrowthYoY}).`);
  }

  // Margins
  const opMarginStr = String(fund.operatingMargin || '');
  const opNum = parseFloat(opMarginStr.replace(/[^0-9.-]/g, '')) || 0;
  if (opNum >= 25) {
    fundScore += 10;
    elevatingFactors.push(`Excelente margen operativo (${fund.operatingMargin}) con poder de fijación.`);
  } else if (opNum < 8 && opNum > 0) {
    fundScore -= 6;
    reducingFactors.push(`Margen operativo ajustado (${fund.operatingMargin}).`);
  }

  // ROIC Efficiency
  const roicStr = String(fund.roic || '');
  const roicNum = parseFloat(roicStr.replace(/[^0-9.-]/g, '')) || 0;
  if (roicNum >= 15) {
    fundScore += 8;
    elevatingFactors.push(`Alta rentabilidad sobre capital invertido ROIC (${fund.roic}).`);
  }

  fundScore = Math.max(20, Math.min(96, Math.round(fundScore)));

  // ----------------------------------------------------
  // 3. SENTIMIENTO & NOTICIAS (0 - 100)
  // ----------------------------------------------------
  let sentScore = 75;
  const newsList = stock.recentNews || [];
  let posCount = 0;
  let negCount = 0;

  newsList.forEach((n) => {
    const text = `${n.headline || n.title || ''} ${n.impact || ''}`.toLowerCase();
    if (text.includes('positivo') || text.includes('surge') || text.includes('beat') || text.includes('favorable')) {
      posCount++;
    } else if (text.includes('negativo') || text.includes('miss') || text.includes('fall') || text.includes('drop')) {
      negCount++;
    }
  });

  if (posCount > negCount) {
    sentScore += 10;
    elevatingFactors.push('Flujo dominante de noticias positivas y superación de estimaciones.');
  } else if (negCount > posCount) {
    sentScore -= 12;
    reducingFactors.push('Viento de cara mediático por noticias adversas o cautela empresarial.');
  }

  sentScore = Math.max(25, Math.min(95, Math.round(sentScore)));

  // ----------------------------------------------------
  // 4. VALORACIÓN & POTENCIAL (0 - 100)
  // ----------------------------------------------------
  let valScore = 70;
  const per = typeof fund.per === 'number' ? fund.per : parseFloat(fund.per) || 25;
  const upside = stock.probabilities?.targetReturnPotential || 
    (stock.targets?.targetPrice && stock.price ? ((stock.targets.targetPrice - stock.price) / stock.price) * 100 : 15);

  if (upside >= 25) {
    valScore += 14;
    elevatingFactors.push(`Potencial alcista atractivo (+${upside.toFixed(1)}%) hasta precio objetivo.`);
  } else if (upside <= 5) {
    valScore -= 12;
    reducingFactors.push(`Margen de seguridad comprimido (+${upside.toFixed(1)}% hasta objetivo).`);
  }

  if (per > 45) {
    valScore -= 10;
    reducingFactors.push(`Múltiplo PER actual (${per}x) exigente que descuenta alto crecimiento.`);
  } else if (per > 0 && per < 18) {
    valScore += 10;
    elevatingFactors.push(`Valoración atractiva con PER moderado (${per}x).`);
  }

  valScore = Math.max(20, Math.min(95, Math.round(valScore)));

  // ----------------------------------------------------
  // 5. TENDENCIA & REVISIONES DE ANALISTAS (0 - 100)
  // ----------------------------------------------------
  let trendScore = 78;
  const consensus = stock.analystConsensus;
  if (consensus && consensus.consensusPercentBullish) {
    if (consensus.consensusPercentBullish >= 80) {
      trendScore += 12;
      elevatingFactors.push(`Consenso abrumadoramente alcista (${consensus.consensusPercentBullish}%) en Wall Street y Europa.`);
    } else if (consensus.consensusPercentBullish < 50) {
      trendScore -= 15;
      reducingFactors.push('Divergencia entre analistas con menos del 50% en recomendación de compra.');
    }
  }

  trendScore = Math.max(20, Math.min(98, Math.round(trendScore)));

  // ----------------------------------------------------
  // 6. RIESGO FINANCIERO & BURSÁTIL (0 - 100, más alto = menor riesgo/mayor solvencia)
  // ----------------------------------------------------
  let riskScore = 76;
  const debt = parseFloat(String(fund.debtEbitda || '').replace(/[^0-9.-]/g, '')) || 1.8;
  const beta = typeof fund.beta === 'number' ? fund.beta : parseFloat(fund.beta) || 1.1;

  if (debt > 3.8) {
    riskScore -= 16;
    reducingFactors.push(`Apalancamiento elevado (Deuda/EBITDA de ${debt}x) en entorno de tipos vigentes.`);
  } else if (debt <= 1.5) {
    riskScore += 10;
    elevatingFactors.push(`Estructura de balance sólida y desendeudada (${debt}x Deuda/EBITDA).`);
  }

  if (beta > 1.6) {
    riskScore -= 8;
    reducingFactors.push(`Beta elevada (${beta}) que incrementa la sensibilidad ante volatilidad de mercado.`);
  }

  riskScore = Math.max(20, Math.min(95, Math.round(riskScore)));

  // ----------------------------------------------------
  // CÁLCULO PONDERADO FINAL ANSAMA (0 - 100)
  // ----------------------------------------------------
  const totalWeight = (
    weights.technical +
    weights.fundamental +
    weights.sentiment +
    weights.valuation +
    weights.trend +
    weights.risk
  ) || 100;

  const weightedSum = (
    techScore * weights.technical +
    fundScore * weights.fundamental +
    sentScore * weights.sentiment +
    valScore * weights.valuation +
    trendScore * weights.trend +
    riskScore * weights.risk
  );

  const ansamaScore = Math.round(weightedSum / totalWeight);

  // Clasificación del sesgo
  let bias = 'Mantener';
  let biasColor = 'amber';
  if (ansamaScore >= 82) {
    bias = 'Fuerte Compra';
    biasColor = 'emerald';
  } else if (ansamaScore >= 70) {
    bias = 'Compra Favorable';
    biasColor = 'emerald';
  } else if (ansamaScore >= 52) {
    bias = 'Mantener';
    biasColor = 'blue';
  } else if (ansamaScore >= 40) {
    bias = 'Reducir / Precaución';
    biasColor = 'rose';
  } else {
    bias = 'Venta / Alto Riesgo';
    biasColor = 'rose';
  }

  return {
    ansamaScore,
    bias,
    biasColor,
    weights,
    scores: {
      technical: techScore,
      fundamental: fundScore,
      sentiment: sentScore,
      valuation: valScore,
      trend: trendScore,
      risk: riskScore,
    },
    elevatingFactors: elevatingFactors.slice(0, 4),
    reducingFactors: reducingFactors.slice(0, 4),
    calculatedAt: new Date().toISOString(),
  };
}
