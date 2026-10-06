import React from 'react';
import { ScreenType } from '../types';
import { sound } from '../utils/audio';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const tabs: { id: ScreenType; label: string; icon: string; isHighlight?: boolean }[] = [
    { id: 'discover', label: 'Discover', icon: 'local_fire_department' },
    { id: 'matrix', label: 'Matrix', icon: 'grid_view' },
    { id: 'flight', label: 'Flight Derby', icon: 'rocket_launch', isHighlight: true },
    { id: 'game-detail', label: 'Detail', icon: 'sports_esports' },
    { id: 'party-lobby', label: 'Lobby', icon: 'groups' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#161c25]/95 backdrop-blur-2xl border-t border-white/5 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      <div className="flex justify-around items-center h-20 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;

          if (tab.isHighlight) {
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  onNavigate(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center -top-3.5 group transition-transform active:scale-95`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#00ff7f] to-[#00d8ff] text-[#0b0e14] shadow-[0_0_24px_rgba(0,255,127,0.7)] rotate-3'
                      : 'bg-gradient-to-tr from-[#00ff7f]/90 to-[#14d8ff]/90 text-[#0b0e14] shadow-[0_0_16px_rgba(0,255,127,0.4)] group-hover:shadow-[0_0_24px_rgba(0,255,127,0.6)]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[28px] font-bold">
                    {tab.icon}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-tight ${
                    isActive ? 'text-[#00ff7f]' : 'text-[#a1d9ff]'
                  }`}
                >
                  Flap Game
                </span>
                {/* Live pulsing tag */}
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-[#ffc700] text-[#0b0e14] font-anton text-[9px] rounded-full uppercase tracking-tighter shadow-sm animate-bounce">
                  PLAY
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onNavigate(tab.id);
              }}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] transition-all active:scale-95 ${
                isActive
                  ? 'text-[#66c0f4] drop-shadow-[0_0_10px_rgba(102,192,244,0.5)] font-bold'
                  : 'text-[#bfc8d0] hover:text-[#dde2f0]'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {tab.icon}
              </span>
              <span className="text-[10px] font-semibold tracking-wide">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
