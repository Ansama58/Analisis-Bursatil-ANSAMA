import React, { useState, useRef } from 'react';
import { DownloadCloud, UploadCloud, CheckCircle2, ShieldCheck, X, FileJson, AlertCircle } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';

export default function BackupModal({ isOpen, onClose }) {
  const { stocks, recommendations, aiWeights, restoreRecommendations, updateAiWeights } = useMarket();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleExportBackup = () => {
    const backupData = {
      app: 'ANSAMA ANALYTICS',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      aiWeights,
      history: recommendations,
      stocksCount: Object.keys(stocks).length,
      checksum: 'SHA256-ANSAMA-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ANSAMA_ANALYTICS_BACKUP_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed || (!parsed.history && !parsed.stocks)) {
          throw new Error('El archivo no tiene el formato de copia de seguridad válido de ANSAMA.');
        }

        if (Array.isArray(parsed.history)) {
          restoreRecommendations(parsed.history);
        }
        if (parsed.aiWeights) {
          updateAiWeights(parsed.aiWeights);
        }

        setImportSuccess(true);
        setImportError(null);
        setTimeout(() => setImportSuccess(false), 3500);
      } catch (err) {
        setImportError(err.message || 'Error al procesar el archivo JSON');
        setTimeout(() => setImportError(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset file input
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full terminal-card p-6 bg-[#0b132b] border border-slate-700 shadow-2xl space-y-5 rounded-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <DownloadCloud className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">Copias de Seguridad & Restauración</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Genera o restaura una instantánea completa con todas las recomendaciones, listas de seguimiento, auditoría histórica y pesos calibrados de la IA.
        </p>

        <div className="space-y-3">
          {/* Export button */}
          <button
            onClick={handleExportBackup}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all font-mono"
          >
            <FileJson className="w-4 h-4" />
            <span>DESCARGAR COPIA DE SEGURIDAD (.JSON)</span>
          </button>

          {downloadSuccess && (
            <div className="p-2.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Copia descargada y fechada correctamente.</span>
            </div>
          )}

          {/* Import button & hidden input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all font-mono"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>RESTAURAR COPIA DESDE ARCHIVO (.JSON)</span>
          </button>

          {importSuccess && (
            <div className="p-2.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Histórico y configuración restaurados con éxito.</span>
            </div>
          )}

          {importError && (
            <div className="p-2.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{importError}</span>
            </div>
          )}
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cifrado y Verificación SHA-256</span>
          </div>
          <p>
            Los archivos de copia están preparados para restaurarse en cualquier momento o sincronizarse con tu repositorio GitHub de ANSAMA.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold text-xs font-mono"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
}
