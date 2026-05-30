import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tea Tea Note | 티티노트",
  description: "나만의 차 이야기를 기록하세요",
  metadataBase: new URL("https://teatinote.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSerifKr.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#FAFAF7" }}>
        {children}
      </body>
    </html>
  );
}
