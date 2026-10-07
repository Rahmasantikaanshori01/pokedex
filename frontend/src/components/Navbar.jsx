"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MenuIcon,
  PokeballIcon,
  XIcon,
} from "./Icons";

export default function Navbar({
  activeTab = "Home",
  onSelectTab,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    {
      id: "home",
      label: "Home",
      href: "/",
    },
    {
      id: "collection",
      label: "My Pokémon",
      href: "/my-pokemon",
    },
    {
      id: "history",
      label: "History",
      href: "/history",
    },
  ];

  const isActive = (link) => {
    if (link.href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(link.href);
  };

  const handleLinkClick = (label) => {
    if (onSelectTab) {
      onSelectTab(label);
    }

    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <Link
          href="/"
          className="logo"
          aria-label="Pokédex home"
          onClick={() => setMenuOpen(false)}
        >
          <PokeballIcon />

          <span>
            Poké<span>dex</span>
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="menu-button icon-button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>

        {/* Navigation */}
        <nav
          className={`nav-links ${menuOpen ? "is-open" : ""
            }`}
          aria-label="Main navigation"
        >
          {links.map((link) => {
            const active =
              isActive(link) ||
              (!pathname &&
                activeTab === link.label);

            return (
              <Link
                key={link.id}
                href={link.href}
                className={active ? "active" : ""}
                onClick={() =>
                  handleLinkClick(link.label)
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Decorative Pokéball */}
        <div
          className="nav-charm"
          aria-hidden="true"
        >
          <PokeballIcon />
        </div>
      </div>
    </header>
  );
}