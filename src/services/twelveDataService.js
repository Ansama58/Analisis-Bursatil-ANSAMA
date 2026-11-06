// Twelve Data Financial API Connector for ANSAMA ANALYTICS
// Fetches quotes, historical time series (candlesticks), technical indicators (RSI, MACD, BBands), and symbol search

const BASE_URL = 'https://api.twelvedata.com';

export async function fetchTwelveDataQuote(symbol, apiKey) {
  if (!apiKey) return null;
  try {
    const res = await fetch(`${BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code || !data.close) return null;

    const close = parseFloat(data.close);
    const prevClose = parseFloat(data.previous_close || data.open || close);
    const change = parseFloat(data.change || (close - prevClose));
    const percentChange = parseFloat(data.percent_change || ((change / prevClose) * 100));

    return {
      symbol: data.symbol,
      name: data.name,
      exchange: data.exchange,
      currency: data.currency === 'USD' ? '$' : data.currency === 'EUR' ? '€' : data.currency,
      price: close,
      change: Number(change.toFixed(2)),
      changePercent: Number(percentChange.toFixed(2)),
      open: parseFloat(data.open),
      high: parseFloat(data.high),
      low: parseFloat(data.low),
      volume: data.volume ? (parseInt(data.volume, 10) > 1000000 ? `${(parseInt(data.volume, 10) / 1000000).toFixed(1)}M` : String(data.volume)) : undefined,
      avgVolume: data.average_volume ? `${(parseInt(data.average_volume, 10) / 1000000).toFixed(1)}M` : undefined,
      high52w: data.fifty_two_week?.high ? parseFloat(data.fifty_two_week.high) : undefined,
      low52w: data.fifty_two_week?.low ? parseFloat(data.fifty_two_week.low) : undefined,
      datetime: data.datetime,
    };
  } catch (err) {
    console.warn(`[TwelveData] Error fetching quote for ${symbol}:`, err.message);
    return null;
  }
}

export async function fetchTwelveDataTimeSeries(symbol, interval = '1day', outputsize = 70, apiKey) {
  if (!apiKey) return null;
  try {
    const res = await fetch(`${BASE_URL}/time_series?symbol=${encodeURIComponent(symbol)}&interval=${interval}&outputsize=${outputsize}&apikey=${apiKey}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code || !Array.isArray(data.values) || data.values.length === 0) return null;

    // Convert Twelve Data DESC format to ASC chronology for charts
    const sorted = [...data.values].reverse();
    return sorted.map((item) => {
      const open = parseFloat(item.open);
      const close = parseFloat(item.close);
      const high = parseFloat(item.high);
      const low = parseFloat(item.low);
      const volume = parseInt(item.volume || '0', 10);
      const dateObj = new Date(item.datetime);

      return {
        date: dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
        isBull: close >= open,
      };
    });
  } catch (err) {
    console.warn(`[TwelveData] Error fetching time series for ${symbol}:`, err.message);
    return null;
  }
}

export async function fetchTwelveDataTechnicals(symbol, apiKey) {
  if (!apiKey) return null;
  try {
    // Fetch RSI (14)
    const rsiRes = await fetch(`${BASE_URL}/rsi?symbol=${encodeURIComponent(symbol)}&interval=1day&time_period=14&apikey=${apiKey}`, { signal: AbortSignal.timeout(5000) });
    let rsiValue = null;
    if (rsiRes.ok) {
      const rsiJson = await rsiRes.json();
      if (rsiJson.values && rsiJson.values[0]) {
        rsiValue = parseFloat(rsiJson.values[0].rsi);
      }
    }

    // Fetch MACD
    const macdRes = await fetch(`${BASE_URL}/macd?symbol=${encodeURIComponent(symbol)}&interval=1day&apikey=${apiKey}`, { signal: AbortSignal.timeout(5000) });
    let macdText = null;
    if (macdRes.ok) {
      const macdJson = await macdRes.json();
      if (macdJson.values && macdJson.values[0]) {
        const m = parseFloat(macdJson.values[0].macd);
        const s = parseFloat(macdJson.values[0].macd_signal);
        macdText = m > s ? `Alcista (+${m.toFixed(2)})` : `Bajista (${m.toFixed(2)})`;
      }
    }

    // Fetch Bollinger Bands
    const bbRes = await fetch(`${BASE_URL}/bbands?symbol=${encodeURIComponent(symbol)}&interval=1day&apikey=${apiKey}`, { signal: AbortSignal.timeout(5000) });
    let upperBB = null;
    let lowerBB = null;
    if (bbRes.ok) {
      const bbJson = await bbRes.json();
      if (bbJson.values && bbJson.values[0]) {
        upperBB = parseFloat(bbJson.values[0].upper_band);
        lowerBB = parseFloat(bbJson.values[0].lower_band);
      }
    }

    return {
      rsi14: rsiValue ? Number(rsiValue.toFixed(1)) : undefined,
      macd: macdText || undefined,
      bollingerUpper: upperBB ? Number(upperBB.toFixed(2)) : undefined,
      bollingerLower: lowerBB ? Number(lowerBB.toFixed(2)) : undefined,
    };
  } catch (err) {
    console.warn(`[TwelveData] Error fetching technicals for ${symbol}:`, err.message);
    return null;
  }
}

export async function searchTwelveDataSymbols(query, apiKey) {
  if (!query || query.trim().length < 1) return [];
  if (!apiKey) return [];
  try {
    const res = await fetch(`${BASE_URL}/symbol_search?symbol=${encodeURIComponent(query)}&outputsize=10&apikey=${apiKey}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data.data)) return [];

    return data.data.map(item => ({
      symbol: item.symbol,
      name: item.instrument_name,
      exchange: item.exchange,
      country: item.country,
      currency: item.currency,
      type: item.instrument_type,
      market: item.country === 'United States' ? 'US' : 'Europe',
    }));
  } catch (err) {
    console.warn(`[TwelveData] Symbol search error:`, err.message);
    return [];
  }
}
