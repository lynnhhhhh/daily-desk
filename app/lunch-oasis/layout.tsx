import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "午餐解憂所 Lunch Oasis",
  description: "今天的午餐，交給一點偶然。",
};

export default function LunchDrawLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
