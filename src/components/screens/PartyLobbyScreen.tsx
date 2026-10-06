import React, { useState } from 'react';
import { sound } from '../../utils/audio';

interface PartyLobbyProps {
  onLaunchGame: () => void;
}

export const PartyLobbyScreen: React.FC<PartyLobbyProps> = ({ onLaunchGame }) => {
  const [isReady, setIsReady] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [micJoined, setMicJoined] = useState<boolean>(false);
  const [sharedToast, setSharedToast] = useState<boolean>(false);

  // Voting state for games
  const [votes, setVotes] = useState({
    lethal: 4,
    phasmo: 3,
    content: 2,
  });

  const [hasVoted, setHasVoted] = useState({
    lethal: true,
    phasmo: false,
    content: false,
  });

  const handleVote = (game: 'lethal' | 'phasmo' | 'content') => {
    sound.playClick();
    setHasVoted((prev) => {
      const cur = prev[game];
      setVotes((v) => ({ ...v, [game]: cur ? v[game] - 1 : v[game] + 1 }));
      return { ...prev, [game]: !cur };
    });
  };

  const handleCopyCode = () => {
    sound.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText('STEAM-SQUAD-88219-ALPHA').catch(() => {});
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handleLaunch = () => {
    sound.playClick();
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      onLaunchGame();
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-margin pb-space-xl gap-space-lg select-none">
      {/* ================= SESSION HERO CARD ================= */}
      <section className="relative w-full rounded-xl bg-[#1a2029] overflow-hidden shadow-xl shadow-black/40 border border-white/5">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#66c0f4]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#58ed80]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative p-space-lg flex flex-col gap-space-md">
          {/* Session Badge & Countdown Tag */}
          <div className="flex items-center justify-between gap-space-sm flex-wrap">
            <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-[#242a34] border border-white/5">
              <span className="w-2 h-2 rounded-full bg-[#58ed80] animate-ping"></span>
              <span className="text-[10px] text-[#58ed80] tracking-wide uppercase font-bold">
                Confirmed Session
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-[#080e17] text-[#66c0f4] text-[10px] border border-white/5">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>Starts in 3h 24m</span>
            </div>
          </div>

          {/* Session Title & Game Identity */}
          <div className="flex gap-space-md items-center">
            <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#080e17] shadow-md shadow-black/60">
              <img
                className="w-full h-full object-cover"
                alt="Lethal Company"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuButIYClmkVY2yjcKlVKA0Q06wsiqQuj4mtCGplRDuUdtARDju_UMC1YzMEGLhka-1s0HsGJoIy9mJEAjJBQb49-YKTbNS9wtUuv_W_1q_g-7vW89H1tgHygQrKiCj96O4yryCd46Afa7dPQZBs6725qkcpaUCCvPgQ7iQoGBg-vuk71EgygGoIATYjph2DhB6xA9jNS0TPBasCqjkb0iFl2ggAnxw6Z9oZns_zBkHVe9OgOgCFxQD7"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e141d]/90 via-transparent to-transparent"></div>
              <span className="absolute bottom-1 left-1.5 text-[9px] text-[#58ed80] uppercase font-bold tracking-tight">
                CO-OP
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#bfc8d0] uppercase tracking-wider">
                Squad Event #18
              </span>
              <h2 className="font-jakarta text-[20px] text-[#dde2f0] font-extrabold truncate">
                Friday Night Chaos
              </h2>
              <div className="flex items-center gap-space-xs mt-1">
                <span className="material-symbols-outlined text-[#66c0f4] text-[16px]">
                  sports_esports
                </span>
                <span className="text-[12px] text-[#a1d9ff] font-semibold truncate">
                  Lethal Company (Modded Pack v2)
                </span>
              </div>
            </div>
          </div>

          {/* Discord Voice Room Bar */}
          <div className="flex items-center justify-between px-space-md py-space-sm rounded-lg bg-[#242a34]/70 backdrop-blur-md border border-white/5">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#5865F2]/20 flex items-center justify-center flex-shrink-0 text-[#c6e7ff]">
                <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#dde2f0] font-bold">Discord Linked</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#58ed80]"></span>
                </div>
                <span className="text-[12px] text-[#bfc8d0] truncate">#game-night-alpha</span>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setMicJoined(!micJoined);
              }}
              className={`px-space-sm py-1 rounded text-[10px] font-bold transition-all active:scale-95 flex items-center gap-1 ${
                micJoined
                  ? 'bg-[#58ed80]/20 text-[#58ed80]'
                  : 'bg-[#2f353f] hover:bg-[#343944] text-[#a1d9ff]'
              }`}
              type="button"
            >
              <span>{micJoined ? 'Connected 🟢' : 'Join Mic'}</span>
              <span className="material-symbols-outlined text-[14px]">
                {micJoined ? 'mic' : 'open_in_new'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= SQUAD AVAILABILITY ================= */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[#a1d9ff] text-[20px]">group</span>
            <h3 className="font-jakarta text-[18px] text-[#dde2f0] font-bold">Squad Availability</h3>
          </div>
          <span className="text-[10px] text-[#6bff8f] font-bold bg-[#34d067]/20 px-2 py-0.5 rounded-full">
            {isReady ? '4 / 4 Present' : '3 / 4 Present'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-space-sm">
          {/* Member 1: Alex */}
          <div className="flex items-center justify-between p-space-md rounded-xl bg-[#161c25] shadow-sm border border-white/5">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  className="w-11 h-11 rounded-full object-cover shadow-sm ring-1 ring-white/10"
                  alt="Alex"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSvuWUGGEwbSyE-AuOyj6cejb9bOmScleVdCNDzvGetZIiy3O7zGDepOlYWNtN_yKhBFtn8RHw2CaLY5pS_dGx7taKJ30yi9zuoK4dFWZ6oa7w-LIAU38npKwxclM0LNi_egxAU8hWCFXZqHAx5T4Tg2WPYcacjeSA-mQV4KSC4bLJBkLuz1cnxEljou26lS8_Rgd7h64ox6Tf7HG3sxKtu8KG2RvZ7TFaLjRZwOaPcT3Tx4tcwUtJ"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#58ed80] shadow-[0_0_8px_rgba(88,237,128,0.8)] border-2 border-[#161c25]"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="text-[16px] text-[#dde2f0] font-bold truncate">Alex</span>
                  <span className="text-[10px] text-[#004d6c] bg-[#66c0f4] px-1.5 py-0.2 rounded-full font-bold">
                    HOST
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[#58ed80] text-[14px]">mic</span>
                  <span className="text-[12px] text-[#6bff8f] truncate">
                    Online & Ready (Mic On)
                  </span>
                </div>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#58ed80] shadow-[0_0_6px_rgba(88,237,128,0.9)]"></span>
          </div>

          {/* Member 2: You */}
          <div className="flex items-center justify-between p-space-md rounded-xl bg-[#1a2029] shadow-sm border border-white/5">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  className="w-11 h-11 rounded-full object-cover shadow-sm ring-1 ring-white/10"
                  alt="You"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAnBuf7EuYBafV54yG9pVRy5CDJhrJrUUHxDa4YN0g1W8booP2XWaxVNOToMhTMj671r2wweLylXqnF2XKq32hRyrXQlhNQPy657Kp9H1Vsxc-JiSCcURLJdTCgEmg7UPrnco-FYlqma6jVxyNjlWWRtcaS_r_6BjLPJLrgbT3ljMrLrw6nkVCAOZBLyvYjeztr5CK-9Rm4TR3sPeusaJwAyM3tGtaPMALY85rEe1fbcoLb1qOKw6d"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#1a2029] ${
                    isReady ? 'bg-[#58ed80]' : 'bg-[#89929a]'
                  }`}
                ></span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="text-[16px] text-[#a1d9ff] font-bold">You</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isReady ? 'bg-[#58ed80] text-[#003915]' : 'bg-[#2f353f] text-[#89929a]'
                    }`}
                  >
                    {isReady ? 'LOBBY READY' : 'NOT READY'}
                  </span>
                </div>
                <span className="text-[12px] text-[#6bff8f] mt-0.5">
                  {isReady ? 'Ready to Drop In' : 'Standing By'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setIsReady(!isReady);
              }}
              className={`px-space-sm py-1.5 rounded-lg text-[12px] font-bold active:scale-95 transition-all flex items-center gap-1 ${
                isReady
                  ? 'bg-[#242a34] text-[#58ed80] hover:bg-[#343944]'
                  : 'bg-[#242a34] text-[#89929a]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isReady ? 'check_circle' : 'cancel'}
              </span>
              <span>{isReady ? 'Ready' : 'Set Ready'}</span>
            </button>
          </div>

          {/* Member 3: Sarah */}
          <div className="flex items-center justify-between p-space-md rounded-xl bg-[#161c25] shadow-sm border border-white/5">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  className="w-11 h-11 rounded-full object-cover shadow-sm ring-1 ring-white/10"
                  alt="Sarah"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL5EjUn8Y9088XhXLUteErMroqcuk5bIPAkSEPuz79Iap15RJuDu3aU96RkKi4NilVWqUGOcZqUwkEU9UGUpvL6kA0M_3AhQgPv1bhKbStTj7SyzdZPPFHVfr1QkflEOiCOqha7PJ2vC-FdooVMlCaQHqewdbABmBbGOEfNc-vmPunc2Z33VJr0LHkf66R4CH_yQi-AdUuHTxCcyrOGf3BOXIux40FzGqaYkOpkV5FTEEwqxbDkCi0"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[#161c25]"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[16px] text-[#dde2f0] font-bold truncate">Sarah</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-amber-300 text-[14px]">
                    schedule
                  </span>
                  <span className="text-[12px] text-[#bfc8d0] truncate">Joining at 8:30 PM</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-space-sm py-1 rounded bg-amber-950/40 text-amber-300 text-[10px] flex-shrink-0 border border-amber-500/20">
              <span>In 36m</span>
            </div>
          </div>

          {/* Member 4: Jax */}
          <div className="flex flex-col p-space-md rounded-xl bg-[#161c25] shadow-sm gap-2 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-md min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    className="w-11 h-11 rounded-full object-cover shadow-sm ring-1 ring-white/10"
                    alt="Jax"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-tWYnLDiPQ6lBcfmi2UidHE-M2bM1kM-Ge8ZvhCT4mXl569vZ39kEuPH2QAibTJMrgeJHrnWgyKZL2WcF1u3x0mN2hwjlOOcMdCJeNyxirVmvdqr5Bix5GgRo15YbDmPn8NJLUFvPFpL6rk2m2T-_26dIQeAKveHQ3KLwL2nHQHJlXC7ILt2AHmlIxYIyG_QItXVFAKKbY50Qa2PMFs3UR3pGmw26oUNqqvV65v2N4AdzgV09bEnF"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#66c0f4] border-2 border-[#161c25]"></span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[16px] text-[#dde2f0] font-bold truncate">Jax</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[#66c0f4] text-[14px]">
                      download
                    </span>
                    <span className="text-[12px] text-[#a1d9ff] truncate">Downloading update</span>
                  </div>
                </div>
              </div>
              <span className="text-[12px] text-[#66c0f4] font-mono font-bold">84%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#2f353f] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0594fa] to-[#66c0f4] rounded-full transition-all duration-500"
                style={{ width: '84%' }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STEAM LAUNCH CONTROLS & MOD SYNC ================= */}
      <section className="flex flex-col p-space-lg rounded-xl bg-[#1a2029] shadow-xl gap-space-md border border-white/5">
        <div className="flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[#58ed80] text-[20px]">verified</span>
            <span className="text-[16px] text-[#dde2f0] font-bold">Modpack Status</span>
          </div>
          <div className="flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-[#58ed80]/15 text-[#58ed80] text-[10px] font-semibold border border-[#58ed80]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#58ed80]"></span>
            <span>v2.4.1 Synced</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-space-sm rounded-lg bg-[#242a34]/60 border border-white/5">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[#bfc8d0] text-[18px]">folder_zip</span>
            <span className="text-[12px] text-[#bfc8d0]">All 4 Players on v2.4.1 (Sync OK)</span>
          </div>
          <span className="material-symbols-outlined text-[#58ed80] text-[18px]">cloud_done</span>
        </div>

        {/* Big Steam Launch CTA */}
        <div className="flex flex-col gap-space-sm pt-1">
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className="w-full h-14 py-3.5 px-space-md rounded-xl bg-gradient-to-r from-[#1999FF] to-[#66c0f4] text-[#001e2d] font-jakarta text-[18px] font-extrabold flex items-center justify-center gap-space-sm shadow-[0_0_24px_rgba(25,153,255,0.4)] active:scale-[0.98] transition-all cursor-pointer"
            type="button"
          >
            <span className={`material-symbols-outlined text-[24px] ${isLaunching ? 'animate-spin' : ''}`}>
              {isLaunching ? 'refresh' : 'rocket_launch'}
            </span>
            <span>{isLaunching ? 'Booting Steam Lobby...' : 'Launch Game via Steam'}</span>
          </button>

          {/* Copy Lobby Code / Link Action */}
          <div className="flex gap-space-sm items-center">
            <button
              onClick={handleCopyCode}
              className="flex-1 h-11 rounded-lg bg-[#242a34] text-[#dde2f0] text-[12px] font-bold flex items-center justify-center gap-space-xs hover:bg-[#343944] active:scale-95 transition-all border border-white/5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#a1d9ff]">
                {copiedCode ? 'done' : 'content_copy'}
              </span>
              <span>{copiedCode ? 'Lobby Code Copied!' : 'Copy Steam Join Code'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setSharedToast(true);
                setTimeout(() => setSharedToast(false), 2000);
              }}
              className="w-11 h-11 flex-shrink-0 rounded-lg bg-[#242a34] text-[#dde2f0] hover:bg-[#343944] flex items-center justify-center active:scale-95 transition-all border border-white/5"
              title="Share invite link"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-[#a1d9ff]">share</span>
            </button>
          </div>

          {sharedToast && (
            <p className="text-center text-[11px] text-[#58ed80] font-semibold animate-pulse">
              Party invite link generated and ready to paste!
            </p>
          )}
        </div>
      </section>

      {/* ================= NIGHT QUEUE & VOTE ================= */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[#a1d9ff] text-[20px]">how_to_vote</span>
            <h3 className="font-jakarta text-[18px] text-[#dde2f0] font-bold">Night Queue & Vote</h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              alert('Search modal: Add another Steam game from the library matrix!');
            }}
            className="px-space-sm py-1 rounded-full bg-[#a1d9ff]/10 text-[#66c0f4] text-[10px] font-bold flex items-center gap-1 active:scale-95 border border-[#a1d9ff]/20"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Game</span>
          </button>
        </div>

        {/* Ranked Game Vote Cards */}
        <div className="flex flex-col gap-space-sm">
          {/* #1 Pick: Lethal Company */}
          <div className="relative flex items-center justify-between p-space-md rounded-xl bg-[#1a2029] overflow-hidden shadow-sm border border-white/5">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#58ed80]"></div>
            <div className="flex items-center gap-space-md min-w-0 pl-1">
              <div className="w-7 h-7 rounded-full bg-[#34d067]/30 text-[#58ed80] font-jakarta text-[14px] flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="text-[16px] text-[#dde2f0] font-bold truncate">Lethal Company</span>
                  <span className="text-[10px] text-[#58ed80] bg-[#58ed80]/15 px-1.5 py-0.2 rounded-full font-bold">
                    SELECTED
                  </span>
                </div>
                <span className="text-[12px] text-[#bfc8d0]">
                  {votes.lethal} votes • 100% squad agreement
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs flex-shrink-0">
              <div className="flex -space-x-2 mr-1">
                <span className="w-6 h-6 rounded-full bg-[#66c0f4] text-[#00344b] text-[10px] font-bold flex items-center justify-center shadow">
                  A
                </span>
                <span className="w-6 h-6 rounded-full bg-[#0594fa] text-[#00344b] text-[10px] font-bold flex items-center justify-center shadow">
                  Y
                </span>
                <span className="w-6 h-6 rounded-full bg-[#58ed80] text-[#003915] text-[10px] font-bold flex items-center justify-center shadow">
                  S
                </span>
                <span className="w-6 h-6 rounded-full bg-[#343944] text-[#dde2f0] text-[10px] font-bold flex items-center justify-center shadow">
                  J
                </span>
              </div>
              <button
                onClick={() => handleVote('lethal')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-all ${
                  hasVoted.lethal ? 'bg-[#58ed80] text-[#003915]' : 'bg-[#242a34] text-[#bfc8d0]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              </button>
            </div>
          </div>

          {/* #2 Pick: Phasmophobia */}
          <div className="flex items-center justify-between p-space-md rounded-xl bg-[#161c25] shadow-sm border border-white/5">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#2f353f] text-[#bfc8d0] font-jakarta text-[14px] flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[16px] text-[#dde2f0] font-bold truncate">Phasmophobia</span>
                <span className="text-[12px] text-[#bfc8d0]">
                  {votes.phasmo} votes • Alex, Sarah, You
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm flex-shrink-0">
              <div className="flex -space-x-1.5 mr-0.5">
                <span className="w-5 h-5 rounded-full bg-[#66c0f4] text-[#00344b] text-[9px] font-bold flex items-center justify-center">
                  A
                </span>
                <span className="w-5 h-5 rounded-full bg-[#0594fa] text-[#00344b] text-[9px] font-bold flex items-center justify-center">
                  S
                </span>
                <span className="w-5 h-5 rounded-full bg-[#58ed80] text-[#003915] text-[9px] font-bold flex items-center justify-center">
                  Y
                </span>
              </div>
              <button
                onClick={() => handleVote('phasmo')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-all ${
                  hasVoted.phasmo ? 'bg-[#58ed80] text-[#003915]' : 'bg-[#242a34] text-[#a1d9ff]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              </button>
            </div>
          </div>

          {/* #3 Pick: Content Warning */}
          <div className="flex items-center justify-between p-space-md rounded-xl bg-[#161c25] shadow-sm border border-white/5">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#2f353f] text-[#bfc8d0] font-jakarta text-[14px] flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[16px] text-[#dde2f0] font-bold truncate">Content Warning</span>
                <span className="text-[12px] text-[#bfc8d0]">{votes.content} votes • Jax, You</span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm flex-shrink-0">
              <div className="flex -space-x-1.5 mr-0.5">
                <span className="w-5 h-5 rounded-full bg-[#343944] text-[#dde2f0] text-[9px] font-bold flex items-center justify-center">
                  J
                </span>
                <span className="w-5 h-5 rounded-full bg-[#58ed80] text-[#003915] text-[9px] font-bold flex items-center justify-center">
                  Y
                </span>
              </div>
              <button
                onClick={() => handleVote('content')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-all ${
                  hasVoted.content ? 'bg-[#58ed80] text-[#003915]' : 'bg-[#242a34] text-[#bfc8d0]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SQUAD LIVE ACTIVITY FEED ================= */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[#a1d9ff] text-[20px]">rss_feed</span>
            <h3 className="font-jakarta text-[18px] text-[#dde2f0] font-bold">Activity Feed</h3>
          </div>
          <span className="text-[10px] text-[#bfc8d0]">Real-time sync</span>
        </div>

        <div className="flex flex-col p-space-md rounded-xl bg-[#161c25] gap-space-md border border-white/5">
          <div className="flex items-start gap-space-sm">
            <div className="w-7 h-7 rounded-full bg-[#242a34] flex items-center justify-center text-[#66c0f4] flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">how_to_vote</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-[12px] text-[#dde2f0]">
                <span className="font-bold">Sarah</span> voted for{' '}
                <span className="font-semibold text-[#a1d9ff]">Phasmophobia</span>
              </p>
              <span className="text-[11px] text-[#bfc8d0]">12m ago</span>
            </div>
          </div>

          <div className="flex items-start gap-space-sm">
            <div className="w-7 h-7 rounded-full bg-[#242a34] flex items-center justify-center text-[#0594fa] flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">system_update_alt</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-[12px] text-[#dde2f0]">
                <span className="font-bold">Jax</span> finished{' '}
                <span className="font-semibold text-[#a1d9ff]">Helldivers 2</span> patch update
              </p>
              <span className="text-[11px] text-[#bfc8d0]">45m ago</span>
            </div>
          </div>

          <div className="flex items-start gap-space-sm">
            <div className="w-7 h-7 rounded-full bg-[#242a34] flex items-center justify-center text-[#58ed80] flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">event</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-[12px] text-[#dde2f0]">
                <span className="font-bold">Alex</span> scheduled{' '}
                <span className="font-semibold text-[#6bff8f]">Friday session</span> for 8:00 PM
              </p>
              <span className="text-[11px] text-[#bfc8d0]">2h ago</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
