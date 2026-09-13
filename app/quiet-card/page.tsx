"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

const FISH_IMAGE_SIZE = { width: 176, height: 147 };
const MALLET_IMAGE_SIZE = { width: 96, height: 80 };

const DEFAULT_CARDS = [
  "不是每一件事，都值得帶回家。",
  "有些話聽過就好，不必全部放進心裡。",
  "今天已經做得夠多了。",
  "別人的情緒，不需要由你負責收拾。",
  "先把這件事放在桌上，晚一點再決定要不要帶走。",
  "工作只是今天的一部分，不是你的全部。",
  "有些事情沒有立刻回應，也沒有關係。",
  "今天不順，也不代表整天都不好。",
  "把力氣留給真正重要的人和事。",
  "先照顧好自己的心，再處理眼前的事。",
];

const SCRIPTURE_LINES = [
  "我的前額葉長好了，他的還沒有。",
  "別人的情緒，不必住進我的腦袋。",
  "不是每一句話，都需要立刻回應。",
  "不是每一件事，都值得消耗我的情緒。",
  "我可以停一下。",
  "我可以晚一點再處理。",
  "我也可以選擇不接住。",
  "先把自己帶回來，再決定下一步。",
];

type Milestone = {
  count: number;
  title: string;
  titleSecondLine?: string;
  subtitle: string;
  footnote?: string;
  grand?: boolean;
};

const MILESTONES: Milestone[] = [
  {
    count: 78,
    title: "七上八下的，先敲到這裡。",
    subtitle: "事情還沒解決沒關係，至少心跳可以先慢一點。",
  },
  {
    count: 87,
    title: "系統偵測到 87。",
    subtitle: "有些話不能說，敲木魚就好。",
  },
  {
    count: 100,
    title: "前額葉已重新連線。",
    subtitle: "情緒仍在，但至少現在是你在決定下一步。",
  },
  {
    count: 300,
    title: "前額葉持續在線。",
    subtitle: "能敲到這裡還沒回嘴，今天的你已經很有修養。",
  },
  {
    count: 500,
    title: "今日修行，略有小成。",
    subtitle: "五百下了。事情可能還是很煩，但你至少沒有讓它變得更糟。",
  },
  {
    count: 999,
    title: "你今天太努力了。",
    subtitle: "都敲到 999 下了，有些事情真的不用什麼都自己撐著。",
  },
  {
    count: 2000,
    title: "系統偵測到異常高強度修行。",
    subtitle: "如果敲了兩千下還是很氣，建議先離開事發現場。問題可能真的不在你。",
  },
  {
    count: 5000,
    title: "你明天休假吧。",
    titleSecondLine: "真的。請特休。",
    subtitle: "都敲到五千下了，這已經不是木魚可以處理的範圍。",
    footnote: "Daily Desk 建議您今日停止情緒勞動。",
    grand: true,
  },
];

const KNOCK_QUOTES = [
  "前額葉上線中……",
  "先不要回嘴。",
  "他的情緒，不是我的工作。",
  "不是每一句話，都需要立刻回應。",
  "我可以不接住別人的失控。",
  "我的前額葉長好了，他的還沒有。",
  "先把自己帶回來，再決定要不要理他。",
  "很好，今天又少一場衝突。",
];

type CustomCard = {
  id: string;
  text: string;
};

function playKnockSound() {
  if (typeof window === "undefined" || !window.AudioContext) return;
  const ctx = new window.AudioContext();
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);

  // brief attack "flick" — a short burst, not a bright/glassy ping
  const attackDuration = 0.012;
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * attackDuration));
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 900;
  bandpass.Q.value = 0.8;
  const attackGain = ctx.createGain();
  attackGain.gain.setValueAtTime(0.35, now);
  attackGain.gain.exponentialRampToValueAtTime(0.001, now + attackDuration);
  noise.connect(bandpass);
  bandpass.connect(attackGain);
  attackGain.connect(master);
  noise.start(now);

  // main woody body tone — the hollow "篤/咚" pitch, mid register
  const body = ctx.createOscillator();
  const bodyGain = ctx.createGain();
  body.type = "sine";
  body.frequency.setValueAtTime(340, now);
  body.frequency.exponentialRampToValueAtTime(210, now + 0.07);
  bodyGain.gain.setValueAtTime(0.4, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.13);
  body.connect(bodyGain);
  bodyGain.connect(master);
  body.start(now);
  body.stop(now + 0.14);

  // faint higher partial for a touch of hollow-chamber resonance, fast decay
  const partial = ctx.createOscillator();
  const partialGain = ctx.createGain();
  partial.type = "sine";
  partial.frequency.setValueAtTime(760, now);
  partialGain.gain.setValueAtTime(0.08, now);
  partialGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.05);
  partial.connect(partialGain);
  partialGain.connect(master);
  partial.start(now);
  partial.stop(now + 0.06);

  body.onended = () => ctx.close();
}

function SpeakerMutedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 9v6h4l5 5V4L8 9H4Z"
        fill="currentColor"
      />
      <line
        x1="16"
        y1="9"
        x2="22"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="22"
        y1="9"
        x2="16"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpeakerOnIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
      <path
        d="M17 8a6 6 0 0 1 0 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M19.5 5.5a10 10 0 0 1 0 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export default function QuietCardPage() {
  const [customCards, setCustomCards] = useState<CustomCard[]>([]);
  const [drawnCard, setDrawnCard] = useState<string | null>(null);

  const [newCardText, setNewCardText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const [peace, setPeace] = useState(0);
  const [knockQuote, setKnockQuote] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [dedoVisible, setDedoVisible] = useState(false);
  const [dedoKey, setDedoKey] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isHoveringFish, setIsHoveringFish] = useState(false);
  const [isStriking, setIsStriking] = useState(false);
  const [malletPos, setMalletPos] = useState({ x: 0, y: 0 });
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(
    null,
  );
  const [triggeredMilestones, setTriggeredMilestones] = useState<Set<number>>(
    new Set(),
  );

  const fishSectionRef = useRef<HTMLElement>(null);
  const fishAreaRef = useRef<HTMLButtonElement>(null);

  const pool = useMemo(
    () => [...DEFAULT_CARDS, ...customCards.map((c) => c.text)],
    [customCards],
  );

  const draw = () => {
    if (pool.length === 0) return;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setDrawnCard(picked);
  };

  const scrollToFish = () => {
    fishSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const addCustomCard = () => {
    const text = newCardText.trim();
    if (!text) return;
    setCustomCards((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text },
    ]);
    setNewCardText("");
  };

  const startEdit = (card: CustomCard) => {
    setEditingId(card.id);
    setEditValue(card.text);
  };

  const saveEdit = () => {
    const text = editValue.trim();
    if (text && editingId) {
      setCustomCards((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, text } : c)),
      );
    }
    setEditingId(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const removeCustomCard = (id: string) => {
    setCustomCards((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) cancelEdit();
  };

  const handleFishMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = fishAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMalletPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const knock = () => {
    const nextPeace = peace + 1;
    setPeace(nextPeace);
    setKnockQuote(
      KNOCK_QUOTES[Math.floor(Math.random() * KNOCK_QUOTES.length)],
    );

    setIsShaking(true);
    window.setTimeout(() => setIsShaking(false), 220);

    setIsStriking(true);
    window.setTimeout(() => setIsStriking(false), 180);

    setDedoKey((k) => k + 1);
    setDedoVisible(true);
    window.setTimeout(() => setDedoVisible(false), 900);

    if (soundEnabled) playKnockSound();

    const milestone = MILESTONES.find((m) => m.count === nextPeace);
    if (milestone && !triggeredMilestones.has(milestone.count)) {
      setTriggeredMilestones((prev) => new Set(prev).add(milestone.count));
      setActiveMilestone(milestone);
    }
  };

  const closeMilestone = () => setActiveMilestone(null);

  const resetPeace = () => {
    setPeace(0);
    setKnockQuote(null);
    setTriggeredMilestones(new Set());
    setActiveMilestone(null);
  };

  return (
    <main className="min-h-screen w-full bg-[#F7F4EE] px-4 py-10 text-[#2F2F2F]">
      {activeMilestone && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2F2F2F]/40 p-4 backdrop-blur-sm"
          style={{ animation: "overlayFade 200ms ease-out" }}
          onClick={closeMilestone}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 text-center ${
              activeMilestone.grand ? "ring-2 ring-[#B8AEC7]/50" : ""
            }`}
            style={{
              animation: "milestoneIn 260ms ease-out",
              boxShadow: activeMilestone.grand
                ? "0 0 80px rgba(184,174,199,0.55)"
                : "0 0 48px rgba(184,174,199,0.35)",
            }}
          >
            <p className="text-xs tracking-[0.25em] text-[#9C9284] uppercase">
              敲擊里程碑・{activeMilestone.count} 下
            </p>
            <h3
              className={
                activeMilestone.grand
                  ? "text-2xl font-bold"
                  : "text-xl font-bold"
              }
            >
              {activeMilestone.title}
            </h3>
            {activeMilestone.titleSecondLine && (
              <p className="text-lg font-semibold text-[#7C6F92]">
                {activeMilestone.titleSecondLine}
              </p>
            )}
            <p className="text-sm leading-relaxed text-[#9C9284]">
              {activeMilestone.subtitle}
            </p>
            {activeMilestone.footnote && (
              <p className="text-xs text-[#B4ABBD]">
                {activeMilestone.footnote}
              </p>
            )}
            <button
              type="button"
              onClick={closeMilestone}
              className="mt-2 rounded-xl bg-[#B8AEC7] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#9C8FB3]"
            >
              繼續敲
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-md space-y-6">
        <header className="space-y-3 text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-[#9C9284] uppercase">
            Pause & Reset
          </p>
          <h1 className="text-2xl font-bold">情緒緩衝站</h1>
          <p className="text-sm text-[#9C9284]">
            有些情緒，不一定要立刻處理。先讓它停在這裡一下。
          </p>
          <p className="text-sm leading-relaxed text-[#9C9284]">
            工作裡總有一些讓人煩躁、無奈，或只是想暫時離開一下的時刻。抽一張籤，不一定能解決事情，但也許能讓心情先鬆一點。
          </p>
        </header>

        <section className="space-y-4 rounded-3xl bg-white p-6 text-center shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-bold">🎴 抽一籤，先停下來</h2>
            <p className="text-sm text-[#9C9284]">
              情緒上來的時候，不急著回應。先抽一句，讓心和腦袋都慢一點。
            </p>
          </div>

          <button
            type="button"
            onClick={draw}
            className="w-full rounded-xl bg-[#B8AEC7] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#9C8FB3]"
          >
            抽一籤
          </button>

          {drawnCard && (
            <div className="space-y-4 rounded-2xl border border-dashed border-[#B8AEC7]/50 bg-[#F4F1F7] p-8">
              <p className="text-xs tracking-[0.2em] text-[#9C9284] uppercase">
                今天的籤
              </p>
              <p className="text-xl leading-relaxed font-bold">{drawnCard}</p>

              <div className="space-y-1 pt-1">
                <p className="text-sm text-[#9C9284]">有好一點了嗎？</p>
                <p className="text-sm text-[#9C9284]">
                  如果還是很煩，也沒關係。有些事情，不是一句話就能放下。
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={scrollToFish}
                  className="w-full rounded-xl bg-[#B8AEC7] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#9C8FB3]"
                >
                  還是很煩，去敲一下木魚 →
                </button>
                <button
                  type="button"
                  onClick={draw}
                  className="text-sm text-[#9C9284] transition-colors hover:text-[#2F2F2F]"
                >
                  再抽一次
                </button>
              </div>
            </div>
          )}
        </section>

        <section
          ref={fishSectionRef}
          className="relative space-y-5 rounded-3xl bg-white p-6 text-center shadow-sm"
        >
          <style>{`
            @keyframes fishShake {
              0% { transform: scale(1) rotate(0deg); }
              25% { transform: scale(1.03) rotate(-2deg); }
              50% { transform: scale(0.98) rotate(2deg); }
              75% { transform: scale(1.02) rotate(-1deg); }
              100% { transform: scale(1) rotate(0deg); }
            }
            @keyframes floatFade {
              0% { transform: translateY(0); opacity: 1; }
              100% { transform: translateY(-28px); opacity: 0; }
            }
            @keyframes overlayFade {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            @keyframes milestoneIn {
              0% { opacity: 0; transform: scale(0.92) translateY(6px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>

          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-[#E3DED4] bg-white px-2.5 py-1 text-xs text-[#9C9284] transition-colors hover:text-[#2F2F2F]"
          >
            {soundEnabled ? <SpeakerOnIcon /> : <SpeakerMutedIcon />}
            {soundEnabled ? "開啟聲音" : "靜音"}
          </button>

          <div className="space-y-1">
            <h2 className="text-lg font-bold">🪵 讓前額葉回來上班</h2>
            <p className="text-sm text-[#9C9284]">
              有些事情不一定要想通。先把反應的權利，拿回自己手上。
            </p>
          </div>

          <div className="relative flex justify-center py-1">
            <button
              ref={fishAreaRef}
              type="button"
              onClick={knock}
              onMouseEnter={() => setIsHoveringFish(true)}
              onMouseLeave={() => setIsHoveringFish(false)}
              onMouseMove={handleFishMouseMove}
              aria-label="敲木魚"
              className="relative inline-block cursor-none"
            >
              <Image
                src="/quiet-card/wooden-fish.png"
                alt="木魚"
                width={FISH_IMAGE_SIZE.width}
                height={FISH_IMAGE_SIZE.height}
                draggable={false}
                priority
                style={{
                  animation: isShaking ? "fishShake 220ms ease-in-out" : "none",
                }}
              />

              {isHoveringFish && (
                <Image
                  src="/quiet-card/wooden-mallet.png"
                  alt=""
                  width={MALLET_IMAGE_SIZE.width}
                  height={MALLET_IMAGE_SIZE.height}
                  draggable={false}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-0"
                  style={{
                    transform: `translate(${malletPos.x - 30}px, ${
                      malletPos.y - 34
                    }px) ${isStriking ? "translate(10px, 8px) scale(0.94)" : ""}`,
                    transition: "transform 120ms ease-out",
                  }}
                />
              )}
            </button>

            {dedoVisible && (
              <span
                key={dedoKey}
                className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-[#B8AEC7]"
                style={{ animation: "floatFade 900ms ease-out forwards" }}
              >
                功德 +1
              </span>
            )}
          </div>

          <p className="text-sm font-medium text-[#2F2F2F]">
            今天已敲 {peace} 下。
          </p>

          {knockQuote && (
            <p className="text-sm text-[#7C6F92]">{knockQuote}</p>
          )}

          <p className="text-xs leading-relaxed text-[#9C9284]">
            每一聲，都不是為了原諒誰。只是提醒自己，別把情緒的方向盤交出去。
          </p>

          <button
            type="button"
            onClick={resetPeace}
            className="rounded-xl border border-[#E3DED4] bg-white px-4 py-2 text-sm text-[#9C9284] transition-colors hover:text-[#2F2F2F]"
          >
            重新開始
          </button>

          <div className="space-y-2 rounded-2xl bg-[#F4F1F7] p-5 text-left">
            <p className="text-sm font-semibold text-[#2F2F2F]">前額葉心經</p>
            <ul className="space-y-1.5 text-sm text-[#5B5468]">
              {SCRIPTURE_LINES.map((line) => (
                <li key={line}>「{line}」</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#2F2F2F]">
              把想留給自己的話，也放進來。
            </p>
            <p className="text-xs text-[#9C9284]">
              那些曾經安慰過你的話，也可以留給下一次的自己。
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addCustomCard();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newCardText}
              onChange={(e) => setNewCardText(e.target.value)}
              placeholder="寫下一句想提醒自己的話……"
              className="flex-1 rounded-xl border border-[#E3DED4] bg-white px-3 py-2 text-[#2F2F2F] focus:ring-2 focus:ring-[#B8AEC7] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#B8AEC7] px-4 py-2 font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#9C8FB3]"
            >
              收進籤筒
            </button>
          </form>

          {customCards.length > 0 && (
            <ul className="space-y-2">
              {customCards.map((card) => (
                <li
                  key={card.id}
                  className="rounded-xl bg-[#F7F4EE] p-3 text-left"
                >
                  {editingId === card.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full rounded-xl border border-[#E3DED4] bg-white px-3 py-2 text-[#2F2F2F] focus:ring-2 focus:ring-[#B8AEC7] focus:outline-none"
                      />
                      <div className="flex gap-3 text-sm">
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="text-[#7C6F92] hover:text-[#2F2F2F]"
                        >
                          儲存
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="text-[#9C9284] hover:text-[#2F2F2F]"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-[#2F2F2F]">{card.text}</p>
                      <div className="flex shrink-0 gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => startEdit(card)}
                          className="text-[#9C9284] hover:text-[#2F2F2F]"
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCustomCard(card.id)}
                          className="text-[#9C9284] hover:text-[#2F2F2F]"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
