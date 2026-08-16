import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import PrimaryButtonLink from "./PrimaryButtonLink";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Past Projects", to: "/our-work" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header-inner shell">
        <NavLink
          className="brand-mark"
          to="/"
          aria-label="D's Powerwashing home"
          onClick={closeMenu}
        >
          <img src="/ds-powerwashing-logo.jpg" alt="D's Powerwashing logo" />
        </NavLink>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>

        <div
          className={isMenuOpen ? "header-actions is-open" : "header-actions"}
        >
          <nav className="site-nav" id="primary-navigation" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "site-nav-link is-active" : "site-nav-link"
                }
                end={item.to === "/"}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <PrimaryButtonLink to="/contact" onClick={closeMenu}>
            Book A Cleaning Now
          </PrimaryButtonLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
