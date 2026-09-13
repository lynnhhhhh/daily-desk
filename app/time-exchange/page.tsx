"use client";

import { useEffect, useMemo, useState } from "react";

const REMINDER_WINDOW_MS = 30 * 60 * 1000;

function parseTimeOnDate(time: string, base: Date): Date | null {
  if (!time) return null;
  const [hoursStr, minutesStr] = time.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  const d = new Date(base);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

// Native <input type="time"> renders its visible text using the browser/OS
// locale (e.g. "01:30 PM"), even though its underlying value is always
// 24-hour "HH:mm". To guarantee a fixed 24-hour display, time fields are
// plain text inputs that self-format digits as the user types.
function formatTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function overlapMs(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
}

function formatDuration(ms: number): string {
  const totalMinutes = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h} 小時 ${m} 分`;
}

type Status =
  | "unset"
  | "before"
  | "morning"
  | "pre-break"
  | "break"
  | "afternoon"
  | "pre-end"
  | "after";

export default function SalaryThiefPage() {
  const [monthlySalary, setMonthlySalary] = useState("30000");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:30");
  const [breakStart, setBreakStart] = useState("12:00");
  const [breakEnd, setBreakEnd] = useState("13:30");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { status, progress, earned, remainingMs, workedMs } = useMemo(() => {
    const start = parseTimeOnDate(startTime, now);
    let end = parseTimeOnDate(endTime, now);

    if (!start || !end) {
      return {
        status: "unset" as Status,
        progress: 0,
        earned: 0,
        remainingMs: 0,
        workedMs: 0,
      };
    }

    if (end.getTime() <= start.getTime()) {
      end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    }

    const startMs = start.getTime();
    const endMs = end.getTime();
    const nowMs = now.getTime();

    const breakStartDate = parseTimeOnDate(breakStart, now);
    const breakEndDate = parseTimeOnDate(breakEnd, now);
    const hasBreak = Boolean(breakStart && breakEnd && breakStartDate && breakEndDate);

    let breakStartMs = 0;
    let breakEndMs = 0;
    if (hasBreak && breakStartDate && breakEndDate) {
      breakStartMs = Math.min(Math.max(breakStartDate.getTime(), startMs), endMs);
      breakEndMs = Math.min(Math.max(breakEndDate.getTime(), startMs), endMs);
      if (breakEndMs < breakStartMs) breakEndMs = breakStartMs;
    }
    const breakMs = hasBreak ? breakEndMs - breakStartMs : 0;

    const totalWorkMs = Math.max(0, endMs - startMs - breakMs);

    const preEndStartMs = endMs - REMINDER_WINDOW_MS;
    const preBreakStartMs = breakStartMs - REMINDER_WINDOW_MS;

    let status: Status;
    if (nowMs < startMs) {
      status = "before";
    } else if (nowMs >= endMs) {
      status = "after";
    } else if (hasBreak && nowMs >= breakStartMs && nowMs < breakEndMs) {
      status = "break";
    } else if (nowMs >= preEndStartMs) {
      status = "pre-end";
    } else if (hasBreak && nowMs >= preBreakStartMs && nowMs < breakStartMs) {
      status = "pre-break";
    } else if (hasBreak && nowMs >= breakEndMs) {
      status = "afternoon";
    } else {
      status = "morning";
    }

    const rawElapsedMs = Math.min(Math.max(nowMs - startMs, 0), endMs - startMs);
    const elapsedBreakMs = hasBreak
      ? overlapMs(startMs, startMs + rawElapsedMs, breakStartMs, breakEndMs)
      : 0;
    const workedMs = Math.max(0, rawElapsedMs - elapsedBreakMs);

    const remainingMs = Math.min(Math.max(endMs - nowMs, 0), endMs - startMs);

    const progress = totalWorkMs > 0 ? workedMs / totalWorkMs : 0;
    const salaryNumber = monthlySalary === "" ? 0 : Number(monthlySalary);
    const dailySalary = Number.isNaN(salaryNumber) ? 0 : salaryNumber / 30;

    return {
      status,
      progress,
      earned: dailySalary * Math.min(progress, 1),
      remainingMs,
      workedMs,
    };
  }, [monthlySalary, startTime, endTime, breakStart, breakEnd, now]);

  const message = useMemo(() => {
    switch (status) {
      case "unset":
        return "先填上今天的時間，我們再一起看看今天走到哪裡。";
      case "before":
        return "一天還沒開始，先把一點安靜留給自己。";
      case "morning":
        return "今天正在慢慢往前走，不必急著一次完成所有事。";
      case "pre-break":
        return "上午快走到尾聲了，把手邊的事情慢慢收好，準備休息一下。";
      case "break":
        return "午間留白。工作先放一放，好好吃頓飯。";
      case "afternoon":
        return "午後繼續前行，也別忘了偶爾讓自己鬆一口氣。";
      case "pre-end":
        return "今天快走到尾聲了，把手邊的事情慢慢收好，準備回到自己的時間。";
      case "after":
        return "今天就到這裡。辛苦了一天，剩下的時間還給自己。";
      default:
        return "";
    }
  }, [status]);

  return (
    <main className="min-h-screen w-full bg-[#F7F4EE] px-4 py-10 text-[#2F2F2F]">
      <div className="mx-auto w-full max-w-md space-y-6">
        <header className="space-y-3 text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-[#9C9284] uppercase">
            Time Exchange
          </p>
          <h1 className="text-2xl font-bold">時光兌換所</h1>
          <p className="text-sm text-[#9C9284]">
            每一分鐘，都在把今天慢慢換成生活。
          </p>
          <p className="text-sm leading-relaxed text-[#9C9284]">
            上班的時間有時走得很慢，但那些看似平凡的片刻，也正一點一點累積成今天的所得。看看現在走到哪裡，也提醒自己，在忙碌裡留一點空白。
          </p>
        </header>

        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <label className="block">
            <span className="text-sm text-[#9C9284]">月薪（元）</span>
            <input
              type="number"
              min={0}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E3DED4] bg-white px-3 py-2 text-[#2F2F2F] focus:ring-2 focus:ring-[#7F9B87] focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-[#9C9284]">上班時間</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="HH:mm"
                maxLength={5}
                pattern="^([01]\d|2[0-3]):[0-5]\d$"
                value={startTime}
                onChange={(e) => setStartTime(formatTimeInput(e.target.value))}
                className="mt-1 w-full rounded-xl border border-[#E3DED4] bg-white px-3 py-2 tabular-nums text-[#2F2F2F] focus:ring-2 focus:ring-[#7F9B87] focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-sm text-[#9C9284]">下班時間</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="HH:mm"
                maxLength={5}
                pattern="^([01]\d|2[0-3]):[0-5]\d$"
                value={endTime}
                onChange={(e) => setEndTime(formatTimeInput(e.target.value))}
                className="mt-1 w-full rounded-xl border border-[#E3DED4] bg-white px-3 py-2 tabular-nums text-[#2F2F2F] focus:ring-2 focus:ring-[#7F9B87] focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-[#9C9284]">午休開始時間</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="HH:mm"
                maxLength={5}
                pattern="^([01]\d|2[0-3]):[0-5]\d$"
                value={breakStart}
                onChange={(e) => setBreakStart(formatTimeInput(e.target.value))}
                className="mt-1 w-full rounded-xl border border-[#E3DED4] bg-white px-3 py-2 tabular-nums text-[#2F2F2F] focus:ring-2 focus:ring-[#7F9B87] focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-sm text-[#9C9284]">午休結束時間</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="HH:mm"
                maxLength={5}
                pattern="^([01]\d|2[0-3]):[0-5]\d$"
                value={breakEnd}
                onChange={(e) => setBreakEnd(formatTimeInput(e.target.value))}
                className="mt-1 w-full rounded-xl border border-[#E3DED4] bg-white px-3 py-2 tabular-nums text-[#2F2F2F] focus:ring-2 focus:ring-[#7F9B87] focus:outline-none"
              />
            </label>
          </div>
        </section>

        <section className="space-y-5 rounded-3xl bg-white p-6 text-center shadow-sm">
          <div>
            <p className="text-sm text-[#9C9284]">今天已累積</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight">
              NT${" "}
              {earned.toLocaleString("zh-TW", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-[#EDE9DE]">
              <div
                className="h-full rounded-full bg-[#7F9B87] transition-all duration-700 ease-out"
                style={{ width: `${Math.min(progress, 1) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[#9C9284]">
              今天走到這裡 {(Math.min(progress, 1) * 100).toFixed(1)}%
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl bg-[#F7F4EE] p-3">
              <p className="text-xs text-[#9C9284]">已走過的工作時光</p>
              <p className="mt-1 font-semibold">{formatDuration(workedMs)}</p>
            </div>
            <div className="rounded-2xl bg-[#F7F4EE] p-3">
              <p className="text-xs text-[#9C9284]">離自己的時間還有</p>
              <p className="mt-1 font-semibold">
                {status === "after"
                  ? "已回到自己的時間"
                  : status === "unset"
                    ? "—"
                    : formatDuration(remainingMs)}
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-[#7F9B87]">{message}</p>
        </section>

        <footer>
          <p className="text-center text-xs text-[#9C9284]">
            ※ 每日所得以「月薪 ÷
            30」簡單估算，這裡只是陪你看看一天走了多遠，實際薪資仍以個人薪資制度為準。
          </p>
        </footer>
      </div>
    </main>
  );
}
