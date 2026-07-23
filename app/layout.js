import { Inter, Manrope } from "next/font/google";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { DesktopNav, MobileTabBar } from "@/components/NavBar";
import UserAvatar from "@/components/UserAvatar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata = {
  title: "MLO Prep — SAFE Exam Practice",
  description: "Practice questions and mock exams for the SAFE MLO licensing exam.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-[#f6f8fc] font-sans text-navy-900 antialiased">
        <header className="sticky top-0 z-20 border-b border-navy-100/70 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy-900 to-brand-600 text-white shadow-sm">
                <GraduationCap size={19} strokeWidth={2.25} />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-[15px] font-extrabold tracking-tight text-navy-900">
                  MLO Prep
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-500">
                  SAFE Exam Prep
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <DesktopNav />
              <UserAvatar />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 pb-24 pt-6 sm:px-6 sm:pb-10">
          {children}
          <p className="mx-auto mt-10 max-w-md text-center text-xs leading-relaxed text-navy-300">
            MLO Prep is an independent study tool and is not affiliated with, endorsed by, or
            sponsored by the Nationwide Multistate Licensing System (NMLS), the SAFE Mortgage
            Licensing Act, or any state regulatory agency. NMLS is a registered trademark of the
            State Regulatory Registry, LLC.
          </p>
          <p className="mx-auto mt-3 max-w-md text-center text-xs leading-relaxed text-navy-300">
            Practice questions, explanations, and flashcards on this site were developed with the
            assistance of AI and reviewed for accuracy against current regulatory sources. They
            are original study aids, not official exam questions, and are not guaranteed to match
            questions on the actual NMLS SAFE exam.
          </p>
          <p className="mx-auto mt-3 max-w-md text-center text-xs leading-relaxed text-navy-300">
            By using MLO Prep, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-navy-500">
              Terms of Service
            </Link>
            , which includes a binding arbitration agreement and class action waiver, and our{" "}
            <Link href="/privacy" className="underline hover:text-navy-500">
              Privacy Policy
            </Link>
            .
          </p>
        </main>

        <MobileTabBar />
      </body>
    </html>
  );
}
