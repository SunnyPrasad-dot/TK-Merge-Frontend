import { useEffect, useState } from 'react';

const Header = ({ alwaysDark = false, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (event, target) => {
    event.preventDefault();
    setMenuOpen(false);
    onNavigate?.(target);
  };

  return (
    <header className={`header ${scrolled || menuOpen ? 'scrolled' : ''} ${alwaysDark ? 'always-dark' : ''}`}>
      <a href="/" className="logo" onClick={(event) => handleNavigate(event, 'home')}>TK MOMENTS</a>

      <nav id="primary-navigation" className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <a href="/" onClick={(event) => handleNavigate(event, 'home')}>Home</a>
        <a href="/wedding-stories" onClick={(event) => handleNavigate(event, 'wedding-stories')}>Wedding Stories</a>
        <a href="/wedding-films" onClick={(event) => handleNavigate(event, 'wedding-films')}>Wedding Films-shoot</a>
        <a href="/about" onClick={(event) => handleNavigate(event, 'about')}>About</a>
        <a href="/contact" onClick={(event) => handleNavigate(event, 'contact')}>Contact Us</a>
      </nav>

      <button
        type="button"
        className={`menu-btn ${menuOpen ? 'open' : ''}`}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
};

export default Header;
