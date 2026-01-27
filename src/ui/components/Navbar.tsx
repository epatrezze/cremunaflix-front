import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/', label: 'Home' },
  { to: '/catalogo', label: 'Catalogo' },
  { to: '/sessoes', label: 'Sessoes' },
  { to: '/pedidos', label: 'Pedidos' }
];

const SCROLL_THRESHOLD = 32;

/**
 * Top navigation bar for primary routes.
 *
 * @returns Navbar with primary navigation links.
 */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY >= SCROLL_THRESHOLD;
      setIsScrolled((prev) => (prev === next ? prev : next));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`navbar flex items-center justify-between gap-6 px-[6vw] pt-6 pb-4 sticky top-0 z-20 ${
        isScrolled ? 'is-scrolled' : 'is-top'
      }`}
      data-scrolled={isScrolled ? 'true' : 'false'}
    >
      <div className="navbar-brand flex items-baseline gap-1 text-2xl font-semibold">
        <span className="navbar-logo">Cremuna</span>
        <span className="navbar-highlight">flix</span>
      </div>
      <nav className="navbar-links flex flex-wrap gap-3" aria-label="Navegacao principal">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''} px-4 py-2 rounded-full text-sm`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="navbar-actions">
        <ThemeToggle />
        <a className="button-ghost inline-flex items-center justify-center" href="#/pedidos">
          Quero sugerir
        </a>
      </div>
    </header>
  );
};

export default Navbar;
