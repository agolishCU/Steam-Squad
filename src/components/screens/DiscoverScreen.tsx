import React, { useState } from 'react';
import { GAMES_DATA, SQUAD_MEMBERS } from '../../data/mockData';
import { sound } from '../../utils/audio';

interface DiscoverScreenProps {
  onSelectGame: (gameId: string) => void;
  onLaunchFlight: () => void;
  onOpenSwipeDeck: () => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onSelectGame,
  onLaunchFlight,
  onOpenSwipeDeck,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all4');
  const [hasVotedHelldivers, setHasVotedHelldivers] = useState<boolean>(false);
  const [pickedDeepRock, setPickedDeepRock] = useState<boolean>(false);
  const [giftedJax, setGiftedJax] = useState<boolean>(false);
  const [pooledElena, setPooledElena] = useState<boolean>(false);

  const filterChips = [
    { id: 'all4', label: 'All 4 Own (18)', icon: 'check_circle' },
    { id: 'sale', label: 'On Sale (-50%+)', icon: 'local_offer' },
    { id: 'party', label: 'Party & Casual', icon: 'casino' },
    { id: 'survival', label: 'Co-op Survival', icon: 'shield' },
    { id: 'under10', label: 'Under $10 For Rest', icon: 'payments' },
  ];

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-margin pb-space-xl gap-space-lg select-none">
      {/* ================= ACTIVE PARTY HEADER DOCK ================= */}
      <section className="w-full bg-[#242a34]/90 backdrop-blur-xl rounded-xl p-space-md shadow-md border border-white/5">
        <div className="flex items-center justify-between gap-space-sm mb-space-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#58ed80] shadow-[0_0_8px_rgba(88,237,128,0.8)] animate-pulse flex-shrink-0"></div>
            <div className="min-w-0">
              <span className="font-jakarta text-[18px] text-[#dde2f0] font-bold tracking-tight block truncate">
                The Night Shift
              </span>
              <span className="text-[12px] text-[#bfc8d0] flex items-center gap-space-xs truncate">
                <span>4 members active</span>
                <span className="inline-block w-1 h-1 rounded-full bg-[#89929a]"></span>
                <span className="text-[#6bff8f] text-[10px] font-bold">In Voice</span>
              </span>
            </div>
          </div>
          <div className="flex items-center bg-[#080e17]/80 px-space-sm py-1 rounded-full shadow-sm flex-shrink-0 border border-white/5">
            <span className="material-symbols-outlined text-[16px] text-[#a1d9ff] mr-1">sync</span>
            <span className="text-[10px] text-[#a1d9ff] font-bold">100% Synced</span>
          </div>
        </div>

