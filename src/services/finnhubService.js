// Finnhub Financial API Connector for ANSAMA ANALYTICS
// Fetches real-time quotes, company profile, fundamentals, price targets, consensus, and news

const BASE_URL = 'https://finnhub.io/api/v1';

export async function fetchFinnhubQuote(symbol, token) {
  if (!token) return null;
  const cleanSymbol = symbol.toUpperCase().split('.')[0]; // Finnhub uses US symbols
  try {
    const res = await fetch(`${BASE_URL}/quote?symbol=${cleanSymbol}&token=${token}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`Finnhub Quote HTTP ${res.status}`);
    const data = await res.json();
    if (data.c === undefined || data.c === 0) return null;
    return {
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      timestamp: data.t ? new Date(data.t * 1000).toISOString() : new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`[Finnhub] Error fetching quote for ${symbol}:`, err.message);
    return null;
  }
}

export async function fetchFinnhubProfile(symbol, token) {
  if (!token) return null;
  const cleanSymbol = symbol.toUpperCase().split('.')[0];
  try {
    const res = await fetch(`${BASE_URL}/stock/profile2?symbol=${cleanSymbol}&token=${token}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.name) return null;
    return {
      name: data.name,
      marketCap: data.marketCapitalization ? `${(data.marketCapitalization / 1000).toFixed(2)}B` : undefined,
      currency: data.currency === 'USD' ? '$' : data.currency === 'EUR' ? '€' : data.currency,
      exchange: data.exchange,
      industry: data.finnhubIndustry,
      webUrl: data.weburl,
      sharesOutstanding: data.shareOutstanding,
      country: data.country,
    };
  } catch (err) {
    console.warn(`[Finnhub] Error fetching profile for ${symbol}:`, err.message);
    return null;
  }
}

export async function fetchFinnhubMetrics(symbol, token) {
  if (!token) return null;
  const cleanSymbol = symbol.toUpperCase().split('.')[0];
  try {
    const res = await fetch(`${BASE_URL}/stock/metric?symbol=${cleanSymbol}&metric=all&token=${token}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const m = data.metric || {};
    return {
      per: m.peNormalizedAnnual ? Number(m.peNormalizedAnnual.toFixed(1)) : undefined,
      high52w: m['52WeekHigh'],
      low52w: m['52WeekLow'],
      beta: m.beta ? Number(m.beta.toFixed(2)) : undefined,
      pb: m.pbAnnual ? Number(m.pbAnnual.toFixed(1)) : undefined,
      ps: m.psTTM ? Number(m.psTTM.toFixed(1)) : undefined,
      roic: m.roicTTM ? `${m.roicTTM.toFixed(1)}%` : undefined,
      roe: m.roeTTM ? `${m.roeTTM.toFixed(1)}%` : undefined,
      netMargin: m.netProfitMarginTTM ? `${m.netProfitMarginTTM.toFixed(1)}%` : undefined,
      operatingMargin: m.operatingMarginTTM ? `${m.operatingMarginTTM.toFixed(1)}%` : undefined,
      dividendYield: m.currentDividendYieldTTM ? `${m.currentDividendYieldTTM.toFixed(2)}%` : '0.00%',
    };
  } catch (err) {
    console.warn(`[Finnhub] Error fetching metrics for ${symbol}:`, err.message);
    return null;
  }
}

export async function fetchFinnhubPriceTarget(symbol, token) {
  if (!token) return null;
  const cleanSymbol = symbol.toUpperCase().split('.')[0];
  try {
    const res = await fetch(`${BASE_URL}/stock/price-target?symbol=${cleanSymbol}&token=${token}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.targetMean) return null;
    return {
      targetPrice: data.targetMean,
      targetHigh: data.targetHigh,
      targetLow: data.targetLow,
      targetMedian: data.targetMedian,
      lastUpdated: data.lastUpdated,
    };
  } catch (err) {
    console.warn(`[Finnhub] Error fetching price target for ${symbol}:`, err.message);
    return null;
  }
}

export async function fetchFinnhubRecommendations(symbol, token) {
  if (!token) return null;
  const cleanSymbol = symbol.toUpperCase().split('.')[0];
  try {
    const res = await fetch(`${BASE_URL}/stock/recommendation?symbol=${cleanSymbol}&token=${token}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const latest = data[0];
    const total = (latest.strongBuy || 0) + (latest.buy || 0) + (latest.hold || 0) + (latest.sell || 0) + (latest.strongSell || 0);
    return {
      period: latest.period,
      strongBuy: latest.strongBuy,
      buy: latest.buy,
      hold: latest.hold,
      sell: latest.sell,
      strongSell: latest.strongSell,
      totalAnalysts: total,
      consensusPercentBullish: total > 0 ? Math.round(((latest.strongBuy + latest.buy) / total) * 100) : null,
    };
  } catch (err) {
    console.warn(`[Finnhub] Error fetching recommendations for ${symbol}:`, err.message);
    return null;
  }
}

export async function fetchFinnhubCompanyNews(symbol, token, limit = 5) {
  if (!token) return null;
  const cleanSymbol = symbol.toUpperCase().split('.')[0];
  const now = new Date();
  const past = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // last 14 days
  const toStr = now.toISOString().split('T')[0];
  const fromStr = past.toISOString().split('T')[0];

  try {
    const res = await fetch(`${BASE_URL}/company-news?symbol=${cleanSymbol}&from=${fromStr}&to=${toStr}&token=${token}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data.slice(0, limit).map((n) => ({
      id: String(n.id),
      headline: n.headline,
      summary: n.summary,
      source: n.source,
      url: n.url,
      time: new Date(n.datetime * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      date: new Date(n.datetime * 1000).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      impact: n.headline.toLowerCase().includes('beat') || n.headline.toLowerCase().includes('surge') || n.headline.toLowerCase().includes('record') 
        ? 'Muy Positivo' 
        : n.headline.toLowerCase().includes('drop') || n.headline.toLowerCase().includes('fall') || n.headline.toLowerCase().includes('miss')
        ? 'Negativo' 
        : 'Neutral',
    }));
  } catch (err) {
    console.warn(`[Finnhub] Error fetching company news for ${symbol}:`, err.message);
    return null;
  }
}

export async function fetchFinnhubMarketNews(token, limit = 6) {
  if (!token) return null;
  try {
    const res = await fetch(`${BASE_URL}/news?category=general&token=${token}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data.slice(0, limit).map((n) => ({
      id: String(n.id),
      title: n.headline,
      summary: n.summary,
      source: n.source,
      url: n.url,
      time: `Hace ${Math.max(2, Math.floor((Date.now() - n.datetime * 1000) / (1000 * 60)))} min`,
      tag: n.category ? n.category.toUpperCase() : 'MERCADOS',
      impact: 'Mercado Global',
    }));
  } catch (err) {
    console.warn('[Finnhub] Error fetching general news:', err.message);
    return null;
  }
}
