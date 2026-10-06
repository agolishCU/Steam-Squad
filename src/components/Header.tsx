import React from 'react';
import { APP_LOGO, USER_AVATAR } from '../data/mockData';
import { sound } from '../utils/audio';

interface HeaderProps {
  subtitle: string;
  onProfileClick?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  subtitle,
  onProfileClick,
  isMuted = false,
  onToggleMute,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0e141d]/85 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="SteamSquad Logo"
            className="h-8 w-8 object-contain flex-shrink-0 rounded-full bg-[#1a2029] p-0.5"
            src={APP_LOGO}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-jakarta text-[18px] text-[#a1d9ff] tracking-tight font-bold leading-tight truncate">
              SteamSquad
            </span>
            <span className="text-[10px] text-[#bfc8d0] uppercase tracking-widest leading-none font-semibold truncate">
              {subtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Sound Toggle */}
          {onToggleMute && (
            <button
              onClick={() => {
                onToggleMute();
                sound.playClick();
              }}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#242a34]/80 text-[#bfc8d0] hover:text-[#00d8ff] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
          )}

          {/* Online telemetry pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#242a34]/90 shadow-[0_0_12px_rgba(88,237,128,0.15)] border border-white/5">
            <span className="w-2 h-2 rounded-full bg-[#58ed80] animate-pulse"></span>
            <span className="text-[11px] text-[#6bff8f] hidden sm:inline font-bold tracking-tight">
              4 Online
            </span>
          </div>

          {/* User profile avatar */}
          <button
            onClick={() => {
              sound.playClick();
              onProfileClick?.();
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-90 active:scale-95 transition-all relative"
            type="button"
            title="Squad Profile"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shadow-[0_0_8px_rgba(102,192,244,0.3)] ring-1 ring-[#66c0f4]/40"
              src={USER_AVATAR}
            />
            <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-[#58ed80] rounded-full border-2 border-[#0e141d]"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
