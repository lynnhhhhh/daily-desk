import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "今日小清單 Today's Little List",
  description: "事情很多的時候，先把今天放得下的幾件事寫下來。",
};

export default function LittleListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
