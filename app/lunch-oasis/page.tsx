"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const SAMPLE_OPTIONS =
  "八方雲集\n摩斯漢堡\nSUBWAY\n便當\n自助餐\n麵店\n健康餐盒\n便利商店";

export default function LunchDrawPage() {
  const [optionsText, setOptionsText] = useState(SAMPLE_OPTIONS);
  const [result, setResult] = useState<string | null>(null);
  const [notEnough, setNotEnough] = useState(false);

  const options = useMemo(
    () =>
      optionsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [optionsText],
  );

  const draw = () => {
    if (options.length < 2) {
      setNotEnough(true);
      return;
    }
    setNotEnough(false);
    const picked = options[Math.floor(Math.random() * options.length)];
    setResult(picked);
  };

  return (
    <main className="min-h-screen w-full bg-[#F7F4EE] px-4 py-10 text-[#2F2F2F]">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[#E9C46A] transition-colors hover:text-[#C6A75A]"
          >
            ← 回到 Daily Desk
          </Link>
        </div>

        <header className="space-y-3 text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-[#9C9284] uppercase">
            Lunch Oasis
          </p>
          <h1 className="text-2xl font-bold">午餐解憂所</h1>
          <p className="text-sm text-[#9C9284]">今天的午餐，交給一點偶然。</p>
          <p className="text-sm leading-relaxed text-[#9C9284]">
            每天到了中午，最難回答的問題，常常不是工作，而是今天要吃什麼。想不到的時候，就讓一點偶然替你做決定。
          </p>
        </header>

        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <label className="block">
            <span className="text-sm text-[#9C9284]">今天考慮的午餐（一行一個）</span>
            <textarea
              value={optionsText}
              onChange={(e) => {
                setOptionsText(e.target.value);
                if (notEnough) setNotEnough(false);
              }}
              rows={7}
              className="mt-1 w-full resize-none rounded-xl border border-[#E3DED4] bg-white px-3 py-2 leading-relaxed text-[#2F2F2F] focus:ring-2 focus:ring-[#E9C46A] focus:outline-none"
            />
          </label>

          <button
            type="button"
            onClick={draw}
            className="w-full rounded-xl bg-[#E9C46A] px-4 py-3 font-semibold text-[#2F2F2F] transition-colors hover:bg-[#C6A75A]"
          >
            替今天抽一籤
          </button>

          {notEnough && (
            <p className="text-center text-xs text-[#9C9284]">
              再多留一個選擇給今天吧。
            </p>
          )}
        </section>

        {result && (
          <section className="space-y-4 rounded-3xl border border-dashed border-[#E9C46A]/50 bg-[#FBF3DF] p-8 text-center shadow-sm">
            <p className="text-xs tracking-[0.2em] text-[#9C9284] uppercase">
              今天的籤
            </p>
            <p className="text-2xl font-bold">今天，就吃{result}吧。</p>
            <p className="text-sm text-[#9C9284]">有些選擇，不必想得太久。</p>
            <button
              type="button"
              onClick={draw}
              className="rounded-xl border border-[#E3DED4] bg-white px-4 py-2 text-sm text-[#9C9284] transition-colors hover:text-[#2F2F2F]"
            >
              再抽一次
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
