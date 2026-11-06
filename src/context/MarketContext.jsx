import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { marketDataService } from '../services/marketDataService';
import { apiConfig } from '../services/apiConfig';
import { calculateAnsamaScores, getStoredWeights, saveStoredWeights } from '../services/aiScoringEngine';
import { calculatePredictiveEstimates } from '../services/aiPredictiveModel';
import { generateMultiAgentDeliberation } from '../services/aiMultiAgentEngine';
import { 
  getStoredRecommendations, 
  saveStoredRecommendations, 
  calculateHistoricalSummary, 
  auditRecommendationsAgainstLive, 
  recordNewRecommendation 
} from '../services/historyAuditService';
import { STOCKS_DATA as INITIAL_STOCKS, GLOBAL_INDICES as INITIAL_INDICES } from '../data/marketData';

const MarketContext = createContext(null);

/**
 * Enriches any stock data object with the dynamic AI engine (Scoring, Multi-Agent & Predictor)
 */
function enrichStockWithAi(rawStock, weights, horizon = '3M') {
  if (!rawStock) return rawStock;
  const scoring = calculateAnsamaScores(rawStock, weights);
  const predictions = calculatePredictiveEstimates(rawStock, horizon, scoring.ansamaScore);
  const deliberation = generateMultiAgentDeliberation(rawStock, scoring, predictions);

  return {
    ...rawStock,
    ansamaScore: scoring.ansamaScore,
    bias: scoring.bias,
    biasColor: scoring.biasColor,
    scores: scoring.scores,
    elevatingFactors: scoring.elevatingFactors,
    reducingFactors: scoring.reducingFactors,
    weightsUsed: scoring.weights,
    probabilities: {
      outperform3M: predictions.outperformProbability,
      positiveReturn: predictions.positiveReturnProbability,
      downsideRisk: predictions.downsideRisk,
      targetReturnPotential: predictions.targetReturnPotential,
      potentialLoss: predictions.potentialLoss,
      confidence: predictions.confidence,
      riskRewardRatio: predictions.riskRewardRatio,
      horizon: predictions.horizon,
      allHorizons: predictions.allHorizons,
    },
    agentsDeliberation: deliberation,
  };
}