        {/* Squad Member Avatars Row */}
        <div className="flex items-center justify-between pt-space-xs">
          <div className="flex items-center -space-x-2">
            {SQUAD_MEMBERS.map((member) => (
              <div key={member.id} className="relative group">
                <img
                  className="w-10 h-10 rounded-full object-cover shadow-sm bg-[#1a2029] ring-2 ring-[#0e141d]"
                  alt={member.name}
                  src={member.avatar}
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0e141d] ${
                    member.status === 'downloading'
                      ? 'bg-[#0594fa] shadow-[0_0_6px_rgba(5,148,250,0.8)]'
                      : 'bg-[#58ed80] shadow-[0_0_6px_rgba(88,237,128,0.9)]'
                  }`}
                ></span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="text-[10px] text-[#bfc8d0]">Lobby Ping:</span>
            <span className="text-[10px] text-[#58ed80] font-bold bg-[#080e17] px-2 py-0.5 rounded-full border border-white/5">
              24ms
            </span>
          </div>
        </div>
      </section>

      {/* ================= SMART LIBRARY FILTERS ================= */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-space-xs">
          <span className="text-[10px] text-[#bfc8d0] uppercase tracking-wider font-bold">
            Smart Library Filters
          </span>
          <button
            onClick={() => {
              sound.playClick();
              setActiveFilter('all4');
            }}
            className="text-[10px] text-[#a1d9ff] flex items-center hover:underline cursor-pointer"
          >
            <span>Reset</span>
            <span className="material-symbols-outlined text-[14px] ml-0.5">tune</span>
          </button>
        </div>

        <div className="flex gap-space-sm overflow-x-auto pb-space-xs -mx-margin px-margin no-scrollbar">
          {filterChips.map((chip) => {
            const isSelected = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => {
                  sound.playClick();
                  setActiveFilter(chip.id);
                }}
                className={`flex-shrink-0 flex items-center gap-space-xs px-space-md py-space-xs rounded-full transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#66c0f4] text-[#004d6c] shadow-[0_0_12px_rgba(102,192,244,0.4)] font-bold'
                    : 'bg-[#1a2029] text-[#dde2f0] hover:bg-[#242a34]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">{chip.icon}</span>
                <span className="text-[12px] whitespace-nowrap">{chip.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= HERO FEATURED MATCH CARD: HELLDIVERS 2 ================= */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[#66c0f4] text-[20px]">stars</span>
            <span className="font-jakarta text-[18px] text-[#dde2f0] font-bold">
              Top Squad Recommendation
            </span>
          </div>
          <span className="text-[10px] text-[#bfc8d0] font-bold bg-[#1a2029] px-2 py-0.5 rounded-full border border-white/5">
            98% Match
          </span>
        </div>

        <div className="relative w-full rounded-xl bg-[#1a2029] overflow-hidden shadow-xl border border-white/5">
          {/* Media Header Background */}
          <div className="relative w-full h-48 bg-[#2f353f]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNkJBNguCS-citcHJcBkoH8Z_L3yYpCE4yy5VYTkqke8-bAVegOMxUImppN9Mb16CxOYQLgCznb_dfdgZcPxToCPKOWSFxwDdlPe9GFa7YZU7Xo6Y1dBLQWTcqKEHANDFQ-4u-9rfYw1vUSgqqLRXoWYvwV2MbpMudbavciABCw6PAyYAfJnNCyPuvqPssWVSDPsXjF5qChVrXCAxJBVAWOnE8WS8Xa5y-GhsvaK1Iwpe5nMf7zSS2"
              alt="Helldivers 2"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2029] via-[#1a2029]/60 to-transparent"></div>

            <div className="absolute top-space-sm left-space-sm flex items-center gap-space-xs">
              <span className="bg-[#58ed80]/20 backdrop-blur-md text-[#6bff8f] text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-[#58ed80]/30">
                <span className="material-symbols-outlined text-[14px]">groups</span>
                Ready for 4-Player Co-op!
              </span>
            </div>

            <div className="absolute top-space-sm right-space-sm">
              <span className="bg-[#080e17]/90 backdrop-blur-md text-[#d2e4ff] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-white/10">
                -20% SALE
              </span>
            </div>
          </div>

          {/* Card Core Details */}
          <div className="p-space-md flex flex-col gap-space-md -mt-6 relative z-10">
            <div>
              <div className="flex items-start justify-between gap-space-sm">
                <div
                  className="cursor-pointer group"
                  onClick={() => {
                    sound.playClick();
                    onSelectGame('helldivers-2');
                  }}
                >
                  <h2 className="font-jakarta text-[24px] font-bold text-[#dde2f0] leading-tight group-hover:text-[#66c0f4] transition-colors">
                    HELLDIVERS™ 2
                  </h2>
                  <div className="flex items-center gap-space-xs mt-1">
                    <span className="bg-[#66c0f4]/15 text-[#66c0f4] text-[10px] font-bold px-2 py-0.5 rounded">
                      Overwhelmingly Positive (92%)
                    </span>
                    <span className="text-[12px] text-[#bfc8d0]">• 184k reviews</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[12px] text-[#89929a] line-through block leading-none">
                    $39.99
                  </span>
                  <span className="font-jakarta text-[18px] text-[#6bff8f] font-bold leading-tight">
                    $31.99
                  </span>
                </div>
              </div>

              {/* Squad Ownership Insight Row */}
              <div className="mt-space-md p-space-sm rounded-lg bg-[#242a34] flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="flex -space-x-1.5 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#58ed80] flex items-center justify-center text-[#003915] font-bold text-[10px] shadow-sm">
                      A
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#58ed80] flex items-center justify-center text-[#003915] font-bold text-[10px] shadow-sm">
                      S
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#58ed80] flex items-center justify-center text-[#003915] font-bold text-[10px] shadow-sm">
                      E
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#343944] flex items-center justify-center text-[#bfc8d0] font-bold text-[10px] shadow-sm">
                      J
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] text-[#dde2f0] font-semibold block truncate">
                      3/4 Squad Owns
                    </span>
                    <span className="text-[12px] text-[#d2e4ff] block truncate">
                      Jax has it wishlisted
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#a1d9ff] text-[20px]">loyalty</span>
              </div>

              {/* Feature Tag Pills */}
              <div className="flex flex-wrap gap-1.5 mt-space-sm">
                <span className="text-[10px] text-[#bfc8d0] bg-[#080e17] px-2 py-1 rounded">
                  Online Co-Op
                </span>
                <span className="text-[10px] text-[#bfc8d0] bg-[#080e17] px-2 py-1 rounded">
                  PvE
                </span>
                <span className="text-[10px] text-[#bfc8d0] bg-[#080e17] px-2 py-1 rounded">
                  Crossplay
                </span>
                <span className="text-[10px] text-[#58ed80] bg-[#080e17] px-2 py-1 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">verified</span> Deck Verified
                </span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  setHasVotedHelldivers(!hasVotedHelldivers);
                }}
                className={`w-full min-h-[44px] px-space-md py-space-sm font-jakarta text-[14px] font-bold rounded-lg flex items-center justify-center gap-space-xs active:scale-[0.98] transition-all ${
                  hasVotedHelldivers
                    ? 'bg-[#58ed80] text-[#003915] shadow-[0_0_20px_rgba(88,237,128,0.6)]'
                    : 'bg-gradient-to-r from-[#0594fa] to-[#66c0f4] text-[#004d6c] shadow-[0_0_16px_rgba(102,192,244,0.4)] hover:brightness-110'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {hasVotedHelldivers ? 'check_circle' : 'how_to_vote'}
                </span>
                <span>
                  {hasVotedHelldivers ? 'Ready! (4/4 Squad Locked)' : 'Vote to Play (3/4)'}
                </span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setGiftedJax(!giftedJax);
                }}
                className={`w-full min-h-[44px] px-space-md py-space-sm font-jakarta text-[14px] font-bold rounded-lg flex items-center justify-center gap-space-xs active:scale-[0.98] transition-all ${
                  giftedJax
                    ? 'bg-[#58ed80]/20 text-[#58ed80] border border-[#58ed80]/40'
                    : 'bg-[#2f353f] hover:bg-[#343944] text-[#a1d9ff]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">redeem</span>
                <span>{giftedJax ? 'Gift Sent to Jax! 🎁' : 'Quick Gift Jax ($31.99)'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INSTANT SQUAD OVERLAP LIST ================= */}
      <section className="w-full flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[#58ed80] text-[20px]">layers</span>
            <h3 className="font-jakarta text-[18px] text-[#dde2f0] font-bold">
              Instant Squad Overlap
            </h3>
          </div>
          <span className="text-[10px] text-[#6bff8f] font-bold">18 Ready</span>
        </div>

        {/* Game Card 1: Lethal Company */}
        <div className="w-full bg-[#1a2029] rounded-xl p-space-md shadow-md border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
          <div
            className="flex items-center gap-space-md min-w-0 w-full sm:w-auto cursor-pointer"
            onClick={() => {
              sound.playClick();
              onSelectGame('lethal-company');
            }}
          >
            <div className="w-16 h-16 rounded-lg bg-[#2f353f] flex-shrink-0 overflow-hidden relative shadow-sm">
              <img
                className="w-full h-full object-cover"
                alt="Lethal Company"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGFLA_HDmGLczsIWttxGIT2PWQZl1CmuJ25e3MGLXstZooC69xuMkRiI3DAA15HMfo883lX69NRX2w7tWLFFwabGMPNCkDcUa3AGuHzLvnOSkEsX1bD86iz45zf-LZ-17GVqglN-nYXPfBMKOIhlzKxaoulGk6PnSLpI1xFRGlGJMraax4XOwvNMF0ujFUOnBJGCVbXhMuho_4Wo9K-IOQc0U5XTb3llp2N2W3YXIngNw-KPEXhxdT"
              />
              <span className="absolute top-1 left-1 bg-[#58ed80] text-[#003915] text-[10px] px-1 rounded-sm font-bold leading-none">
                4/4
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-space-xs">
                <h4 className="text-[16px] font-bold text-[#dde2f0] truncate">Lethal Company</h4>
                <span className="w-2 h-2 rounded-full bg-[#58ed80] flex-shrink-0 animate-ping"></span>
              </div>
              <span className="text-[12px] text-[#6bff8f] font-bold block truncate mt-0.5">
                4/4 Own (Everyone Ready!)
              </span>
              <span className="text-[12px] text-[#bfc8d0] flex items-center gap-1 mt-0.5 truncate">
                <span className="material-symbols-outlined text-[14px]">history</span>
                Last played together: 2 days ago
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                sound.playClick();
                onLaunchFlight();
              }}
              className="w-full sm:w-auto min-h-[44px] px-space-lg py-space-xs bg-[#58ed80] text-[#003915] text-[12px] font-bold rounded-lg shadow-[0_0_12px_rgba(88,237,128,0.3)] flex items-center justify-center gap-space-xs hover:brightness-110 active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">sports_esports</span>
              <span>Launch Flap Derby</span>
            </button>
          </div>
        </div>

        {/* Game Card 2: Deep Rock Galactic */}
        <div className="w-full bg-[#1a2029] rounded-xl p-space-md shadow-md border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
          <div
            className="flex items-center gap-space-md min-w-0 w-full sm:w-auto cursor-pointer"
            onClick={() => {
              sound.playClick();
              onSelectGame('deep-rock-galactic');
            }}
          >
            <div className="w-16 h-16 rounded-lg bg-[#2f353f] flex-shrink-0 overflow-hidden relative shadow-sm">
              <img
                className="w-full h-full object-cover"
                alt="Deep Rock Galactic"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmKxfg84cA9bh9d-Lbi4TFxXRTqwDhUWnAhKUXoQObETEtPDVTI7bl93Cc4vkyZwc44vKygf8pYy7GOgczlOHjXaaOlkqwe4RH991OdPrU8utoJIWsdeYR3B7H38uERz2hNOS8gfhXEkiVcAyeE7XW03mtsed1wMQcpyYystIqYTl3VE3m_PDHQ_3FDhAtxcTK-8Dpagn-JWg_JX8y0FjAwXxU99r1PGCeb079TJ1ZGX0V4_nfpk8N"
              />
              <span className="absolute top-1 left-1 bg-[#58ed80] text-[#003915] text-[10px] px-1 rounded-sm font-bold leading-none">
                4/4
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-space-xs">
                <h4 className="text-[16px] font-bold text-[#dde2f0] truncate">
                  Deep Rock Galactic
                </h4>
              </div>
              <span className="text-[12px] text-[#58ed80] font-bold block truncate mt-0.5">
                Rock & Stone Ready • 4/4 Own
              </span>
              <span className="text-[12px] text-[#bfc8d0] flex items-center gap-1 mt-0.5 truncate">
                <span className="material-symbols-outlined text-[14px]">tune</span>
                4-Player Co-Op Campaign
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                sound.playClick();
                setPickedDeepRock(!pickedDeepRock);
              }}
              className={`w-full sm:w-auto min-h-[44px] px-space-lg py-space-xs text-[12px] font-bold rounded-lg active:scale-95 transition-all flex items-center justify-center gap-space-xs ${
                pickedDeepRock
                  ? 'bg-[#58ed80] text-[#003915]'
                  : 'bg-[#242a34] text-[#a1d9ff] hover:bg-[#343944]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>{pickedDeepRock ? 'Picked! ⛏️' : 'Pick This'}</span>
            </button>
          </div>
        </div>

        {/* Game Card 3: Content Warning */}
        <div className="w-full bg-[#1a2029] rounded-xl p-space-md shadow-md border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
          <div
            className="flex items-center gap-space-md min-w-0 w-full sm:w-auto cursor-pointer"
            onClick={() => {
              sound.playClick();
              onSelectGame('content-warning');
            }}
          >
            <div className="w-16 h-16 rounded-lg bg-[#2f353f] flex-shrink-0 overflow-hidden relative shadow-sm">
              <img
                className="w-full h-full object-cover"
                alt="Content Warning"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT3hSnOrj48PGQPIMxMf3iO-rRxoFrcMOMe1qHzVphZK4xPMgEEMhu4XZhi5MH0yPZgnVil4xZBH1O3F8c6l21rSkZBAiZdb6JzfOnqrf-eTIhqnxMJjuFoLBNTyH8kGiGONIP9547onDpjIjBdNMyJxi8J1YysievDJO-czpUMVLc-_jY4sReNRkkr1KLAI86NXaZFg10nxlQ6O_cC3VSk8ghtloD6PNJrxuPGpMEsqNSToX6L6-l"
              />
              <span className="absolute top-1 left-1 bg-[#a0c9ff] text-[#00325a] text-[10px] px-1 rounded-sm font-bold leading-none">
                3/4
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[16px] font-bold text-[#dde2f0] truncate">Content Warning</h4>
              <span className="text-[12px] text-[#a0c9ff] block truncate mt-0.5">
                3/4 Own • Elena needs copy
              </span>
              <span className="text-[12px] text-[#58ed80] font-bold flex items-center gap-1 mt-0.5 truncate">
                <span className="material-symbols-outlined text-[14px]">savings</span>
                Only $7.99 to complete 4-stack
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                sound.playClick();
                setPooledElena(!pooledElena);
              }}
              className={`w-full sm:w-auto min-h-[44px] px-space-lg py-space-xs text-[12px] font-bold rounded-lg shadow-sm active:scale-95 transition-all flex items-center justify-center gap-space-xs ${
                pooledElena
                  ? 'bg-[#58ed80] text-[#003915]'
                  : 'bg-[#66c0f4] text-[#004d6c] hover:brightness-110'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">group_add</span>
              <span>{pooledElena ? 'Pledged $2.66! ✓' : 'Pool Cost ($2.66/ea)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= SQUAD MATCH DECK / SWIPE TRIGGER ================= */}
      <section className="w-full">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#242a34] via-[#1a2029] to-[#080e17] p-space-md shadow-xl border border-white/5">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-[#0594fa]/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="bg-[#a1d9ff]/20 text-[#a1d9ff] p-1.5 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">style</span>
                </span>
                <div>
                  <span className="font-jakarta text-[18px] text-[#dde2f0] font-bold leading-tight block">
                    Squad Match Deck
                  </span>
                  <span className="text-[12px] text-[#bfc8d0]">
                    Tinder-style rapid session chooser
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-[#58ed80] bg-[#080e17] px-2.5 py-1 rounded-full font-bold border border-white/5">
                10 Games
              </span>
            </div>

            <p className="text-[14px] text-[#bfc8d0]">
              Can't decide? Swipe 10 curated overlap games simultaneously. The moment everyone swipes
              right, SteamSquad auto-launches the session.
            </p>

            <div className="pt-space-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenSwipeDeck();
                }}
                className="w-full min-h-[44px] py-space-sm px-space-md rounded-lg bg-[#2f353f] hover:bg-[#343944] text-[#a1d9ff] text-[14px] font-bold flex items-center justify-center gap-space-sm active:scale-[0.98] transition-all shadow-md"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px] text-[#58ed80]">bolt</span>
                <span>Launch Quick Swipe Session</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
