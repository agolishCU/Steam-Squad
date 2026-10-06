import React, { useState } from 'react';
import { sound } from '../../utils/audio';

interface GameDetailProps {
  onBack?: () => void;
  onLaunchLobby?: () => void;
}

export const GameDetailScreen: React.FC<GameDetailProps> = ({ onBack, onLaunchLobby }) => {
  const [hasVotedIn, setHasVotedIn] = useState<boolean>(false);
  const [alertSet, setAlertSet] = useState<boolean>(false);
  const [pitchedIn, setPitchedIn] = useState<boolean>(false);
  const [pingedDiscord, setPingedDiscord] = useState<boolean>(false);
  const [showTrailerToast, setShowTrailerToast] = useState<boolean>(false);

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto pb-space-xl space-y-4 select-none">
      {/* ================= HERO BANNER WITH CINEMATIC PREVIEW ================= */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#161c25] shadow-xl border border-white/5">
        <div className="relative w-full h-56">
          <img
            className="w-full h-full object-cover"
            alt="Helldivers 2 Key Art"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRY9t0w2YWyyTzdOwNGHDL8TlxjQ0WTNIcxQoF3mHyDjFopXfJ1vo-XU-j2X8l5nXoCukubiINjnJLGY2_vOLy4T1tzzsVqwsgDEDb06rAbzlmy8kRhxxRYc9WcFnSeWpssbd-uAhSxRybRFh5z-z2L-d4tEm3K70A7fzhDMgOUbFDCMVwbzK2EhQMmwr3cRvVszYfJwyzfr0mHtIbPys2b7daJ999e-grcUzxqwtcTKC7OfSdo60r"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e141d] via-[#0e141d]/60 to-transparent"></div>

          {/* Trailer Button */}
          <button
            onClick={() => {
              sound.playClick();
              setShowTrailerToast(true);
              setTimeout(() => setShowTrailerToast(false), 2500);
            }}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#242a34]/80 backdrop-blur-md text-[#a1d9ff] hover:bg-[#343944] active:scale-95 transition-all shadow-md border border-white/10"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            <span className="text-[10px] uppercase font-bold tracking-wider">Trailer</span>
          </button>

          {/* Live Co-op Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#080e17]/80 backdrop-blur-md border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#58ed80] animate-ping"></span>
            <span className="text-[10px] text-[#6bff8f] font-bold">Squad Sync: 3/4 Online</span>
          </div>

          {showTrailerToast && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-20">
              <div className="bg-[#1a2029] p-4 rounded-xl text-center border border-[#66c0f4]/40 shadow-2xl">
                <span className="material-symbols-outlined text-[36px] text-[#66c0f4] mb-1 animate-pulse">
                  smart_display
                </span>
                <p className="font-jakarta text-[16px] font-bold text-white">
                  Helldivers 2 Cinematic Trailer
                </p>
                <p className="text-[12px] text-[#bfc8d0] mt-1">
                  Broadcasting official galactic war footage to squad
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Title & Dev Info */}
        <div className="px-margin pt-1 pb-4 relative -mt-10">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-[#66c0f4]/20 text-[#a1d9ff] text-[10px] font-bold uppercase tracking-wider">
                  Top Match
                </span>
                <span className="px-2 py-0.5 rounded bg-[#2f353f] text-[#bfc8d0] text-[10px]">
                  Co-Op Action
                </span>
              </div>
              <h1 className="font-jakarta text-[24px] text-[#dde2f0] font-extrabold tracking-tight truncate">
                HELLDIVERS™ 2
              </h1>
              <p className="text-[12px] text-[#bfc8d0]">
                Arrowhead Game Studios • PlayStation PC LLC
              </p>
            </div>

            <div className="flex flex-col items-end flex-shrink-0">
              <div className="flex items-center gap-1 bg-[#242a34] px-2 py-1 rounded-lg border border-white/5">
                <span className="material-symbols-outlined text-[#66c0f4] text-base">
                  thumb_up
                </span>
                <span className="text-[12px] text-[#a1d9ff] font-bold">92%</span>
              </div>
              <span className="text-[10px] text-[#bfc8d0] mt-1">84,210 reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SQUAD READINESS METER SECTION ================= */}
      <div className="mx-margin rounded-2xl bg-[#161c25] p-4 shadow-lg space-y-3 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a1d9ff] text-xl">pie_chart</span>
            <span className="font-jakarta text-[18px] text-[#dde2f0] font-bold">
              Squad Readiness
            </span>
          </div>
          <span className="text-[12px] text-[#58ed80] font-bold bg-[#58ed80]/10 px-2.5 py-0.5 rounded-full border border-[#58ed80]/20">
            75% Owned
          </span>
        </div>

        {/* Progress Bar with Glowing Accent */}
        <div className="space-y-1.5">
          <div className="w-full h-3 bg-[#2f353f] rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#0594fa] via-[#66c0f4] to-[#58ed80] rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(102,192,244,0.6)]"
              style={{ width: '75%' }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[#bfc8d0]">
            <span className="text-[10px]">3 of 4 Squad Mates In Library</span>
            <span className="text-[10px] text-[#ffb4ab] font-semibold">1 Missing License</span>
          </div>
        </div>

        {/* Squad Member Status Chips Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Player 1 (You) */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#242a34]/90 border border-white/5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#343944] flex items-center justify-center font-bold text-[#dde2f0] text-[12px]">
                ME
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#58ed80] ring-2 ring-[#242a34]"></span>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-[#dde2f0] font-semibold truncate">You</p>
              <p className="text-[10px] text-[#6bff8f] font-medium truncate">Owned • 42 hrs</p>
            </div>
          </div>

          {/* Player 2 (Alex) */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#242a34]/90 border border-white/5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#343944] flex items-center justify-center font-bold text-[#dde2f0] text-[12px]">
                AL
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#58ed80] ring-2 ring-[#242a34]"></span>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-[#dde2f0] font-semibold truncate">Alex</p>
              <p className="text-[10px] text-[#6bff8f] font-medium truncate">Owned • 18 hrs</p>
            </div>
          </div>

          {/* Player 3 (Sarah) */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#242a34]/90 border border-white/5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#343944] flex items-center justify-center font-bold text-[#dde2f0] text-[12px]">
                SA
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#58ed80] ring-2 ring-[#242a34]"></span>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-[#dde2f0] font-semibold truncate">Sarah</p>
              <p className="text-[10px] text-[#6bff8f] font-medium truncate">Owned • 5 hrs</p>
            </div>
          </div>

          {/* Player 4 (Jax - Unowned) */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#2f353f]/80 border border-white/5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#2f353f] flex items-center justify-center font-bold text-[#89929a] text-[12px]">
                JX
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#ffb4ab] ring-2 ring-[#2f353f]"></span>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-[#dde2f0] font-semibold truncate">Jax</p>
              <p className="text-[10px] text-[#ffb4ab] font-medium truncate">Wishlist (Wanted)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ACTIVE SQUAD POLL CARD ================= */}
      <div className="mx-margin rounded-2xl bg-[#1a2029] p-4 shadow-xl space-y-3 relative overflow-hidden border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0594fa] text-xl animate-bounce">
              how_to_vote
            </span>
            <div>
              <span className="font-jakarta text-[18px] text-[#dde2f0] font-bold block">
                Live Squad Poll
              </span>
              <span className="text-[10px] text-[#a0c9ff]">Session starts in 2h 15m</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#0594fa]/20 text-[#a0c9ff] text-[10px] font-bold border border-[#0594fa]/30">
            {hasVotedIn ? '4 of 4 Ready!' : '3 of 4 Ready'}
          </span>
        </div>

        {/* Poll Prompt Box */}
        <div className="p-3 rounded-xl bg-[#242a34]/70 space-y-2 border border-white/5">
          <p className="text-[16px] text-[#dde2f0] font-semibold">
            Drop in tonight at 8:00 PM EST?
          </p>

          <div className="flex items-center gap-2 text-[#bfc8d0]">
            <div className="flex -space-x-1.5">
              <span className="w-6 h-6 rounded-full bg-[#34d067] text-[#005322] flex items-center justify-center text-[10px] font-bold shadow-sm">
                ✓
              </span>
              <span className="w-6 h-6 rounded-full bg-[#34d067] text-[#005322] flex items-center justify-center text-[10px] font-bold shadow-sm">
                ✓
              </span>
              <span className="w-6 h-6 rounded-full bg-[#34d067] text-[#005322] flex items-center justify-center text-[10px] font-bold shadow-sm">
                ✓
              </span>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                  hasVotedIn ? 'bg-[#34d067] text-[#005322]' : 'bg-[#2f353f] text-[#bfc8d0]'
                }`}
              >
                {hasVotedIn ? '✓' : '?'}
              </span>
            </div>
            <span className="text-[12px]">
              {hasVotedIn ? 'All 4 confirmed!' : 'You, Alex, Sarah confirmed'}
            </span>
          </div>

          {/* Jax's Live Chat Bubble */}
          <div className="flex items-start gap-2 pt-1">
            <span className="material-symbols-outlined text-[#a1d9ff] text-base mt-0.5">
              chat_bubble
            </span>
            <div className="bg-[#0e141d]/80 rounded-lg p-2.5 flex-1 border border-white/5">
              <p className="text-[10px] text-[#a1d9ff] font-bold">Jax (Pending)</p>
              <p className="text-[12px] text-[#dde2f0] mt-0.5">
                "I'll buy it and install right now if we commit to a 4-man run tonight!"
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              sound.playClick();
              setHasVotedIn(!hasVotedIn);
            }}
            className={`w-full py-3 px-4 rounded-xl font-jakarta text-[14px] font-bold flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all ${
              hasVotedIn
                ? 'bg-[#58ed80] text-[#003915] shadow-[0_0_20px_rgba(88,237,128,0.5)]'
                : 'bg-gradient-to-r from-[#0594fa] to-[#66c0f4] text-[#00344b]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              {hasVotedIn ? 'check_circle' : 'rocket_launch'}
            </span>
            <span>{hasVotedIn ? 'Locked In! ✓' : "I'm In! 🚀"}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setAlertSet(!alertSet);
            }}
            className={`w-full py-3 px-4 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-white/5 ${
              alertSet
                ? 'bg-[#58ed80]/20 text-[#58ed80]'
                : 'bg-[#2f353f] hover:bg-[#343944] text-[#dde2f0]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              {alertSet ? 'done' : 'notifications_active'}
            </span>
            <span>{alertSet ? 'Alert Set (7:45 PM)' : 'Set Alert'}</span>
          </button>
        </div>
      </div>

      {/* ================= SQUAD PITCH-IN ================= */}
      <div className="mx-margin rounded-2xl bg-[#161c25] p-4 shadow-lg space-y-3 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#58ed80] text-xl">payments</span>
            <span className="font-jakarta text-[18px] text-[#dde2f0] font-bold">Squad Pitch-In</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-[#0594fa] text-[#002b4f] px-2 py-0.5 rounded text-[10px] font-extrabold">
              -20%
            </span>
            <span className="line-through text-[#89929a] text-[12px]">$39.99</span>
            <span className="text-[#a1d9ff] font-jakarta text-[18px] font-extrabold">$31.99</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#242a34]/60 space-y-2 border border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-[#dde2f0]">Gift to Jax to complete squad:</span>
            <span className="text-[14px] text-[#6bff8f] font-bold">
              $10.66 <span className="text-[12px] text-[#bfc8d0] font-normal">/ person</span>
            </span>
          </div>
          <p className="text-[12px] text-[#bfc8d0]">
            Split equally across 3 squad members (You, Alex, Sarah) via Steam Digital Gift Card.
          </p>
          <button
            onClick={() => {
              sound.playClick();
              setPitchedIn(!pitchedIn);
            }}
            className={`w-full mt-1 py-2.5 px-3 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
              pitchedIn
                ? 'bg-[#58ed80] text-[#003915]'
                : 'bg-[#58ed80]/15 hover:bg-[#58ed80]/25 text-[#6bff8f]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              {pitchedIn ? 'check_circle' : 'card_giftcard'}
            </span>
            <span>{pitchedIn ? 'Pitched In ($10.66)! ✓' : 'Pitch In $10.66 to Gift Jax'}</span>
          </button>
        </div>
      </div>

      {/* ================= TECH & STEAM SPECS BENTO GRID ================= */}
      <div className="mx-margin space-y-2">
        <h2 className="font-jakarta text-[18px] text-[#dde2f0] font-bold px-1">
          Technical & Compatibility Specs
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {/* Deck Verified */}
          <div className="p-3 rounded-xl bg-[#161c25] flex flex-col gap-1.5 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#bfc8d0] uppercase font-bold">Handheld</span>
              <span className="material-symbols-outlined text-[#58ed80] text-lg">verified</span>
            </div>
            <p className="text-[14px] text-[#dde2f0] font-bold">Deck Verified 🟢</p>
            <span className="text-[12px] text-[#bfc8d0]">Runs default 45 FPS lock</span>
          </div>

          {/* Capacity */}
          <div className="p-3 rounded-xl bg-[#161c25] flex flex-col gap-1.5 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#bfc8d0] uppercase font-bold">Capacity</span>
              <span className="material-symbols-outlined text-[#a1d9ff] text-lg">groups</span>
            </div>
            <p className="text-[14px] text-[#dde2f0] font-bold">4-Player Co-Op</p>
            <span className="text-[12px] text-[#bfc8d0]">Online & Private Match</span>
          </div>

          {/* Crossplay */}
          <div className="p-3 rounded-xl bg-[#161c25] flex flex-col gap-1.5 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#bfc8d0] uppercase font-bold">Cross-Platform</span>
              <span className="material-symbols-outlined text-[#a0c9ff] text-lg">sync_alt</span>
            </div>
            <p className="text-[14px] text-[#dde2f0] font-bold">PC + PS5 Crossplay</p>
            <span className="text-[12px] text-[#bfc8d0]">Integrated friends list</span>
          </div>

          {/* Anti-Cheat */}
          <div className="p-3 rounded-xl bg-[#161c25] flex flex-col gap-1.5 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#bfc8d0] uppercase font-bold">Security</span>
              <span className="material-symbols-outlined text-[#89929a] text-lg">security</span>
            </div>
            <p className="text-[14px] text-[#dde2f0] font-bold">nProtect GameGuard</p>
            <span className="text-[12px] text-[#bfc8d0]">Kernel-level protected</span>
          </div>
        </div>
      </div>

      {/* ================= DIRECT STEAM ACTION BAR ================= */}
      <div className="mx-margin pt-2 space-y-2">
        <div className="flex items-center gap-2">
          <a
            href="steam://run/553850"
            className="flex-1 py-3 px-4 rounded-xl bg-[#a1d9ff] hover:bg-[#82cfff] text-[#00344b] font-jakarta text-[14px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-xl">open_in_new</span>
            <span>Open in Steam App</span>
          </a>

          <button
            onClick={() => {
              sound.playClick();
              setPingedDiscord(true);
              setTimeout(() => setPingedDiscord(false), 2500);
            }}
            className="py-3 px-4 rounded-xl bg-[#242a34] hover:bg-[#343944] text-[#dde2f0] font-jakarta text-[14px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md border border-white/5"
            type="button"
          >
            <span className="material-symbols-outlined text-xl text-[#5865F2]">
              {pingedDiscord ? 'check' : 'notifications'}
            </span>
            <span>{pingedDiscord ? 'Pinged Squad! ✓' : 'Ping Squad'}</span>
          </button>
        </div>
        <p className="text-center text-[12px] text-[#bfc8d0]">
          Direct link launches Steam Desktop or mobile authenticator
        </p>
      </div>
    </div>
  );
};
