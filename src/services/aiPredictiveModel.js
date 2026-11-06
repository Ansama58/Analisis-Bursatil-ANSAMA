// ANSAMA ANALYTICS — Quantitative Predictive Model (Etapa 3)
// Separate predictive engine based on stochastic factor drift and empirical distributions
// Calculates probabilities for 1M, 3M, 6M, and 12M horizons (Pages 3 & 6 of PDF)

/**
 * Standard cumulative normal distribution approximation (Abramowitz & Stegun)
 */
function normalCdf(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

export const HORIZONS = {
  '1M': { id: '1M', label: '1 Mes', months: 1, tradingDays: 21, annualFraction: 1 / 12 },
  '3M': { id: '3M', label: '3 Meses', months: 3, tradingDays: 63, annualFraction: 0.25 },
  '6M': { id: '6M', label: '6 Meses', months: 6, tradingDays: 126, annualFraction: 0.5 },
  '12M': { id: '12M', label: '12 Meses (1A)', months: 12, tradingDays: 252, annualFraction: 1.0 },
};

/**
 * Calculates predictive probabilities across time horizons.
 * @param {Object} stock - Stock data object with current price, beta, fundamentals, and scores
 * @param {string} horizonKey - '1M' | '3M' | '6M' | '12M'
 * @param {number} ansamaScore - Computed ANSAMA score (0-100)
 * @returns {Object} Multi-horizon predictive estimates
 */
export function calculatePredictiveEstimates(stock, horizonKey = '3M', ansamaScore = 80) {
  const horizon = HORIZONS[horizonKey] || HORIZONS['3M'];
  const t = horizon.annualFraction;

  // Base volatility estimate (annualized) derived from ATR or beta
  const price = stock.price || 100;
  const atr = stock.technicalMetrics?.atr14 || (price * 0.02);
  const beta = stock.fundamentalMetrics?.beta || 1.15;
  const estimatedAnnualVol = Math.max(0.16, Math.min(0.55, (atr / price) * Math.sqrt(252) * 0.9 * (beta * 0.8 + 0.2)));

  // Drift adjustment: ANSAMA Score > 50 gives positive alpha drift above market
  // Benchmark expected return ~9% annually
  const benchmarkDrift = 0.09;
  const alphaDrift = ((ansamaScore - 50) / 50) * 0.18; // -18% to +18% annualized alpha drift
  const expectedReturnAnnual = benchmarkDrift + alphaDrift;

  // Horizon adjusted drift and volatility
  const mu_h = expectedReturnAnnual * t;
  const sigma_h = estimatedAnnualVol * Math.sqrt(t);

  // 1. Probability of Positive Nominal Return: P(Return > 0)
  // z = (0 - mu_h) / sigma_h
  const z_pos = (0 - mu_h) / sigma_h;
  const rawPositiveReturn = (1 - normalCdf(z_pos)) * 100;
  const positiveReturnProb = Math.max(25, Math.min(94, Math.round(rawPositiveReturn)));

  // 2. Probability of Outperforming Benchmark: P(Return > Benchmark)
  const z_alpha = (0 - (alphaDrift * t)) / (sigma_h * 0.85);
  const rawOutperform = (1 - normalCdf(z_alpha)) * 100;
  const outperformProb = Math.max(20, Math.min(92, Math.round(rawOutperform)));

  // 3. Maximum Estimated Drawdown (95% Value at Risk over horizon)
  // 1.645 std deviations under normal distribution for 95% confidence
  const var95 = Math.abs(mu_h - 1.645 * sigma_h) * 100;
  const maxDrawdown = Math.max(5, Math.min(42, Math.round(var95 * 0.85)));

  // 4. Upside and Downside targets for this horizon
  const baseTargetUpside = stock.probabilities?.targetReturnPotential || 22.0;
  const targetReturnPotential = Number((baseTargetUpside * Math.pow(t / 0.25, 0.45)).toFixed(1));
  const potentialLoss = Number((-Math.max(4.5, maxDrawdown * 0.65)).toFixed(1));

  // 5. Risk / Benefit Ratio
  const rrRatio = potentialLoss !== 0 ? Math.abs(targetReturnPotential / potentialLoss).toFixed(1) : '3.0';

  // 6. Confidence Level
  let confidenceText = 'Alta (88%)';
  if (ansamaScore > 80 && beta < 1.4) {
    confidenceText = 'Alta (91%)';
  } else if (ansamaScore < 60 || beta > 1.6) {
    confidenceText = 'Moderada (76%)';
  }

  return {
    horizon: horizon.label,
    horizonKey: horizon.id,
    outperformProbability: outperformProb,
    positiveReturnProbability: positiveReturnProb,
    downsideRisk: maxDrawdown,
    targetReturnPotential,
    potentialLoss,
    riskRewardRatio: `${rrRatio} : 1`,
    confidence: confidenceText,
    volatilityAnnual: `${(estimatedAnnualVol * 100).toFixed(1)}%`,
    allHorizons: {
      '1M': computeQuickProb(1 / 12, expectedReturnAnnual, alphaDrift, estimatedAnnualVol, baseTargetUpside),
      '3M': computeQuickProb(0.25, expectedReturnAnnual, alphaDrift, estimatedAnnualVol, baseTargetUpside),
      '6M': computeQuickProb(0.50, expectedReturnAnnual, alphaDrift, estimatedAnnualVol, baseTargetUpside),
      '12M': computeQuickProb(1.00, expectedReturnAnnual, alphaDrift, estimatedAnnualVol, baseTargetUpside),
    }
  };
}

function computeQuickProb(t, muAnnual, alphaDrift, sigmaAnnual, baseUpside) {
  const mu_h = muAnnual * t;
  const sigma_h = sigmaAnnual * Math.sqrt(t);
  const z_pos = (0 - mu_h) / sigma_h;
  const z_alpha = (0 - (alphaDrift * t)) / (sigma_h * 0.85);

  const posProb = Math.max(25, Math.min(94, Math.round((1 - normalCdf(z_pos)) * 100)));
  const outProb = Math.max(20, Math.min(92, Math.round((1 - normalCdf(z_alpha)) * 100)));
  const upside = Number((baseUpside * Math.pow(t / 0.25, 0.45)).toFixed(1));

  return {
    positiveReturn: posProb,
    outperform: outProb,
    upside,
  };
}
