"use client";

import { useState } from "react";
import { MenuIcon, PokeballIcon, XIcon } from "./Icons";

export default function Navbar({ activeTab = "Home", onSelectTab }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: "home", label: "Home" },
    { id: "collection", label: "My Pokémon" },
    { id: "history", label: "History" },
  ];

  const handleLinkClick = (label) => {
    if (onSelectTab) {
      onSelectTab(label);
    }
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="logo" aria-label="Pokédex home">
          <PokeballIcon />
          <span>
            Poké<span>dex</span>
          </span>
        </div>

        <button
          type="button"
          className="menu-button icon-button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>

        <nav
          className={`nav-links ${menuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              className={activeTab === link.label ? "active" : ""}
              onClick={() => handleLinkClick(link.label)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="nav-charm" aria-hidden="true">
          <PokeballIcon />
        </div>
      </div>
    </header>
  );
}
