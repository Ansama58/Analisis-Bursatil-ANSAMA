import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, X, Check } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, currentPassword, onChangePassword, isLocked, onUnlock }) {
  const [inputPass, setInputPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen && !isLocked) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (inputPass === currentPassword) {
      onUnlock();
      setInputPass('');
      setError('');
    } else {
      setError('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (inputPass !== currentPassword) {
      setError('La contraseña actual es incorrecta.');
      return;
    }
    if (newPass.length < 4) {
      setError('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    onChangePassword(newPass);
    setSuccess('¡Contraseña actualizada con éxito!');
    setInputPass('');
    setNewPass('');
    setConfirmPass('');
    setError('');
    setTimeout(() => {
      setSuccess('');
      onClose();
    }, 1500);
  };

  // If terminal is locked, full screen block
  if (isLocked) {
    return (
      <div className="fixed inset-0 z-50 bg-[#060a16] flex items-center justify-center p-4">
        <div className="max-w-md w-full terminal-card p-8 bg-[#0b132b] border border-blue-900 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white font-mono">ANSAMA ANALYTICS</h2>
            <p className="text-xs text-slate-400 mt-1">
              Terminal bloqueado por seguridad. Introduce tu clave de acceso para continuar.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                value={inputPass}
                onChange={(e) => {
                  setInputPass(e.target.value);
                  setError('');
                }}
                placeholder="Contraseña de acceso (por defecto: ansama)"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-center text-white focus:outline-none focus:border-blue-500 font-mono tracking-widest"
                autoFocus
              />
              {error && <p className="text-xs text-rose-400 mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs font-mono transition-colors shadow-lg shadow-blue-600/30"
            >
              DESBLOQUEAR TERMINAL
            </button>
          </form>

          <p className="text-[11px] text-slate-500">
            Contraseña inicial de fábrica: <code className="text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">ansama</code>
          </p>
        </div>
      </div>
    );
  }

  // Normal settings modal
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full terminal-card p-6 bg-[#0b132b] border border-slate-700 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">Seguridad & Contraseña</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Contraseña Actual:</label>
            <input
              type="password"
              value={inputPass}
              onChange={(e) => setInputPass(e.target.value)}
              placeholder="Introduce la clave actual"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Nueva Contraseña:</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Mínimo 4 caracteres"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Confirmar Nueva Contraseña:</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Repite la nueva clave"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {error && <p className="text-rose-400 text-xs font-mono">{error}</p>}
          {success && <p className="text-emerald-400 text-xs font-mono">{success}</p>}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs"
            >
              Guardar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
