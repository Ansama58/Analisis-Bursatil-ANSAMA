import React, { useState } from 'react';
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
  
  // Security & Modals
  const [password, setPassword] = useState('ansama');
  const [isLocked, setIsLocked] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'auth' | 'sources' | 'backup' | null

  return (
    <MarketProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#070b18] text-slate-100 font-sans">
        {/* Lateral Dark Navy Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          openModal={setActiveModal}
        />

        {/* Main Terminal Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
          {/* Header Bar */}
          <Header
            onLockTerminal={() => setIsLocked(true)}
            onOpenSources={() => setActiveModal('sources')}
          />

          {/* Global Market Indices Ticker Bar */}
          <IndicesBar />

          {/* Scrollable Content Viewport */}
          <main className="flex-1 overflow-y-auto p-6 bg-[#080d1e]">
            <div className="max-w-[1600px] mx-auto pb-12">
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
