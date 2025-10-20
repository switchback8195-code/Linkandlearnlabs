import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/resources', label: 'Resources' },
    { path: '/dashboard', label: 'Dashboard' },
  ];

  const adminLink = { path: '/admin', label: 'Admin' };

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      background: 'var(--bg-page)', 
      borderBottom: '1px solid var(--border-medium)',
      padding: '20px 40px'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <div 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <h1 className="heading-5" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>LinkAndLearnLabs</h1>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.path}
              className="nav-link"
              onClick={() => navigate(link.path)}
              style={{
                color: location.pathname === link.path ? 'var(--brand-primary)' : 'var(--text-primary)',
                fontWeight: location.pathname === link.path ? 600 : 500,
                cursor: 'pointer'
              }}
            >
              {link.label}
            </a>
          ))}
          {isAuthenticated && (
            <a
              className="nav-link"
              onClick={() => navigate(adminLink.path)}
              style={{
                color: location.pathname === adminLink.path ? 'var(--brand-primary)' : 'var(--text-primary)',
                fontWeight: location.pathname === adminLink.path ? 600 : 500,
                cursor: 'pointer'
              }}
            >
              {adminLink.label}
            </a>
          )}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '16px' }}>
              {user?.picture && (
                <img 
                  src={user.picture} 
                  alt={user.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--brand-primary)' }}
                />
              )}
              <Button className="btn-secondary" onClick={logout} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          ) : (
            <Button className="btn-primary" style={{ marginLeft: '16px' }} onClick={login}>
              Sign In
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {mobileMenuOpen ? <X size={24} color="var(--text-primary)" /> : <Menu size={24} color="var(--text-primary)" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="mobile-nav" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          marginTop: '20px',
          padding: '20px',
          background: 'var(--bg-card)',
          borderRadius: '8px'
        }}>
          {navLinks.map((link) => (
            <a
              key={link.path}
              className="nav-link"
              onClick={() => {
                navigate(link.path);
                setMobileMenuOpen(false);
              }}
              style={{
                color: location.pathname === link.path ? 'var(--brand-primary)' : 'var(--text-primary)',
                fontWeight: location.pathname === link.path ? 600 : 500,
                cursor: 'pointer',
                padding: '12px 0'
              }}
            >
              {link.label}
            </a>
          ))}
          {isAuthenticated && (
            <a
              className="nav-link"
              onClick={() => {
                navigate(adminLink.path);
                setMobileMenuOpen(false);
              }}
              style={{
                color: location.pathname === adminLink.path ? 'var(--brand-primary)' : 'var(--text-primary)',
                fontWeight: location.pathname === adminLink.path ? 600 : 500,
                cursor: 'pointer',
                padding: '12px 0'
              }}
            >
              {adminLink.label}
            </a>
          )}
          {isAuthenticated ? (
            <Button className="btn-secondary" onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ width: '100%' }}>
              Logout
            </Button>
          ) : (
            <Button className="btn-primary" style={{ width: '100%' }} onClick={() => {
              login();
              setMobileMenuOpen(false);
            }}>
              Sign In
            </Button>
          )}
        </nav>
      )}

      <style>{`
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (min-width: 768px) {
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;