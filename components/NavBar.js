"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Layers, CalendarCheck, Bookmark, TrendingUp } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/exam", label: "Mock Exam", icon: Clock },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/study-plan", label: "Study Plan", icon: CalendarCheck },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/progress", label: "Progress", icon: TrendingUp },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav className="no-scrollbar hidden items-center gap-1 overflow-x-auto sm:flex">
      {NAV_LINKS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition ${
              active
                ? "bg-navy-900 text-white shadow-sm"
                : "text-navy-600 hover:bg-navy-50 hover:text-navy-900"
            }`}
          >
            <Icon size={16} strokeWidth={2.25} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-between border-t border-navy-100 bg-white/95 px-1 backdrop-blur sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV_LINKS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition ${
              active ? "text-brand-600" : "text-navy-400"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
