import React, { useState } from 'react';
import { GAMES_DATA, SQUAD_MEMBERS } from '../../data/mockData';
import { sound } from '../../utils/audio';

interface MatrixScreenProps {
  onSelectGame: (gameId: string) => void;
  onLaunchParty: (gameTitle: string) => void;
}

export const MatrixScreen: React.FC<MatrixScreenProps> = ({
  onSelectGame,
  onLaunchParty,
}) => {
  // Member filters
  const [selectedMembers, setSelectedMembers] = useState<Record<string, boolean>>({
    alex: true,
    jax: true,
    sarah: true,
    elena: true,
  });

  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('4p');
  const [pledged, setPledged] = useState<boolean>(false);
  const [giftSentForest, setGiftSentForest] = useState<boolean>(false);

  const toggleMember = (memberId: string) => {
    sound.playClick();
    setSelectedMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  const memberKeys = Object.keys(selectedMembers) as ('alex' | 'jax' | 'sarah' | 'elena')[];
  const activeCount = memberKeys.filter((k) => selectedMembers[k]).length;

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-margin pb-space-xl gap-space-lg select-none">
      {/* ================= OVERVIEW HEADER & TELEMETRY ================= */}
      <section className="flex flex-col gap-space-sm pt-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[#a1d9ff] text-[20px]">hub</span>
            <span className="text-[10px] text-[#a1d9ff] uppercase tracking-widest font-bold">
              Synchronized Matrix
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#242a34] border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#58ed80] animate-ping"></span>
            <span className="text-[10px] text-[#6bff8f] font-bold">Auto-Sync On</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="font-jakarta text-[20px] text-[#dde2f0] font-bold tracking-tight">
            Shared Library Matrix
          </span>
          <p className="text-[12px] text-[#bfc8d0]">
            Comparing 4 Squad Members across 1,420 total owned games
          </p>
        </div>

        {/* Quick Stat Pill Carousel */}
        <div className="flex gap-space-sm overflow-x-auto pb-1 -mx-margin px-margin no-scrollbar">
          <div className="flex-shrink-0 flex items-center gap-space-sm bg-[#1a2029] px-3.5 py-2.5 rounded-xl shadow-sm border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-[#34d067]/20 flex items-center justify-center text-[#58ed80] flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#dde2f0] font-bold">42 Overlap Games</span>
              <span className="text-[10px] text-[#58ed80]">100% Squad Owns</span>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-space-sm bg-[#1a2029] px-3.5 py-2.5 rounded-xl shadow-sm border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-[#0594fa]/20 flex items-center justify-center text-[#a1d9ff] flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">group_add</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#dde2f0] font-bold">89 Games</span>
              <span className="text-[10px] text-[#bfc8d0]">Missing 1 Player</span>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-space-sm bg-[#1a2029] px-3.5 py-2.5 rounded-xl shadow-sm border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-[#242a34] flex items-center justify-center text-[#d2e4ff] flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">star</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#dde2f0] font-bold">15 Games</span>
              <span className="text-[10px] text-[#bfc8d0]">Squad Wishlist</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SQUAD MEMBER SELECTOR TRAY ================= */}
      <section className="flex flex-col gap-space-xs bg-[#161c25] p-space-md rounded-xl shadow-sm border border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#bfc8d0] uppercase tracking-wider font-bold">
            Active Squad Filter ({activeCount}/4 active)
          </span>
          <span className="text-[10px] text-[#a1d9ff] font-semibold">What can we play now?</span>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-1">
          {SQUAD_MEMBERS.map((m) => {
            const isSelected = selectedMembers[m.id];
            return (
              <button
                key={m.id}
                onClick={() => toggleMember(m.id)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg bg-[#242a34] transition-all active:scale-95 text-left border ${
                  isSelected ? 'border-transparent opacity-100' : 'border-white/5 opacity-40'
                }`}
                type="button"
              >
                <div className="relative">
                  <img
                    className="w-10 h-10 rounded-full object-cover shadow-sm ring-1 ring-white/10"
                    alt={m.name}
                    src={m.avatar}
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isSelected
                        ? 'bg-[#58ed80] text-[#003915]'
                        : 'bg-[#2f353f] text-[#89929a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[11px]">
                      {isSelected ? 'check' : 'close'}
                    </span>
                  </span>
                </div>
                <div className="flex flex-col items-center w-full">
                  <span className="text-[12px] text-[#dde2f0] font-bold truncate max-w-full">
                    {m.name}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-bold tracking-tighter ${
                      m.role === 'host' ? 'text-[#a1d9ff]' : 'text-[#bfc8d0]'
                    }`}
                  >
                    {m.role === 'host' ? 'Host' : `Lvl ${m.level}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= FILTER PILLS BAR ================= */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#bfc8d0] font-bold uppercase tracking-wider">
            Quick Filters
          </span>
          <button
            onClick={() => {
              sound.playClick();
              setActiveQuickFilter('4p');
              setSelectedMembers({ alex: true, jax: true, sarah: true, elena: true });
            }}
            className="text-[10px] text-[#d2e4ff] hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-margin px-margin no-scrollbar">
          {[
            { id: '4p', label: '4 Players (Full)', icon: 'groups' },
            { id: 'deck', label: 'Steam Deck Verified', icon: 'videogame_asset' },
            { id: 'controller', label: 'Full Controller', icon: 'sports_esports' },
            { id: 'splitscreen', label: 'Couch Split-Screen', icon: 'splitscreen' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                setActiveQuickFilter(item.id);
              }}
              className={`h-8 px-3 rounded-full text-[12px] font-bold flex items-center gap-1.5 flex-shrink-0 transition-all active:scale-95 ${
                activeQuickFilter === item.id
                  ? 'bg-[#66c0f4] text-[#004d6c] shadow-sm'
                  : 'bg-[#1a2029] text-[#bfc8d0] hover:text-[#dde2f0]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ================= OVERLAP MATRIX SECTION HEADER ================= */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="font-jakarta text-[18px] text-[#dde2f0] font-bold">Matching Games</span>
          <span className="px-2 py-0.5 rounded-full bg-[#242a34] text-[#a1d9ff] text-[10px] font-bold">
            4 Shown
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#bfc8d0]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#58ed80]"></span>Owns
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#66c0f4]"></span>Wish
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#2f353f]"></span>None
          </span>
        </div>
      </div>

      {/* ================= GAME MATRIX CARDS STACK ================= */}
      <section className="flex flex-col gap-space-md">
        {/* Game 1: Risk of Rain 2 (100% Squad Ready) */}
        <div className="flex flex-col bg-[#1a2029] rounded-xl overflow-hidden shadow-sm border border-white/5">
          <div className="flex gap-space-md p-space-md">
            <div
              className="relative w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-[#2f353f] shadow-inner cursor-pointer"
              onClick={() => onSelectGame('risk-of-rain-2')}
            >
              <img
                className="w-full h-full object-cover"
                alt="Risk of Rain 2"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRiHtQuYCN80nFdDaXebDtz3ZSQ5Udaw1bJaxwoa47I92zV7a6B97_Dk9k-jnY-B8vH_lW-6B_fQX_uFaOQKzlqOmC5U_GWrTnc9KohSUyFgU-FD7bq4hPBVjF7mGurGm6RxbCgk__ASmnZuHCj6yYNHOOjQTG96DqBOw4-jhWZQgvKjTkl-CnvgPDVjdu4cVBFRuIMpeAI6wzfm8cYxRm4wqcsVVd-4PswoKXOCmby9WmfdGqPqgo"
              />
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#0e141d]/90 backdrop-blur-sm text-[#58ed80] text-[10px] font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px]">star</span>
                <span>93%</span>
              </div>
            </div>

            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div className="flex flex-col gap-1">
                <div className="flex items-start justify-between gap-1">
                  <span
                    className="font-jakarta text-[18px] text-[#dde2f0] font-bold truncate cursor-pointer hover:text-[#66c0f4]"
                    onClick={() => onSelectGame('risk-of-rain-2')}
                  >
                    Risk of Rain 2
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#58ed80]/15 text-[#58ed80] text-[10px] font-bold flex items-center gap-1 flex-shrink-0">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    <span>4/4 Ready</span>
                  </span>
                </div>
                <span className="text-[12px] text-[#bfc8d0]">Online Co-Op • Action Roguelike</span>
              </div>

              {/* Ownership Micro-Matrix */}
              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex items-center justify-between text-[#bfc8d0] text-[10px]">
                  <span>Squad Availability</span>
                  <span className="text-[#6bff8f] font-bold">100% Ready</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-lg bg-[#161c25]">
                  {['A', 'J', 'S', 'E'].map((initial) => (
                    <div
                      key={initial}
                      className="flex items-center justify-center gap-1 py-1 rounded bg-[#1a2029] text-[#58ed80]"
                    >
                      <span className="text-[10px] text-[#dde2f0] font-medium">{initial}</span>
                      <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-space-md py-2.5 bg-[#242a34]">
            <div className="flex items-center gap-1.5 text-[#bfc8d0] text-[12px]">
              <span className="material-symbols-outlined text-[#a1d9ff] text-[18px]">
                sports_esports
              </span>
              <span>Max Players: 4</span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onLaunchParty('Risk of Rain 2');
              }}
              className="px-4 py-1.5 rounded-lg bg-[#58ed80] text-[#003915] text-[12px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Launch Party</span>
            </button>
          </div>
        </div>

        {/* Game 2: Sons of the Forest */}
        <div className="flex flex-col bg-[#1a2029] rounded-xl overflow-hidden shadow-sm border border-white/5">
          <div className="flex gap-space-md p-space-md">
            <div
              className="relative w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-[#2f353f] shadow-inner cursor-pointer"
              onClick={() => onSelectGame('sons-of-the-forest')}
            >
              <img
                className="w-full h-full object-cover"
                alt="Sons of the Forest"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHkHCCcXexf47c2Jivag4L7kNl7rXSAgsuizr-c0ADwwJLybgA1WsXk6KaABlkh8zo5GipX5yTpf5Z_ITrnymAgCSzqNCidMhuEUdAmUp0Dly3OSsmFyjl5-UliShBkZzaAYsgqlqHunu4bs-ZnZq4ERUqUkk0Cj5dDCbKHSm317RCnCMoHqrd4wO55vcmEqTB89ZlySW2Qmz54Efe3TvYak51Gig7gwWbiu8rWnN67yjAd5zK0Xi9"
              />
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#66c0f4] text-[#004d6c] text-[10px] font-bold">
                -20%
              </div>
            </div>

            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div className="flex flex-col gap-1">
                <div className="flex items-start justify-between gap-1">
                  <span
                    className="font-jakarta text-[18px] text-[#dde2f0] font-bold truncate cursor-pointer hover:text-[#66c0f4]"
                    onClick={() => onSelectGame('sons-of-the-forest')}
                  >
                    Sons of the Forest
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#a1d9ff]/15 text-[#a1d9ff] text-[10px] font-bold flex-shrink-0">
                    3/4 Own
                  </span>
                </div>
                <span className="text-[12px] text-[#bfc8d0]">Survival Crafting Horror</span>
              </div>

              {/* Ownership Micro-Matrix */}
              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex items-center justify-between text-[#bfc8d0] text-[10px]">
                  <span>Sarah needs copy</span>
                  <span className="text-[#a1d9ff] font-bold">$23.99 on sale</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-lg bg-[#161c25]">
                  <div className="flex items-center justify-center gap-1 py-1 rounded bg-[#1a2029] text-[#58ed80]">
                    <span className="text-[10px] text-[#dde2f0] font-medium">A</span>
                    <span className="material-symbols-outlined text-[13px]">check</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 py-1 rounded bg-[#1a2029] text-[#58ed80]">
                    <span className="text-[10px] text-[#dde2f0] font-medium">J</span>
                    <span className="material-symbols-outlined text-[13px]">check</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 py-1 rounded bg-[#0594fa]/20 text-[#c6e7ff]">
                    <span className="text-[10px] text-[#dde2f0] font-medium">S</span>
                    <span className="material-symbols-outlined text-[13px]">star</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 py-1 rounded bg-[#1a2029] text-[#58ed80]">
                    <span className="text-[10px] text-[#dde2f0] font-medium">E</span>
                    <span className="material-symbols-outlined text-[13px]">check</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-space-md py-2.5 bg-[#242a34] gap-2">
            <div className="flex items-center gap-1.5 text-[#bfc8d0] text-[12px] min-w-0">
              <span className="material-symbols-outlined text-[#a1d9ff] text-[18px]">redeem</span>
              <span className="truncate">Sarah's top wishlist item</span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setGiftSentForest(!giftSentForest);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform flex-shrink-0 ${
                giftSentForest
                  ? 'bg-[#58ed80] text-[#003915]'
                  : 'bg-[#66c0f4] text-[#004d6c]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {giftSentForest ? 'check' : 'featured_seasonal_and_gifts'}
              </span>
              <span>{giftSentForest ? 'Gift Sent!' : 'Send Squad Gift'}</span>
            </button>
          </div>
        </div>

        {/* Game 3: Phasmophobia */}
        <div className="flex flex-col bg-[#1a2029] rounded-xl overflow-hidden shadow-sm border border-white/5">
          <div className="flex gap-space-md p-space-md">
            <div
              className="relative w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-[#2f353f] shadow-inner cursor-pointer"
              onClick={() => onSelectGame('phasmophobia')}
            >
              <img
                className="w-full h-full object-cover"
                alt="Phasmophobia"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApev3DMA7M167FqAzH_59njIWgTSiKDnTLs_dDb-trFNiUCmRMq2P786LKMyjk1oKSOW9SeunnG-DTNr6PMLVgMzfRJ_PYnHsDHO2Y5cTt0mZWvNSmuDN0Go01ll68Zo6p62PwRLsp8Jb-RMd6-YRJQ3bQhIxR19o6X8GegFeBsStLaGaxB4uCxcW9HAZFC_30NkEDndsBSpYDnHfzKwzd4mk1Y610wR5qRD56ZzV8bO4bcl7lCo89"
              />
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#0e141d]/90 backdrop-blur-sm text-[#58ed80] text-[10px] font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px]">star</span>
                <span>96%</span>
              </div>
            </div>

            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div className="flex flex-col gap-1">
                <div className="flex items-start justify-between gap-1">
                  <span
                    className="font-jakarta text-[18px] text-[#dde2f0] font-bold truncate cursor-pointer hover:text-[#66c0f4]"
                    onClick={() => onSelectGame('phasmophobia')}
                  >
                    Phasmophobia
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#58ed80]/15 text-[#58ed80] text-[10px] font-bold flex items-center gap-1 flex-shrink-0">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    <span>4/4 Ready</span>
                  </span>
                </div>
                <span className="text-[12px] text-[#bfc8d0]">Online Co-Op • VR & PC Crossplay</span>
              </div>

              {/* Ownership Micro-Matrix */}
              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex items-center justify-between text-[#bfc8d0] text-[10px]">
                  <span>All 4 Installed</span>
                  <span className="text-[#58ed80] font-bold">Squad Sync 100%</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-lg bg-[#161c25]">
                  {['A', 'J', 'S', 'E'].map((initial) => (
                    <div
                      key={initial}
                      className="flex items-center justify-center gap-1 py-1 rounded bg-[#1a2029] text-[#58ed80]"
                    >
                      <span className="text-[10px] text-[#dde2f0] font-medium">{initial}</span>
                      <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-space-md py-2.5 bg-[#242a34]">
            <div className="flex items-center gap-1.5 text-[#bfc8d0] text-[12px]">
              <span className="material-symbols-outlined text-[#a1d9ff] text-[18px]">
                view_in_ar
              </span>
              <span>VR Supported</span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onLaunchParty('Phasmophobia');
              }}
              className="px-4 py-1.5 rounded-lg bg-[#58ed80] text-[#003915] text-[12px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Launch Party</span>
            </button>
          </div>
        </div>

        {/* Game 4: Valheim */}
        <div className="flex flex-col bg-[#1a2029] rounded-xl overflow-hidden shadow-sm border border-white/5">
          <div className="flex gap-space-md p-space-md">
            <div
              className="relative w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-[#2f353f] shadow-inner cursor-pointer"
              onClick={() => onSelectGame('valheim')}
            >
              <img
                className="w-full h-full object-cover"
                alt="Valheim"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGrRtimr7wGL8zIpHLc_mIih4iMhDcuyNNt1mDKahWsu0ML1h8EF3lXfKr04shSHE0veKVYrd5MRVkxUnXpX1CQYztTg5L63FS7dwvbqHGAJ0yPqiU0c6iFisuRVuuBhPA4bpK5CmY065crkkhlwhy7MQqdJrbBbbll2ZGQl7dQb41GC99oNtLCrbbgbGxHQCqEabd5jSBcXOR-R4VlF8DNp1f00u-DNjck9NvQhWQqF0-bWpoPGnm"
              />
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#2f353f] text-[#bfc8d0] text-[10px] font-bold">
                Bundle
              </div>
            </div>

            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div className="flex flex-col gap-1">
                <div className="flex items-start justify-between gap-1">
                  <span
                    className="font-jakarta text-[18px] text-[#dde2f0] font-bold truncate cursor-pointer hover:text-[#66c0f4]"
                    onClick={() => onSelectGame('valheim')}
                  >
                    Valheim
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#2f353f] text-[#bfc8d0] text-[10px] font-bold flex-shrink-0">
                    2/4 Own
                  </span>
                </div>
                <span className="text-[12px] text-[#bfc8d0]">Viking Sandbox • 1-10 Co-Op</span>
              </div>

              {/* Ownership Micro-Matrix */}
              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex items-center justify-between text-[#bfc8d0] text-[10px]">
                  <span>2 Players Missing</span>
                  <span className="text-[#dde2f0] font-bold">$34.00 bundle total</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-lg bg-[#161c25]">
                  <div className="flex items-center justify-center gap-1 py-1 rounded bg-[#1a2029] text-[#58ed80]">
                    <span className="text-[10px] text-[#dde2f0] font-medium">A</span>
                    <span className="material-symbols-outlined text-[13px]">check</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 py-1 rounded bg-[#0594fa]/20 text-[#c6e7ff]">
                    <span className="text-[10px] text-[#dde2f0] font-medium">J</span>
                    <span className="material-symbols-outlined text-[13px]">star</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 py-1 rounded bg-[#1a2029] text-[#89929a]">
                    <span className="text-[10px] text-[#dde2f0] font-medium">S</span>
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 py-1 rounded bg-[#1a2029] text-[#58ed80]">
                    <span className="text-[10px] text-[#dde2f0] font-medium">E</span>
                    <span className="material-symbols-outlined text-[13px]">check</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-space-md py-2.5 bg-[#242a34] gap-2">
            <div className="flex items-center gap-1.5 text-[#bfc8d0] text-[12px] min-w-0">
              <span className="material-symbols-outlined text-[#89929a] text-[18px]">loyalty</span>
              <span className="truncate">Steam 2-Pack Savings 15%</span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onSelectGame('valheim');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#2f353f] text-[#dde2f0] text-[12px] font-bold flex items-center gap-1 hover:bg-[#343944] active:scale-95 transition-all flex-shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
              <span>View Deal</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= SQUAD CROWDFUND CART ================= */}
      <section className="flex flex-col bg-[#242a34] p-space-md rounded-xl shadow-lg border border-white/5 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-[#0594fa]/10 blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0594fa] flex items-center justify-center text-[#002b4f] shadow-sm">
              <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
            </div>
            <div className="flex flex-col">
              <span className="font-jakarta text-[18px] text-[#dde2f0] font-bold leading-tight">
                Squad Crowdfund Cart
              </span>
              <span className="text-[12px] text-[#bfc8d0]">
                Instant squad license equalization
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#080e17] text-[#a1d9ff] text-[10px] font-bold border border-white/5">
            1 Active
          </span>
        </div>

        {/* Deal Card */}
        <div className="flex items-center justify-between p-space-md rounded-lg bg-[#080e17] mt-1 border border-white/5">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[12px] text-[#dde2f0] font-bold truncate">
              Gift Sons of the Forest to Sarah
            </span>
            <span className="text-[12px] text-[#6bff8f] font-semibold">
              $6.00 / each{' '}
              <span className="text-[#bfc8d0] font-normal text-[10px]">(3-way split)</span>
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                setPledged(!pledged);
              }}
              className={`px-3.5 py-2 rounded-lg text-[12px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all ${
                pledged
                  ? 'bg-[#58ed80] text-[#003915]'
                  : 'bg-[#a1d9ff] text-[#00344b] hover:brightness-110'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {pledged ? 'check_circle' : 'credit_card'}
              </span>
              <span>{pledged ? 'Pledged $6!' : 'Pledge $6'}</span>
            </button>
          </div>
        </div>

        {/* Progress track */}
        <div className="flex flex-col gap-1.5 mt-3">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#bfc8d0]">
              {pledged ? 'Alex, Jax & You pledged' : 'Alex & Jax pledged'}
            </span>
            <span className="text-[#a1d9ff] font-bold">
              {pledged ? '3 of 3 Paid ($18.00 / $18.00) ✓' : '2 of 3 Paid ($12.00 / $18.00)'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#1a2029] overflow-hidden">
            <div
              className="h-full bg-[#66c0f4] rounded-full transition-all duration-500 shadow-sm"
              style={{ width: pledged ? '100%' : '66.6%' }}
            ></div>
          </div>
        </div>
      </section>
    </div>
  );
};