export function MarketProvider({ children }) {
  const [aiWeights, setAiWeights] = useState(() => getStoredWeights());
  const [selectedHorizon, setSelectedHorizon] = useState('3M'); // '1M' | '3M' | '6M' | '12M'

  // Pre-enrich initial stock dictionary
  const [rawStocks, setRawStocks] = useState(INITIAL_STOCKS);
  const [selectedTicker, setSelectedTicker] = useState('NVDA');
  const [indices, setIndices] = useState(INITIAL_INDICES);
  const [marketNews, setMarketNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiDeliberating, setIsAiDeliberating] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [apiState, setApiState] = useState({
    config: apiConfig.getConfig(),
    statuses: apiConfig.getProviderStatuses(),
  });
  const [freshnessAlerts, setFreshnessAlerts] = useState([]);

  // Track Record & Audit state (Etapa 4)
  const [recommendations, setRecommendations] = useState(() => getStoredRecommendations());

  // Memoized enriched stocks with AI evaluation
  const stocks = useMemo(() => {
    const result = {};
    for (const [key, val] of Object.entries(rawStocks)) {
      result[key] = enrichStockWithAi(val, aiWeights, selectedHorizon);
    }
    return result;
  }, [rawStocks, aiWeights, selectedHorizon]);

  // Dynamic audit summary KPI calculation
  const historicalSummary = useMemo(() => {
    return calculateHistoricalSummary(recommendations);
  }, [recommendations]);

  // Subscribe to API config changes
  useEffect(() => {
    const unsub = apiConfig.subscribe((updated) => {
      setApiState(updated);
    });
    return unsub;
  }, []);

  // Initial load
  useEffect(() => {
    let isMounted = true;

    async function init() {
      setIsLoading(true);
      try {
        const [loadedIndices, loadedNews, currentStockData] = await Promise.all([
          marketDataService.getIndices(),
          marketDataService.getMarketNews(),
          marketDataService.getStock(selectedTicker),
        ]);

        if (isMounted) {
          if (loadedIndices) setIndices(loadedIndices);
          if (loadedNews) setMarketNews(loadedNews);
          if (currentStockData) {
            setRawStocks((prev) => ({
              ...prev,
              [selectedTicker]: currentStockData,
            }));
          }
          setFreshnessAlerts(marketDataService.checkDataFreshness());
          setLastSync(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch (err) {
        console.warn('Initial market load error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    init();
    return () => { isMounted = false; };
  }, []);

  // Load or refresh a specific stock when selected
  const selectTicker = useCallback(async (ticker) => {
    const clean = ticker.toUpperCase().split('.')[0];
    setSelectedTicker(clean);

    // If we don't have fresh data for this ticker, fetch it
    if (!rawStocks[clean] || !rawStocks[clean]._lastSyncTimestamp || (Date.now() - rawStocks[clean]._lastSyncTimestamp > 60000)) {
      setIsLoading(true);
      try {
        const stockData = await marketDataService.getStock(clean);
        if (stockData) {
          setRawStocks((prev) => ({
            ...prev,
            [clean]: stockData,
          }));
        }
      } catch (err) {
        console.warn(`Error loading stock ${clean}:`, err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [rawStocks]);

  // Re-run AI deliberation explicitly
  const runAiDeliberation = useCallback(async () => {
    setIsAiDeliberating(true);
    await new Promise(res => setTimeout(res, 800));
    setRawStocks(prev => ({ ...prev }));
    setIsAiDeliberating(false);
  }, []);

  // Update AI custom weights
  const updateAiWeights = useCallback((newWeights) => {
    setAiWeights(newWeights);
    saveStoredWeights(newWeights);
  }, []);

  // Record a recommendation into track record (Etapa 4)
  const recordRecommendation = useCallback((stockToRecord, horizon) => {
    const targetStock = stockToRecord || stocks[selectedTicker] || stocks.NVDA;
    const { updatedList, newEntry } = recordNewRecommendation(targetStock, horizon || selectedHorizon);
    setRecommendations(updatedList);
    return newEntry;
  }, [stocks, selectedTicker, selectedHorizon]);

  // Live audit verification against market (Etapa 4)
  const auditLiveRecommendations = useCallback(() => {
    setRecommendations((prev) => {
      const audited = auditRecommendationsAgainstLive(prev, stocks);
      saveStoredRecommendations(audited);
      return audited;
    });
  }, [stocks]);

  // Restore/import full recommendations from backup
  const restoreRecommendations = useCallback((newList) => {
    if (Array.isArray(newList)) {
      setRecommendations(newList);
      saveStoredRecommendations(newList);
    }
  }, []);

  // Refresh active stock data
  const refreshActiveStock = useCallback(async () => {
    setIsLoading(true);
    try {
      const updated = await marketDataService.getStock(selectedTicker, true);
      const updatedIndices = await marketDataService.getIndices(true);
      const updatedNews = await marketDataService.getMarketNews(true);

      if (updated) {
        setRawStocks((prev) => ({
          ...prev,
          [selectedTicker]: updated,
        }));
      }
      if (updatedIndices) setIndices(updatedIndices);
      if (updatedNews) setMarketNews(updatedNews);

      setFreshnessAlerts(marketDataService.checkDataFreshness());
      setLastSync(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTicker]);

  // Refresh entire terminal dataset
  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allStocks, updatedIndices, updatedNews] = await Promise.all([
        marketDataService.getAllStocks(true),
        marketDataService.getIndices(true),
        marketDataService.getMarketNews(true),
      ]);

      if (allStocks) setRawStocks(allStocks);
      if (updatedIndices) setIndices(updatedIndices);
      if (updatedNews) setMarketNews(updatedNews);

      setFreshnessAlerts(marketDataService.checkDataFreshness());
      setLastSync(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('Refresh all error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update API configuration
  const updateApiConfig = useCallback((newConfig) => {
    apiConfig.saveConfig(newConfig);
  }, []);

  // Test provider connection
  const testProvider = useCallback(async (providerId) => {
    return await apiConfig.testConnection(providerId);
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    marketDataService.clearAllCache();
    setFreshnessAlerts([]);
  }, []);

  // Search tickers
  const searchTickers = useCallback(async (query) => {
    return await marketDataService.searchSymbols(query);
  }, []);

  const currentStock = stocks[selectedTicker] || stocks.NVDA || INITIAL_STOCKS.NVDA;

  const value = {
    stocks,
    selectedTicker,
    currentStock,
    indices,
    marketNews,
    isLoading,
    isAiDeliberating,
    lastSync,
    apiConfig: apiState.config,
    providerStatuses: apiState.statuses,
    isLiveMode: apiState.config.connectionMode === 'live',
    freshnessAlerts,
    aiWeights,
    selectedHorizon,
    recommendations,
    historicalSummary,
    recordRecommendation,
    auditLiveRecommendations,
    restoreRecommendations,
    setSelectedHorizon,
    updateAiWeights,
    runAiDeliberation,
    selectTicker,
    refreshActiveStock,
    refreshAll,
    updateApiConfig,
    testProvider,
    clearCache,
    searchTickers,
  };

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}
