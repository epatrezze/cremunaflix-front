import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/catalogo', label: 'Catalogo' },
  { to: '/sessoes', label: 'Sessoes' },
  { to: '/pedidos', label: 'Pedidos' }
];

/**
 * Top navigation bar for primary routes.
 *
 * @returns Navbar with primary navigation links.
 */
const Navbar = () => (
  <header className="navbar">
    <div className="navbar-brand">
      <span className="navbar-logo">Cremuna</span>
      <span className="navbar-highlight">flix</span>
    </div>
    <nav className="navbar-links" aria-label="Navegacao principal">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) =>
            isActive ? 'navbar-link active' : 'navbar-link'
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
    <a className="button-ghost" href="#/pedidos">
      Quero sugerir
    </a>
  </header>
);

export default Navbar;
