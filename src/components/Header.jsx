import React, { useState, useEffect } from 'react';
import { Search, Globe2, Clock, Lock, RefreshCw, ChevronDown, Activity, Wifi, Database, Menu, X } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export default function Header({ onLockTerminal, onOpenSources, onToggleMobileMenu, isMobileMenuOpen }) {
  const { 
    currentStock, 
    selectTicker, 
    isLoading, 
    refreshActiveStock, 
    lastSync, 
    isLiveMode,
    searchTickers 
  } = useMarket();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [time, setTime] = useState({
    madrid: new Date().toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    ny: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' })
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime({
        madrid: new Date().toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ny: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Debounced search on user input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchTickers(searchQuery);
        setSearchResults(results);
      } catch (e) {
        console.warn('Search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, searchTickers]);

  return (
    <header className="h-16 bg-[#090f20] border-b border-slate-800 px-3 md:px-6 flex items-center justify-between shrink-0 z-20 gap-2">
      {/* Mobile Hamburger toggle & Left Quick universal search */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-xl min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg shrink-0 transition-colors"
          title="Menú de navegación"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isSearching ? (
              <RefreshCw className="h-4 w-4 text-cyan-400 animate-spin" />
            ) : (
              <Search className="h-4 w-4 text-slate-500" />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Buscar ticker (NVDA, MSFT, IBE, SAN...)"
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
          />

          {/* Quick search dropdown */}
          {isDropdownOpen && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#0b132b] border border-slate-700 rounded-lg shadow-2xl py-1 z-50 max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((stock) => (
                  <button
                    key={`${stock.symbol}-${stock.exchange || ''}`}
                    onClick={() => {
                      selectTicker(stock.symbol);
                      setSearchQuery('');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center justify-between transition-colors text-xs border-b border-slate-800/50 last:border-0"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{stock.symbol}</span>
                        <span className="text-[10px] px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {stock.exchange || stock.market}
                        </span>
                        {stock.isLocalPreset && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-blue-950 text-blue-300 font-mono">
                            ANSAMA
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      {stock.price != null && (
                        <div className="font-mono text-white font-medium">
                          {typeof stock.price === 'number' ? stock.price.toFixed(2) : stock.price} {stock.currency || '$'}
                        </div>
                      )}
                      {stock.changePercent != null && (
                        <div className={`text-[10px] font-mono ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stock.changePercent >= 0 ? '+' : ''}{typeof stock.changePercent === 'number' ? stock.changePercent.toFixed(2) : stock.changePercent}%
                        </div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-xs text-slate-400">
                  {isSearching ? 'Buscando en catálogo y pasarelas...' : `No se encontraron coincidencias para "${searchQuery}"`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active stock badge */}
        {currentStock && (
          <div 
            className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-[#0b132b] border border-slate-800 rounded-lg shrink-0 whitespace-nowrap"
            title={`Última cotización oficial de cierre. ${currentStock._dataSource || ''}`}
          >
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-extrabold text-sm text-white">{currentStock.symbol}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono truncate max-w-[100px]">
                {currentStock.exchange?.toUpperCase().includes('NASDAQ') ? 'NASDAQ' : currentStock.exchange || 'Bolsa'}
              </span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <div className="font-mono font-semibold text-xs text-white whitespace-nowrap">
              {typeof currentStock.price === 'number' ? currentStock.price.toFixed(2) : currentStock.price} {currentStock.currency}
            </div>
            <span className={`text-xs font-mono font-bold flex items-center whitespace-nowrap ${
              currentStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {currentStock.change >= 0 ? '+' : ''}{typeof currentStock.changePercent === 'number' ? currentStock.changePercent.toFixed(2) : currentStock.changePercent}%
            </span>
          </div>
        )}
      </div>

      {/* Right: Live Connection Pill, Refresh Button, Dual Clocks & Lock */}
      <div className="flex items-center gap-3">
        {/* Connection status badge (clickable to open SourcesModal) */}
        <button
          onClick={onOpenSources}
          className={`px-2.5 md:px-3 py-1.5 rounded-lg border flex items-center gap-1.5 md:gap-2 transition-all font-mono text-[10px] md:text-[11px] shrink-0 ${
            isLiveMode
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-900/50'
              : 'bg-amber-950/40 border-amber-800 text-amber-300 hover:bg-amber-900/50'
          }`}
          title="Ver estado de conexiones y configurar claves API. Fin de semana: mercados cerrados (se muestra el último precio oficial de cierre)."
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${isLiveMode ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="font-bold">{isLiveMode ? 'EN VIVO' : 'DEMO/CACHÉ'}</span>
          <Database className="w-3 h-3 text-slate-400 hidden sm:inline" />
        </button>

        {/* Refresh button */}
        <button
          onClick={refreshActiveStock}
          disabled={isLoading}
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono disabled:opacity-50"
          title={`Última sincronización: ${lastSync}. Clic para refrescar cotizaciones.`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          <span className="hidden xl:inline text-[11px]">{isLoading ? 'Cargando...' : 'Refrescar'}</span>
        </button>

        {/* Dual Market Clocks */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-[#0b132b] border border-slate-800 rounded-lg text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400 text-[11px]">MADRID:</span>
            <span className="text-white font-medium">{time.madrid}</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-800"></div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
            <span className="text-slate-400 text-[11px]">NY:</span>
            <span className="text-white font-medium">{time.ny}</span>
          </div>
        </div>

        {/* Lock Terminal button */}
        <button
          onClick={onLockTerminal}
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Bloquear Terminal"
        >
          <Lock className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
