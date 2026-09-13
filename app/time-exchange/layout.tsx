import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "時光兌換所 Time Exchange",
  description: "每一分鐘，都在把今天慢慢換成生活。",
};

export default function SalaryThiefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
