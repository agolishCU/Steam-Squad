/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DiscoverScreen } from './components/screens/DiscoverScreen';
import { MatrixScreen } from './components/screens/MatrixScreen';
import { FlightGameScreen } from './components/screens/FlightGameScreen';
import { GameDetailScreen } from './components/screens/GameDetailScreen';
import { PartyLobbyScreen } from './components/screens/PartyLobbyScreen';
import { SquadSwipeModal } from './components/SquadSwipeModal';
import { sound } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('discover');
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);
  const [isSwipeModalOpen, setIsSwipeModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [partyNotification, setPartyNotification] = useState<string | null>(null);

  const screenTitles: Record<ScreenType, string> = {
    discover: 'Discover',
    matrix: 'Matrix',
    flight: 'Flight Engine',
    'game-detail': 'Game Detail',
    'party-lobby': 'Party Lobby',
  };

  const handleToggleMute = () => {
    sound.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLaunchParty = (gameTitle: string) => {
    sound.playScore();
    setPartyNotification(`🚀 Launching squad party for ${gameTitle}!`);
    setTimeout(() => {
      setPartyNotification(null);
      setCurrentScreen('party-lobby');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#0e141d] text-[#dde2f0] flex flex-col font-body selection:bg-[#66c0f4] selection:text-[#001e2d] relative">
      {/* Top Fixed Header */}
      <Header
        subtitle={screenTitles[currentScreen]}
        onProfileClick={() => setIsProfileModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Real-time Party Notification Banner */}
      {partyNotification && (
        <div className="fixed top-18 inset-x-4 z-50 max-w-md mx-auto bg-[#58ed80] text-[#003915] p-3 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
          <span className="text-[13px] font-bold font-jakarta">{partyNotification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-24 bg-[#0e141d] overflow-x-hidden">
        {currentScreen === 'discover' && (
          <DiscoverScreen
            onSelectGame={(_gameId) => setCurrentScreen('game-detail')}
            onLaunchFlight={() => setCurrentScreen('flight')}
            onOpenSwipeDeck={() => setIsSwipeModalOpen(true)}
          />
        )}

        {currentScreen === 'matrix' && (
          <MatrixScreen
            onSelectGame={(_gameId) => setCurrentScreen('game-detail')}
            onLaunchParty={handleLaunchParty}
          />
        )}

        {currentScreen === 'flight' && (
          <FlightGameScreen onOpenLobby={() => setCurrentScreen('party-lobby')} />
        )}

        {currentScreen === 'game-detail' && (
          <GameDetailScreen
            onBack={() => setCurrentScreen('discover')}
            onLaunchLobby={() => setCurrentScreen('party-lobby')}
          />
        )}

        {currentScreen === 'party-lobby' && (
          <PartyLobbyScreen onLaunchGame={() => setCurrentScreen('flight')} />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      {/* Swipe Deck Modal */}
      <SquadSwipeModal
        isOpen={isSwipeModalOpen}
        onClose={() => setIsSwipeModalOpen(false)}
        onPlayGame={(title) => {
          setIsSwipeModalOpen(false);
          handleLaunchParty(title);
        }}
      />

      {/* Player Profile & Squad Status Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#161c25] rounded-2xl overflow-hidden border border-white/10 shadow-2xl p-5 relative">
            <button
              onClick={() => {
                sound.playClick();
                setIsProfileModalOpen(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#242a34] text-[#bfc8d0] flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAnBuf7EuYBafV54yG9pVRy5CDJhrJrUUHxDa4YN0g1W8booP2XWaxVNOToMhTMj671r2wweLylXqnF2XKq32hRyrXQlhNQPy657Kp9H1Vsxc-JiSCcURLJdTCgEmg7UPrnco-FYlqma6jVxyNjlWWRtcaS_r_6BjLPJLrgbT3ljMrLrw6nkVCAOZBLyvYjeztr5CK-9Rm4TR3sPeusaJwAyM3tGtaPMALY85rEe1fbcoLb1qOKw6d"
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#66c0f4]"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#58ed80] rounded-full border-2 border-[#161c25]"></span>
              </div>
              <div className="min-w-0">
                <h3 className="font-jakarta text-[18px] font-bold text-white">Commander You</h3>
                <span className="text-[11px] text-[#66c0f4] font-semibold">
                  Squad Ace • Lvl 55
                </span>
                <p className="text-[10px] text-[#bfc8d0]">Steam ID: 765611980249811</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3">
              <div className="p-2.5 rounded-xl bg-[#1a2029] border border-white/5">
                <span className="text-[10px] text-[#bfc8d0] uppercase font-bold block">
                  FLIGHT BEST
                </span>
                <span className="font-anton text-[22px] text-[#00ff7f]">
                  {localStorage.getItem('flight_high_score') || '18'} PTS
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#1a2029] border border-white/5">
                <span className="text-[10px] text-[#bfc8d0] uppercase font-bold block">
                  OWNED GAMES
                </span>
                <span className="font-anton text-[22px] text-[#66c0f4]">342</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#1a2029] border border-white/5 space-y-1.5 text-[12px] text-[#bfc8d0]">
              <div className="flex justify-between items-center">
                <span>Discord Audio Link:</span>
                <span className="text-[#58ed80] font-bold">#game-night-alpha</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Modpack v2.4.1:</span>
                <span className="text-[#58ed80] font-bold">Verified Synced</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Ping to Host Alex:</span>
                <span className="text-[#00ff7f] font-mono font-bold">24 ms</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setIsProfileModalOpen(false);
                setCurrentScreen('flight');
              }}
              className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff7f] to-[#00d8ff] text-[#003915] font-jakarta text-[13px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              <span>Play Flight Derby Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
