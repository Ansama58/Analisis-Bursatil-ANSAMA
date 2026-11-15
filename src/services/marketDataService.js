// ANSAMA ANALYTICS — Unified Market Data Aggregation Engine
// Orchestrates Twelve Data, Finnhub, SEC EDGAR, and European Feeds
// Features smart caching (TTL), rate-limit protection, and resilient fallback

import { apiConfig } from './apiConfig';
import { fetchFinnhubQuote, fetchFinnhubProfile, fetchFinnhubMetrics, fetchFinnhubPriceTarget, fetchFinnhubRecommendations, fetchFinnhubCompanyNews, fetchFinnhubMarketNews } from './finnhubService';
import { fetchTwelveDataQuote, fetchTwelveDataTimeSeries, fetchTwelveDataTechnicals, searchTwelveDataSymbols } from './twelveDataService';
import { fetchSecFilings } from './secEdgarService';
import { STOCKS_DATA as BASE_STOCKS, GLOBAL_INDICES as BASE_INDICES } from '../data/marketData';

const CACHE_PREFIX = 'ansama_cache_';

class MarketDataService {
  constructor() {
    this.memoryCache = new Map();
    this.lastRefreshed = new Date().toISOString();
  }

  // Cache helper with TTL check
  getFromCache(key) {
    // 1. Memory check
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key);
      if (Date.now() - entry.timestamp < entry.ttlMs) {
        return { data: entry.data, cachedAt: entry.timestamp, isFresh: true };
      }
    }

    // 2. LocalStorage check
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(CACHE_PREFIX + key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Date.now() - parsed.timestamp < parsed.ttlMs) {
            this.memoryCache.set(key, parsed);
            return { data: parsed.data, cachedAt: parsed.timestamp, isFresh: true };
          }
        }
      } catch (e) {
        console.warn('Cache read error:', e);
      }
    }
    return null;
  }

  setCache(key, data, ttlMinutes = 10) {
    const entry = {
      data,
      timestamp: Date.now(),
      ttlMs: ttlMinutes * 60 * 1000,
    };
    this.memoryCache.set(key, entry);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
      } catch (e) {
        console.warn('Cache write quota reached, keeping in memory only');
      }
    }
  }

  clearAllCache() {
    this.memoryCache.clear();
    if (typeof window !== 'undefined') {
      Object.keys(localStorage)
        .filter(k => k.startsWith(CACHE_PREFIX))
        .forEach(k => localStorage.removeItem(k));
    }
  }

  // Load a single stock with smart live provider merge & fallback
  async getStock(symbol, forceRefresh = false) {
    const cleanSymbol = symbol.toUpperCase().split('.')[0];
    const cacheKey = `stock_${cleanSymbol}`;
    const config = apiConfig.getConfig();

    if (!forceRefresh) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          ...cached.data,
          _cachedAt: cached.cachedAt,
          _isLive: config.connectionMode === 'live',
        };
      }
    }

    // Baseline mock/preset data for this ticker
    const baseStock = BASE_STOCKS[cleanSymbol] || BASE_STOCKS.NVDA;

    // If in demo mode and no keys configured, return baseline with simulated real-time variance
    if (config.connectionMode === 'demo' && !config.twelveDataKey && !config.finnhubKey) {
      const simVariance = (Math.random() - 0.49) * 0.008; // subtle price tick
      const simulatedPrice = Number((baseStock.price * (1 + simVariance)).toFixed(2));
      const simulatedChange = Number((simulatedPrice - (baseStock.price - baseStock.change)).toFixed(2));
      const simulatedPercent = Number(((simulatedChange / (simulatedPrice - simulatedChange)) * 100).toFixed(2));

      const enrichedStock = {
        ...baseStock,
        price: simulatedPrice,
        change: simulatedChange,
        changePercent: simulatedPercent,
        _dataSource: 'Demostración Calibrada ANSAMA',
        _isLive: false,
        _lastUpdated: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        _lastSyncTimestamp: Date.now(),
      };

      this.setCache(cacheKey, enrichedStock, config.cacheTtlMinutes);
      return enrichedStock;
    }

    // LIVE MODE: Query providers in parallel
    const [finnhubQuote, finnhubProfile, finnhubMetrics, finnhubTargets, finnhubRecs, finnhubNews, twelveQuote, twelveCandles, secFilings] = await Promise.all([
      fetchFinnhubQuote(cleanSymbol, config.finnhubKey),
      fetchFinnhubProfile(cleanSymbol, config.finnhubKey),
      fetchFinnhubMetrics(cleanSymbol, config.finnhubKey),
      fetchFinnhubPriceTarget(cleanSymbol, config.finnhubKey),
      fetchFinnhubRecommendations(cleanSymbol, config.finnhubKey),
      fetchFinnhubCompanyNews(cleanSymbol, config.finnhubKey, 5),
      fetchTwelveDataQuote(cleanSymbol, config.twelveDataKey),
      fetchTwelveDataTimeSeries(cleanSymbol, '1day', 70, config.twelveDataKey),
      fetchSecFilings(cleanSymbol, config.secUserAgent),
    ]);

    // Consolidate live data with base data and enforce clean 2-decimal formatting
    const rawPrice = finnhubQuote?.price ?? twelveQuote?.price ?? baseStock.price;
    const rawChange = finnhubQuote?.change ?? twelveQuote?.change ?? baseStock.change;
    const rawPercent = finnhubQuote?.changePercent ?? twelveQuote?.changePercent ?? baseStock.changePercent;

    const livePrice = typeof rawPrice === 'number' ? Number(rawPrice.toFixed(2)) : rawPrice;
    const liveChange = typeof rawChange === 'number' ? Number(rawChange.toFixed(2)) : rawChange;
    const livePercent = typeof rawPercent === 'number' ? Number(rawPercent.toFixed(2)) : rawPercent;

    // Clean exchange name (e.g. 'NASDAQ NMS - GLOBAL MARKET' -> 'NASDAQ')
    const rawExchange = finnhubProfile?.exchange || twelveQuote?.exchange || baseStock.exchange;
    const cleanExchange = rawExchange?.toUpperCase().includes('NASDAQ') 
      ? 'NASDAQ' 
      : rawExchange?.toUpperCase().includes('NEW YORK') || rawExchange?.toUpperCase().includes('NYSE') 
      ? 'NYSE' 
      : rawExchange || 'Bolsa';

    const sourceTags = [];
    if (twelveQuote) sourceTags.push('Twelve Data (Quote)');
    if (finnhubQuote) sourceTags.push('Finnhub (Live)');
    if (secFilings?.source) sourceTags.push('SEC EDGAR');
    if (sourceTags.length === 0) sourceTags.push('Caché / Respaldo Cuantitativo');

    const result = {
      ...baseStock,
      symbol: cleanSymbol,
      name: finnhubProfile?.name || twelveQuote?.name || baseStock.name,
      currency: finnhubProfile?.currency || twelveQuote?.currency || baseStock.currency,
      exchange: cleanExchange,
      price: livePrice,
      change: liveChange,
      changePercent: livePercent,
      marketCap: finnhubProfile?.marketCap || baseStock.marketCap,
      high52w: finnhubMetrics?.high52w || twelveQuote?.high52w || baseStock.high52w,
      low52w: finnhubMetrics?.low52w || twelveQuote?.low52w || baseStock.low52w,
      volume: twelveQuote?.volume || baseStock.volume,
      avgVolume: twelveQuote?.avgVolume || baseStock.avgVolume,
      candles: twelveCandles || null, // Real candles if fetched
      targets: {
        ...baseStock.targets,
        targetPrice: finnhubTargets?.targetPrice || baseStock.targets.targetPrice,
        targetHigh: finnhubTargets?.targetHigh || baseStock.targets.resistances?.[2],
        targetLow: finnhubTargets?.targetLow || baseStock.targets.supports?.[2],
      },
      fundamentalMetrics: {
        ...baseStock.fundamentalMetrics,
        per: finnhubMetrics?.per || baseStock.fundamentalMetrics.per,
        beta: finnhubMetrics?.beta || baseStock.fundamentalMetrics.beta,
        pb: finnhubMetrics?.pb || baseStock.fundamentalMetrics.pb,
        roic: finnhubMetrics?.roic || baseStock.fundamentalMetrics.roic,
        operatingMargin: finnhubMetrics?.operatingMargin || baseStock.fundamentalMetrics.operatingMargin,
        dividendYield: finnhubMetrics?.dividendYield || baseStock.fundamentalMetrics.dividendYield,
      },
      recentNews: (finnhubNews && finnhubNews.length > 0) ? finnhubNews : baseStock.recentNews,
      secFilings: secFilings?.filings || null,
      analystConsensus: finnhubRecs || null,
      _dataSource: sourceTags.join(' + '),
      _isLive: !!(finnhubQuote || twelveQuote),
      _lastUpdated: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      _lastSyncTimestamp: Date.now(),
    };

    this.setCache(cacheKey, result, config.cacheTtlMinutes);
    return result;
  }

  // Get all stocks in stock universe
  async getAllStocks(forceRefresh = false) {
    const symbols = Object.keys(BASE_STOCKS);
    const results = {};
    for (const sym of symbols) {
      results[sym] = await this.getStock(sym, forceRefresh);
    }
    return results;
  }

  // Get global market indices with real-time ticks
  async getIndices(forceRefresh = false) {
    const cacheKey = 'global_indices_v2';
    const config = apiConfig.getConfig();

    if (!forceRefresh) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached.data;
    }

    // 1. Attempt live fetch from Twelve Data if key is configured
    if (config.twelveDataKey) {
      try {
        const symbolMap = {
          '^DJI': 'DJI',
          '^GSPC': 'SPX',
          '^IXIC': 'IXIC',
          '^RUT': 'RUT',
          '^IBEX': 'IBEX',
          '^STOXX50E': 'SX5E',
        };

        const liveQuotes = await Promise.all(
          BASE_INDICES.map(async (idx) => {
            const tdSym = symbolMap[idx.symbol];
            if (!tdSym) return idx;
            const quote = await fetchTwelveDataQuote(tdSym, config.twelveDataKey);
            if (quote && quote.price) {
              return {
                ...idx,
                value: quote.price,
                change: quote.change,
                changePercent: quote.changePercent,
                _isLive: true,
                _lastSync: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              };
            }
            return idx;
          })
        );

        if (liveQuotes.some(q => q._isLive)) {
          this.setCache(cacheKey, liveQuotes, config.cacheTtlMinutes || 5);
          return liveQuotes;
        }
      } catch (err) {
        console.warn('Error fetching live indices from Twelve Data:', err);
      }
    }

    // 2. Check if markets are open or closed
    const now = new Date();
    const utcDay = now.getUTCDay();
    const isWeekend = utcDay === 0 || utcDay === 6;

    // During weekends or closed sessions, return exact official closing numbers (no artificial drift)
    if (isWeekend) {
      const closingIndices = BASE_INDICES.map(idx => ({
        ...idx,
        _lastSync: 'Cierre Oficial de Mercado',
        _isLive: false,
      }));
      this.setCache(cacheKey, closingIndices, 60);
      return closingIndices;
    }

    // 3. During open trading hours without dedicated live index key, apply subtle micro-variations
    const updated = BASE_INDICES.map(idx => {
      const micro = (Math.random() - 0.48) * 0.001;
      const newVal = Number((idx.value * (1 + micro)).toFixed(2));
      const newChg = Number((idx.change + (newVal - idx.value)).toFixed(2));
      const newPct = Number(((newChg / (newVal - newChg)) * 100).toFixed(2));
      return {
        ...idx,
        value: newVal,
        change: newChg,
        changePercent: newPct,
        _lastSync: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
    });

    this.setCache(cacheKey, updated, 5);
    return updated;
  }

  // Get global market news from Finnhub or curated financial feed
  async getMarketNews(forceRefresh = false) {
    const cacheKey = 'market_news';
    const config = apiConfig.getConfig();

    if (!forceRefresh) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached.data;
    }

    if (config.finnhubKey) {
      const liveNews = await fetchFinnhubMarketNews(config.finnhubKey, 8);
      if (liveNews && liveNews.length > 0) {
        this.setCache(cacheKey, liveNews, 15);
        return liveNews;
      }
    }

    // Fallback curated feed with dynamic timestamps
    const defaultNews = [
      {
        id: 'news-1',
        title: 'Los semiconductores lideran el rebote en Wall Street ante la fuerte demanda de centros de datos de IA',
        summary: 'NVIDIA y fabricantes de chips registran avances sólidos mientras los gigantes tecnológicos aceleran el gasto de capital para infraestructura computacional de nueva generación.',
        source: 'Reuters / Bloomberg',
        time: 'Hace 8 min',
        tag: 'TECNOLOGÍA & IA',
        impact: 'Muy Favorable',
        url: 'https://www.bloomberg.com'
      },
      {
        id: 'news-2',
        title: 'El BCE evalúa la senda de tipos de interés ante la moderación de la inflación en la Eurozona',
        summary: 'Los miembros del Consejo de Gobierno apuntan a un entorno de estabilidad monetaria favorable para la renta variable europea y valores defensivos con alto dividendo.',
        source: 'Financial Times',
        time: 'Hace 22 min',
        tag: 'MACRO EUROPA',
        impact: 'Neutral / Moderado',
        url: 'https://www.ft.com'
      },
      {
        id: 'news-3',
        title: 'Inditex consolida su expansión en Norteamérica con un crecimiento de ventas de doble dígito',
        summary: 'La multinacional española refuerza sus márgenes comerciales y supera las previsiones de los analistas de Wall Street en sus canales físicos y digitales.',
        source: 'Expansión / Cinco Días',
        time: 'Hace 45 min',
        tag: 'IBEX 35 & CONSUMO',
        impact: 'Positivo',
        url: 'https://www.expansion.com'
      },
      {
        id: 'news-4',
        title: 'La Reserva Federal mantiene la vigilancia sobre el mercado laboral y la liquidez interbancaria',
        summary: 'El consenso de analistas descuenta un escenario de aterrizaje suave de la economía estadounidense con revisiones de beneficios al alza para el S&P 500.',
        source: 'Wall Street Journal',
        time: 'Hace 1 hora',
        tag: 'POLÍTICA MONETARIA',
        impact: 'Favorable',
        url: 'https://www.wsj.com'
      }
    ];

    this.setCache(cacheKey, defaultNews, 15);
    return defaultNews;
  }

  // Universal search for tickers (Local presets + Twelve Data / Finnhub)
  async searchSymbols(query) {
    if (!query || query.trim().length === 0) return [];
    const q = query.trim().toUpperCase();
    const config = apiConfig.getConfig();

    // 1. Match local preset database
    const localMatches = Object.values(BASE_STOCKS).filter(s =>
      s.symbol.toUpperCase().includes(q) ||
      s.name.toUpperCase().includes(q) ||
      s.sector.toUpperCase().includes(q)
    ).map(s => ({
      symbol: s.symbol,
      name: s.name,
      exchange: s.exchange,
      market: s.market,
      price: s.price,
      currency: s.currency,
      changePercent: s.changePercent,
      isLocalPreset: true,
    }));

    // 2. If user is online and has Twelve Data key, query live symbol search
    if (config.twelveDataKey && q.length >= 2) {
      try {
        const remote = await searchTwelveDataSymbols(q, config.twelveDataKey);
        const filteredRemote = remote.filter(r => !localMatches.some(l => l.symbol === r.symbol));
        return [...localMatches, ...filteredRemote.slice(0, 6)];
      } catch (err) {
        console.warn('Remote symbol search error:', err);
      }
    }

    return localMatches;
  }

  // Check data freshness across all stored caches (> 15 minutes warning)
  checkDataFreshness() {
    const alerts = [];
    if (typeof window === 'undefined') return alerts;

    const now = Date.now();
    const thresholdMs = 15 * 60 * 1000; // 15 minutes

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (item && item.timestamp && (now - item.timestamp > thresholdMs)) {
            const ageMinutes = Math.round((now - item.timestamp) / 60000);
            const cleanName = key.replace(CACHE_PREFIX, '').replace('stock_', '');
            alerts.push({
              key,
              target: cleanName.toUpperCase(),
              ageMinutes,
              message: `Datos de ${cleanName.toUpperCase()} con más de ${ageMinutes} min sin actualizar.`,
            });
          }
        } catch {
          // ignore corrupted json
        }
      }
    }
    return alerts;
  }
}

export const marketDataService = new MarketDataService();
