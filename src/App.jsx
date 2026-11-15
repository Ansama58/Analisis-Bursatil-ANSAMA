import React, { useState } from 'react';
import { LayoutDashboard, LineChart, BrainCircuit, ListOrdered, Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import IndicesBar from './components/IndicesBar';
import ErrorBoundary from './components/ErrorBoundary';

import DashboardScreen from './components/screens/DashboardScreen';
import AnalyzerScreen from './components/screens/AnalyzerScreen';
import AiReportScreen from './components/screens/AiReportScreen';
import WatchlistScreen from './components/screens/WatchlistScreen';
import ScreenerScreen from './components/screens/ScreenerScreen';
import ComparatorScreen from './components/screens/ComparatorScreen';
import HistoryScreen from './components/screens/HistoryScreen';

import AuthModal from './components/modals/AuthModal';
import SourcesModal from './components/modals/SourcesModal';
import BackupModal from './components/modals/BackupModal';
import AiConfigModal from './components/modals/AiConfigModal';

import { MarketProvider } from './context/MarketContext';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Security & Modals
  const [password, setPassword] = useState('ansama');
  const [isLocked, setIsLocked] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'auth' | 'sources' | 'backup' | null

  return (
    <MarketProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#070b18] text-slate-100 font-sans">
        {/* Lateral Dark Navy Sidebar (Desktop & Mobile Drawer) */}
        <Sidebar
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          openModal={setActiveModal}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Terminal Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
          {/* Header Bar */}
          <Header
            onLockTerminal={() => setIsLocked(true)}
            onOpenSources={() => setActiveModal('sources')}
            onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
            isMobileMenuOpen={isMobileMenuOpen}
          />

          {/* Global Market Indices Ticker Bar */}
          <IndicesBar />

          {/* Scrollable Content Viewport */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pb-20 md:pb-12 bg-[#080d1e]">
            <div className="max-w-[1600px] mx-auto pb-4 md:pb-12">
              <ErrorBoundary>
                {currentScreen === 'dashboard' && (
                  <DashboardScreen
                    setCurrentScreen={setCurrentScreen}
                  />
                )}

                {currentScreen === 'analyzer' && (
                  <AnalyzerScreen
                    setCurrentScreen={setCurrentScreen}
                  />
                )}

                {currentScreen === 'ai-report' && (
                  <AiReportScreen
                    onOpenAiConfig={() => setActiveModal('aiconfig')}
                  />
                )}

                {currentScreen === 'watchlist' && (
                  <WatchlistScreen
                    setCurrentScreen={setCurrentScreen}
                  />
                )}

                {currentScreen === 'screener' && (
                  <ScreenerScreen
                    setCurrentScreen={setCurrentScreen}
                  />
                )}

                {currentScreen === 'comparator' && (
                  <ComparatorScreen
                    setCurrentScreen={setCurrentScreen}
                  />
                )}

                {currentScreen === 'history' && (
                  <HistoryScreen
                    setCurrentScreen={setCurrentScreen}
                  />
                )}
              </ErrorBoundary>
            </div>
          </main>

          {/* Mobile Bottom Navigation Bar (md:hidden) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#090f20]/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2 z-30 select-none">
            <button
              onClick={() => { setCurrentScreen('dashboard'); setIsMobileMenuOpen(false); }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                currentScreen === 'dashboard' ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Panel</span>
            </button>

            <button
              onClick={() => { setCurrentScreen('analyzer'); setIsMobileMenuOpen(false); }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                currentScreen === 'analyzer' ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LineChart className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Analizador</span>
            </button>

            <button
              onClick={() => { setCurrentScreen('ai-report'); setIsMobileMenuOpen(false); }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                currentScreen === 'ai-report' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BrainCircuit className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Informe IA</span>
            </button>

            <button
              onClick={() => { setCurrentScreen('watchlist'); setIsMobileMenuOpen(false); }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                currentScreen === 'watchlist' ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListOrdered className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Watchlist</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isMobileMenuOpen ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Menu className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Menú</span>
            </button>
          </nav>
        </div>

        {/* Modals */}
        <AuthModal
          isOpen={activeModal === 'auth'}
          onClose={() => setActiveModal(null)}
          currentPassword={password}
          onChangePassword={setPassword}
          isLocked={isLocked}
          onUnlock={() => setIsLocked(false)}
        />

        <SourcesModal
          isOpen={activeModal === 'sources'}
          onClose={() => setActiveModal(null)}
        />

        <BackupModal
          isOpen={activeModal === 'backup'}
          onClose={() => setActiveModal(null)}
        />

        <AiConfigModal
          isOpen={activeModal === 'aiconfig'}
          onClose={() => setActiveModal(null)}
        />
      </div>
    </MarketProvider>
  );
}
