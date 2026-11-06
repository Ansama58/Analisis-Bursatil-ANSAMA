import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  ExternalLink, 
  RefreshCw, 
  Key, 
  Radio, 
  Activity, 
  ShieldCheck, 
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Zap,
  Info
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { PROVIDERS } from '../../services/apiConfig';

export default function SourcesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { 
    apiConfig, 
    providerStatuses, 
    updateApiConfig, 
    testProvider, 
    clearCache,
    lastSync,
    isLiveMode 
  } = useMarket();

  const [activeTab, setActiveTab] = useState('connections'); // 'connections' | 'api-keys' | 'audit'
  const [twelveDataKey, setTwelveDataKey] = useState(apiConfig.twelveDataKey || '');
  const [finnhubKey, setFinnhubKey] = useState(apiConfig.finnhubKey || '');
  const [secUserAgent, setSecUserAgent] = useState(apiConfig.secUserAgent || '');
  const [connectionMode, setConnectionMode] = useState(apiConfig.connectionMode || 'demo');
  const [cacheTtl, setCacheTtl] = useState(apiConfig.cacheTtlMinutes || 10);

  const [showKey, setShowKey] = useState({ twelve: false, finnhub: false });
  const [testingStatus, setTestingStatus] = useState({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [cacheClearedMsg, setCacheClearedMsg] = useState(false);

  const handleSaveKeys = (e) => {
    e.preventDefault();
    updateApiConfig({
      twelveDataKey: twelveDataKey.trim(),
      finnhubKey: finnhubKey.trim(),
      secUserAgent: secUserAgent.trim(),
      connectionMode,
      cacheTtlMinutes: Number(cacheTtl),
    });
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleTestConnection = async (providerId) => {
    setTestingStatus(prev => ({ ...prev, [providerId]: { loading: true } }));
    const result = await testProvider(providerId);
    setTestingStatus(prev => ({ 
      ...prev, 
      [providerId]: { 
        loading: false, 
        success: result.success, 
        message: result.message || result.error,
        latency: result.latency 
      } 
    }));
  };

  const handleTestAll = async () => {
    for (const key of Object.keys(PROVIDERS)) {
      await handleTestConnection(PROVIDERS[key].id);
    }
  };

  const handleClearCache = () => {
    clearCache();
    setCacheClearedMsg(true);
    setTimeout(() => setCacheClearedMsg(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-3xl w-full terminal-card p-6 bg-[#0a1124] border border-slate-700 shadow-2xl space-y-5 rounded-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Centro de Conexiones Financieras & APIs
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  isLiveMode 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {isLiveMode ? '● Modo En Vivo (APIs)' : '● Modo Respaldo / Demo'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Arquitectura multi-proveedor de ANSAMA: Twelve Data, Finnhub, SEC EDGAR y Euronext/BME.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 text-xs font-mono shrink-0">
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'connections'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>1. Estado & Latencias</span>
          </button>
          <button
            onClick={() => setActiveTab('api-keys')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'api-keys'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>2. Configuración de Claves</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'audit'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. Integridad & Caché</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: Connections & Latency */}
          {activeTab === 'connections' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Última comprobación del terminal: <strong className="text-white font-mono">{lastSync}</strong></span>
                </span>
                <button
                  onClick={handleTestAll}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] font-bold rounded flex items-center gap-1.5 transition-all border border-slate-700"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Probar Todas las Conexiones</span>
                </button>
              </div>

              <div className="space-y-3">
                {Object.values(PROVIDERS).map((p) => {
                  const statusInfo = providerStatuses[p.id] || { status: 'standby', latency: null };
                  const testState = testingStatus[p.id];
                  const isOnline = statusInfo.status === 'online' || (testState && testState.success);

                  return (
                    <div 
                      key={p.id} 
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-white text-xs">{p.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                            isOnline 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                              : statusInfo.status === 'error'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800/60'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {isOnline ? 'EN LÍNEA' : statusInfo.status === 'unconfigured' ? 'SIN CLAVE (FALLBACK)' : 'EN ESPERA'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">({p.freeQuota})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">{p.category}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">Cobertura: {p.coverage}</div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right font-mono text-xs">
                          <div className="text-[11px] text-emerald-400 font-bold">
                            {testState?.latency || statusInfo.latency || 'Latencia: --'}
                          </div>
                          {statusInfo.lastPing && (
                            <div className="text-[9px] text-slate-500">
                              Ping: {new Date(statusInfo.lastPing).toLocaleTimeString('es-ES')}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleTestConnection(p.id)}
                          disabled={testState?.loading}
                          className="px-2.5 py-1.5 bg-blue-900/50 hover:bg-blue-800/80 text-blue-200 border border-blue-700/50 rounded text-xs font-mono flex items-center gap-1 transition-all disabled:opacity-50"
                        >
                          {testState?.loading ? (
                            <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                          ) : (
                            <Zap className="w-3 h-3 text-cyan-400" />
                          )}
                          <span>Ping Test</span>
                        </button>

                        <a
                          href={p.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition-colors"
                          title="Ver documentación oficial"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: API Keys Management */}
          {activeTab === 'api-keys' && (
            <form onSubmit={handleSaveKeys} className="space-y-4">
              <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-lg text-xs text-slate-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Modo Híbrido & Desacoplado:</strong> Puedes utilizar ANSAMA ANALYTICS inmediatamente sin claves (utilizando la base de datos de respaldo cuantitativo de demostración) o introducir tus propias API keys gratuitas para obtener cotizaciones y fundamentales en tiempo real de Wall Street y Europa.
                </div>
              </div>

              {/* Mode Selector */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <label className="text-xs font-mono font-bold text-white block mb-2">Modo Operativo de Conexión</label>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <label className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition-all ${
                    connectionMode === 'live' 
                      ? 'bg-blue-950/80 border-blue-500 text-white' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}>
                    <input 
                      type="radio" 
                      name="connMode" 
                      checked={connectionMode === 'live'} 
                      onChange={() => setConnectionMode('live')}
                      className="hidden" 
                    />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <div>
                      <div className="font-bold">Modo En Vivo (APIs)</div>
                      <div className="text-[10px] text-slate-400">Consulta Twelve Data y Finnhub</div>
                    </div>
                  </label>

                  <label className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition-all ${
                    connectionMode === 'demo' 
                      ? 'bg-blue-950/80 border-blue-500 text-white' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}>
                    <input 
                      type="radio" 
                      name="connMode" 
                      checked={connectionMode === 'demo'} 
                      onChange={() => setConnectionMode('demo')}
                      className="hidden" 
                    />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div>
                      <div className="font-bold">Modo Demostración / Respaldo</div>
                      <div className="text-[10px] text-slate-400">Datos locales calibrados de muestra</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Twelve Data Key */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                    <span>Twelve Data API Key</span>
                    <span className="text-[10px] text-slate-400 font-normal">(Cotizaciones, históricos y velas OHLCV)</span>
                  </label>
                  <a 
                    href="https://twelvedata.com/pricing" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>Obtener gratis (8 req/min)</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showKey.twelve ? 'text' : 'password'}
                    value={twelveDataKey}
                    onChange={(e) => setTwelveDataKey(e.target.value)}
                    placeholder="Introduce tu clave de Twelve Data (ej. 8a3f8c...)"
                    className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(prev => ({ ...prev, twelve: !prev.twelve }))}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showKey.twelve ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Finnhub Key */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                    <span>Finnhub Financial API Token</span>
                    <span className="text-[10px] text-slate-400 font-normal">(Fundamentales, noticias en tiempo real y consenso)</span>
                  </label>
                  <a 
                    href="https://finnhub.io/register" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>Obtener gratis (60 req/min)</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showKey.finnhub ? 'text' : 'password'}
                    value={finnhubKey}
                    onChange={(e) => setFinnhubKey(e.target.value)}
                    placeholder="Introduce tu token de Finnhub (ej. c83b...)"
                    className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(prev => ({ ...prev, finnhub: !prev.finnhub }))}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showKey.finnhub ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* SEC EDGAR User-Agent */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-200 block">
                  Identificador SEC EDGAR (User-Agent Requerido)
                </label>
                <input
                  type="text"
                  value={secUserAgent}
                  onChange={(e) => setSecUserAgent(e.target.value)}
                  placeholder="NombreAplicacion/1.0 (contacto@tu-dominio.com)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Cache TTL config */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-200">Tiempo de Vida de la Caché (TTL)</div>
                  <div className="text-[10px] text-slate-400">Protege los límites de llamadas gratuitas almacenando cotizaciones recientes</div>
                </div>
                <select
                  value={cacheTtl}
                  onChange={(e) => setCacheTtl(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="5">5 minutos</option>
                  <option value="10">10 minutos (Recomendado)</option>
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                </select>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-2">
                {saveSuccessMsg ? (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Configuración de claves guardada con éxito en almacenamiento seguro local.</span>
                  </span>
                ) : <div></div>}

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-mono font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Integrity & Cache */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Auditoría de Integridad y Frescura de Datos</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ANSAMA ANALYTICS implementa un protocolo continuo de supervisión para garantizar que los modelos cuantitativos e IA no operen sobre cotizaciones desfasadas.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Límite de Frescura</div>
                    <div className="text-white font-bold text-sm mt-0.5">15 Minutos</div>
                    <div className="text-[10px] text-slate-500">Alerta de antigüedad</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Tolerancia de Caída</div>
                    <div className="text-white font-bold text-sm mt-0.5">Automática</div>
                    <div className="text-[10px] text-slate-500">Conmutación a caché</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Cifrado en Reposo</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">Activo</div>
                    <div className="text-[10px] text-slate-500">Almacenamiento del navegador</div>
                  </div>
                </div>
              </div>

              {/* Cache Management */}
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-white">Memoria Caché de Cotizaciones</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Eliminar la caché forzará la descarga de datos nuevos en la próxima petición de cada valor.
                  </div>
                </div>
                <button
                  onClick={handleClearCache}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar Caché Local</span>
                </button>
              </div>

              {cacheClearedMsg && (
                <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800 text-xs font-mono text-emerald-400 text-center">
                  Caché local vaciada correctamente. El sistema solicitará datos frescos.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 shrink-0">
          <div className="text-[10px] font-mono text-slate-500">
            ANSAMA ANALYTICS &bull; Módulo de Conexiones Financieras (Etapa 2)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-xs font-mono transition-colors"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
}
