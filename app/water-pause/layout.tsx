import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "補水休息站 Hydration Break",
  description: "忙碌的日子裡，也記得留一杯水的時間給自己。",
};

export default function WaterPauseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
