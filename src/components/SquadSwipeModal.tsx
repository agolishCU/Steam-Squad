import React, { useState } from 'react';
import { GAMES_DATA } from '../data/mockData';
import { sound } from '../utils/audio';

interface SquadSwipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayGame: (gameTitle: string) => void;
}

export const SquadSwipeModal: React.FC<SquadSwipeModalProps> = ({
  isOpen,
  onClose,
  onPlayGame,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchFound, setMatchFound] = useState(false);

  if (!isOpen) return null;

  const currentGame = GAMES_DATA[currentIndex % GAMES_DATA.length];

  const handleSwipe = (liked: boolean) => {
    sound.playClick();
    if (liked) {
      sound.playCollect();
      setMatchFound(true);
      setTimeout(() => {
        setMatchFound(false);
        setCurrentIndex((i) => (i + 1) % GAMES_DATA.length);
      }, 1500);
    } else {
      setCurrentIndex((i) => (i + 1) % GAMES_DATA.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-sm bg-[#161c25] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5 bg-[#1a2029]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#58ed80] text-[20px]">style</span>
            <div>
              <h3 className="font-jakarta text-[16px] font-bold text-white">Squad Match Deck</h3>
              <p className="text-[10px] text-[#bfc8d0]">
                Game {currentIndex + 1} of {GAMES_DATA.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#242a34] text-[#bfc8d0] hover:text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col items-center">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#242a34] shadow-lg border border-white/5">
            <img
              src={currentGame.image}
              alt={currentGame.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            <div className="absolute bottom-3 left-3 right-3 text-left">
              <span className="text-[10px] font-bold text-[#58ed80] bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {currentGame.ratingPercent}% Positive
              </span>
              <h4 className="font-jakarta text-[20px] font-extrabold text-white leading-tight mt-1">
                {currentGame.title}
              </h4>
              <p className="text-[11px] text-[#a0c9ff] truncate">{currentGame.genre}</p>
            </div>

            {matchFound && (
              <div className="absolute inset-0 bg-[#58ed80]/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-20 animate-fade-in">
                <span className="material-symbols-outlined text-[48px] text-[#003915] animate-bounce">
                  favorite
                </span>
                <span className="font-anton text-[28px] text-[#003915] uppercase tracking-wide">
                  SQUAD MATCH!
                </span>
                <p className="text-[12px] text-[#003915] font-bold mt-1">
                  Alex, Jax & Sarah all swiped right!
                </p>
              </div>
            )}
          </div>

          {/* Squad Live Status Indicator */}
          <div className="w-full mt-3 p-2.5 rounded-lg bg-[#1a2029] border border-white/5 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-[#bfc8d0]">
              <span className="w-2 h-2 rounded-full bg-[#58ed80] animate-ping"></span>
              <span>Squad Swiping Live:</span>
            </div>
            <div className="flex -space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-[#58ed80] text-[#003915] text-[9px] font-bold flex items-center justify-center">
                A
              </span>
              <span className="w-5 h-5 rounded-full bg-[#58ed80] text-[#003915] text-[9px] font-bold flex items-center justify-center">
                S
              </span>
              <span className="w-5 h-5 rounded-full bg-[#66c0f4] text-[#001e2d] text-[9px] font-bold flex items-center justify-center">
                J
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-4 w-full">
            <button
              onClick={() => handleSwipe(false)}
              className="w-14 h-14 rounded-full bg-[#242a34] text-[#ffb4ab] hover:bg-[#2f353f] flex items-center justify-center shadow-lg active:scale-90 transition-all border border-white/5"
              title="Pass"
            >
              <span className="material-symbols-outlined text-[28px]">close</span>
            </button>

            <button
              onClick={() => handleSwipe(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00ff7f] to-[#00d8ff] text-[#003915] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,127,0.5)] active:scale-90 transition-all"
              title="Vote to Play!"
            >
              <span className="material-symbols-outlined text-[32px] font-bold">favorite</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#1a2029] border-t border-white/5 flex items-center justify-between text-[11px] text-[#bfc8d0]">
          <span>Tap favorite to lock in session</span>
          <button
            onClick={() => {
              onClose();
              onPlayGame(currentGame.title);
            }}
            className="text-[#66c0f4] font-bold hover:underline"
          >
            Launch Directly →
          </button>
        </div>
      </div>
    </div>
  );
};
