"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/lib/site";

type SiteMobileMenuProps = {
  items: NavItem[];
};

export function SiteMobileMenu({ items }: SiteMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Close menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
      >
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
        <svg
          className="h-6 w-6 transition-opacity duration-200"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="absolute top-full left-0 right-0 origin-top border-b border-white/10 bg-[#0a2c52] text-[var(--color-cream)] shadow-lg"
          role="navigation"
        >
          <nav className="flex flex-col divide-y divide-white/10 py-2">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className="px-4 py-3 font-condensed text-sm font-bold uppercase tracking-[0.14em] text-white/80 transition-colors hover:bg-white/10 hover:text-[var(--color-gold)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
