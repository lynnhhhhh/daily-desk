"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const QUICK_ADD_AMOUNTS = [250, 500];

export default function WaterPausePage() {
  const [goal, setGoal] = useState("2000");
  const [myCup, setMyCup] = useState("300");
  const [entries, setEntries] = useState<number[]>([]);
  const [customAmount, setCustomAmount] = useState("");
  const [customError, setCustomError] = useState(false);

  const myCupNumber = useMemo(() => {
    const parsed = myCup === "" ? 0 : Number(myCup);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [myCup]);

  const quickAmounts = useMemo(() => {
    const amounts = new Set(QUICK_ADD_AMOUNTS);
    if (myCupNumber > 0) amounts.add(myCupNumber);
    return Array.from(amounts).sort((a, b) => a - b);
  }, [myCupNumber]);

  const consumed = useMemo(
    () => entries.reduce((sum, amount) => sum + amount, 0),
    [entries],
  );

  const goalNumber = useMemo(() => {
    const parsed = goal === "" ? 0 : Number(goal);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [goal]);

  const progress = goalNumber > 0 ? consumed / goalNumber : 0;
  const remaining = Math.max(goalNumber - consumed, 0);

  const message = useMemo(() => {
    if (consumed <= 0) return "今天的第一杯水，也是一個好好照顧自己的開始。";
    if (progress < 0.25) return "今天的第一杯水，也是一個好好照顧自己的開始。";
    if (progress < 0.75) return "慢慢來，一杯一杯，也正在靠近今天的目標。";
    if (progress < 1) return "今天的水分差不多補齊了，再為自己留一小杯。";
    return "今天的水喝夠了。謝謝你，也有記得照顧自己。";
  }, [consumed, progress]);

  const addWater = (amount: number) => {
    setEntries((prev) => [...prev, amount]);
  };

  const undoLast = () => {
    setEntries((prev) => prev.slice(0, -1));
  };

  const resetToday = () => {
    setEntries([]);
  };

  const addCustomAmount = () => {
    const amount = Number(customAmount);
    if (customAmount.trim() === "" || Number.isNaN(amount) || amount <= 0) {
      setCustomError(true);
      return;
    }
    addWater(amount);
    setCustomAmount("");
    setCustomError(false);
  };

  return (
    <main className="min-h-screen w-full bg-[#F7F4EE] px-4 py-10 text-[#2F2F2F]">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[#AFC8D8] transition-colors hover:text-[#93AFC0]"
          >
            ← 回到 Daily Desk
          </Link>
        </div>

        <header className="space-y-3 text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-[#9C9284] uppercase">
            Hydration Break
          </p>
          <h1 className="text-2xl font-bold">補水休息站</h1>
          <p className="text-sm leading-relaxed text-[#9C9284]">
            忙碌的日子裡，也記得留一杯水的時間給自己。
          </p>
        </header>

        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <label className="block">
            <span className="text-sm text-[#9C9284]">今日喝水目標（ml）</span>
            <input
              type="number"
              min={0}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E3DED4] bg-white px-3 py-2 text-[#2F2F2F] focus:ring-2 focus:ring-[#AFC8D8] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm text-[#9C9284]">我的杯子（ml）</span>
            <p className="mt-1 mb-2 text-xs text-[#9C9284]">
              把平常最常用的杯子記下來，之後每一杯，只要輕輕按一下。
            </p>
            <input
              type="number"
              min={0}
              placeholder="例如 300"
              value={myCup}
              onChange={(e) => setMyCup(e.target.value)}
              className="w-full rounded-xl border border-[#E3DED4] bg-white px-3 py-2 text-[#2F2F2F] focus:ring-2 focus:ring-[#AFC8D8] focus:outline-none"
            />
          </label>
        </section>

        <section className="space-y-5 rounded-3xl bg-white p-6 text-center shadow-sm">
          <div>
            <p className="text-sm text-[#9C9284]">今天已喝</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight">
              {consumed.toLocaleString("zh-TW")} ml
            </p>
            <p className="mt-1 text-sm text-[#9C9284]">
              今天已完成 {(Math.max(progress, 0) * 100).toFixed(1)}%
            </p>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-[#E7EEF1]">
            <div
              className="h-full rounded-full bg-[#AFC8D8] transition-all duration-700 ease-out"
              style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl bg-[#F7F4EE] p-3">
              <p className="text-xs text-[#9C9284]">今日喝水目標</p>
              <p className="mt-1 font-semibold">{goalNumber.toLocaleString("zh-TW")} ml</p>
            </div>
            <div className="rounded-2xl bg-[#F7F4EE] p-3">
              <p className="text-xs text-[#9C9284]">還差多少達成目標</p>
              <p className="mt-1 font-semibold">
                {remaining <= 0 ? "已經達成了" : `${remaining.toLocaleString("zh-TW")} ml`}
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-[#5C7A8A]">{message}</p>

          <div className="space-y-2 text-left">
            <p className="text-sm text-[#9C9284]">記下一杯</p>
            <div className="flex flex-wrap gap-3">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => addWater(amount)}
                  className="min-w-[30%] flex-1 rounded-xl bg-[#AFC8D8] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#93AFC0]"
                >
                  + {amount} ml
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addCustomAmount();
            }}
            className="space-y-2 text-left"
          >
            <label className="block">
              <span className="text-sm text-[#9C9284]">這一杯有多少？</span>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                <input
                  type="number"
                  min={0}
                  placeholder="例如 350 ml"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    if (customError) setCustomError(false);
                  }}
                  className="w-full min-w-0 rounded-xl border border-[#E3DED4] bg-white px-3 py-2 text-[#2F2F2F] focus:ring-2 focus:ring-[#AFC8D8] focus:outline-none sm:flex-1"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#AFC8D8] px-4 py-2 font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#93AFC0] sm:w-auto"
                >
                  記下這一杯
                </button>
              </div>
            </label>
            {customError && (
              <p className="text-xs text-[#9C9284]">先告訴我這一杯有多少水。</p>
            )}
          </form>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={undoLast}
              disabled={entries.length === 0}
              className="rounded-xl border border-[#E3DED4] bg-white px-4 py-2 text-sm text-[#9C9284] transition-colors hover:text-[#2F2F2F] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-[#9C9284]"
            >
              撤回上一杯
            </button>
            <button
              type="button"
              onClick={resetToday}
              className="rounded-xl border border-[#E3DED4] bg-white px-4 py-2 text-sm text-[#9C9284] transition-colors hover:text-[#2F2F2F]"
            >
              重新開始今天
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
