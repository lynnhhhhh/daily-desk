import Link from "next/link";

type ToolIconType = "time" | "water" | "lunch" | "card" | "list";

type Tool = {
  href: string;
  nameEn: string;
  nameZh: string;
  subtitle: string;
  description: string;
  color: string;
  icon: ToolIconType;
  featured?: boolean;
};

const TOOLS: Tool[] = [
  {
    href: "/time-exchange",
    nameEn: "Time Exchange",
    nameZh: "時光兌換所",
    subtitle: "時間變現：",
    description: "累的時候看一眼，今天的時間已經換了多少薪水。",
    color: "#7F9B87",
    icon: "time",
    featured: true,
  },
  {
    href: "/water-pause",
    nameEn: "Hydration Break",
    nameZh: "補水休息站",
    subtitle: "補水時間：",
    description: "工作先放一下，喝口水再繼續。",
    color: "#AFC8D8",
    icon: "water",
  },
  {
    href: "/lunch-oasis",
    nameEn: "Lunch Oasis",
    nameZh: "午餐解憂所",
    subtitle: "每日難題：",
    description: "不知道午餐吃什麼？按一下，今天交給命運。",
    color: "#E9C46A",
    icon: "lunch",
  },
  {
    href: "/quiet-card",
    nameEn: "Pause & Reset",
    nameZh: "情緒緩衝站",
    subtitle: "抽離一下：",
    description: "有些話現在不要說，為了你的前額葉，先點進來一下。",
    color: "#B8AEC7",
    icon: "card",
  },
  {
    href: "/little-list",
    nameEn: "Today's Little List",
    nameZh: "今日小清單",
    subtitle: "為了五斗米：",
    description: "把今天要完成的事寫下來，一件一件做完吧。",
    color: "#E6A57E",
    icon: "list",
    featured: true,
  },
];

function ToolIcon({ type, color }: { type: ToolIconType; color: string }) {
  switch (type) {
    case "time":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" fill="none" />
          <path
            d="M12 7v5l3.5 2"
            stroke={color}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "water":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3C12 3 6 10.5 6 15a6 6 0 0 0 12 0c0-4.5-6-12-6-12Z"
            stroke={color}
            strokeWidth="1.6"
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "lunch":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="4" stroke={color} strokeWidth="1.6" fill="none" />
          <circle cx="8.5" cy="8.5" r="1.1" fill={color} />
          <circle cx="15.5" cy="15.5" r="1.1" fill={color} />
          <circle cx="12" cy="12" r="1.1" fill={color} />
        </svg>
      );
    case "card":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="3" width="16" height="18" rx="3" stroke={color} strokeWidth="1.6" fill="none" />
          <line x1="8" y1="9" x2="16" y2="9" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
          <line x1="8" y1="13" x2="14" y2="13" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "list":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="4" stroke={color} strokeWidth="1.6" fill="none" />
          <path
            d="M8 12.5l2.5 2.5L16 9"
            stroke={color}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

const NAV_LINKS = [{ href: "/", label: "首頁" }, ...TOOLS.map((t) => ({ href: t.href, label: t.nameZh }))];

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F7F4EE] text-[#2F2F2F]">
      <header className="border-b border-[#E3DED4]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
          <Link href="/" className="text-base font-bold tracking-wide">
            Daily Desk
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6B6558]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[#2F2F2F]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl space-y-4 px-4 pt-16 pb-8 text-center sm:px-6 sm:pt-20 sm:pb-10">
          <p className="text-xs font-medium tracking-[0.25em] text-[#9C9284] uppercase">
            Daily Desk｜上班族的日常小角落
          </p>
          <h1 className="text-3xl leading-snug font-bold sm:text-4xl">
            今天需要哪一個？
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[#6B6558]">
            累了、渴了、餓了、煩了，或只是有事得做。
          </p>
          <p className="text-sm text-[#9C9284]">
            不催你更有效率，只陪你把今天好好過完。
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <div className="flex flex-wrap justify-center gap-6">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group flex w-full shrink-0 flex-col rounded-3xl bg-white p-6 transition-shadow hover:shadow-md sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] ${
                  tool.featured ? "shadow-md" : "shadow-sm"
                }`}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${tool.color}26` }}
                >
                  <ToolIcon type={tool.icon} color={tool.color} />
                </div>
                <p className="text-xs font-medium tracking-wide text-[#9C9284] uppercase">
                  {tool.nameEn}
                </p>
                <h2 className="mt-1 text-xl font-bold">{tool.nameZh}</h2>
                <p
                  className="mt-2 text-sm font-semibold"
                  style={{ color: tool.color }}
                >
                  {tool.subtitle}
                </p>
                <p className="mt-1 flex-1 text-[15px] leading-relaxed text-[#6B6558]">
                  {tool.description}
                </p>
                <span
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                  style={{ color: tool.color }}
                >
                  進入工具
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E3DED4] py-10 text-center">
        <p className="text-sm font-semibold tracking-wide">Daily Desk</p>
        <p className="mt-1 text-sm text-[#9C9284]">
          一個陪你從上班到下班的小地方。
        </p>
        <p className="mt-4 text-xs text-[#B7AFA2]">今天辛苦了。</p>
      </footer>
    </div>
  );
}
