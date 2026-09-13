import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "情緒緩衝站 Pause & Reset",
  description: "有些情緒，不一定要立刻處理。先讓它停在這裡一下。",
};

export default function QuietCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
