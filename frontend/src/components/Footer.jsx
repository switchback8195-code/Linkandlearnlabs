import React from 'react';
import { Github, Twitter, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      background: 'var(--bg-card)', 
      borderTop: '1px solid var(--border-medium)',
      padding: '40px 40px 20px'
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* About */}
          <div>
            <h3 className="heading-6" style={{ color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase' }}>LinkAndLearnLabs</h3>
            <p className="body-small" style={{ marginBottom: '16px' }}>An inclusive community for learning about computers, building gaming rigs, and all tech subjects.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }} className="social-link">
                <Github size={20} />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }} className="social-link">
                <Twitter size={20} />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }} className="social-link">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="heading-6" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="/resources" className="link-text" style={{ fontSize: '0.9rem' }}>Recommended Tools</a>
              <a href="/resources" className="link-text" style={{ fontSize: '0.9rem' }}>Video Tutorials</a>
              <a href="/#learning-paths" className="link-text" style={{ fontSize: '0.9rem' }}>Learning Paths</a>
              <a href="/" className="link-text" style={{ fontSize: '0.9rem' }}>Community Forum</a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="heading-6" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" className="link-text" style={{ fontSize: '0.9rem' }}>Getting Started Guide</a>
              <a href="#" className="link-text" style={{ fontSize: '0.9rem' }}>PC Building Basics</a>
              <a href="#" className="link-text" style={{ fontSize: '0.9rem' }}>Component Compatibility</a>
              <a href="#" className="link-text" style={{ fontSize: '0.9rem' }}>Troubleshooting</a>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="heading-6" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Community</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" className="link-text" style={{ fontSize: '0.9rem' }}>Code of Conduct</a>
              <a href="#" className="link-text" style={{ fontSize: '0.9rem' }}>Member Showcase</a>
              <a href="#" className="link-text" style={{ fontSize: '0.9rem' }}>Support</a>
              <a href="#" className="link-text" style={{ fontSize: '0.9rem' }}>Contact Us</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ 
          borderTop: '1px solid var(--border-medium)', 
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <p className="caption" style={{ color: 'var(--text-muted)' }}>
            © 2025 LinkAndLearnLabs. All rights reserved. Built with passion for the PC building community.
          </p>
        </div>
      </div>

      <style>{`
        .social-link:hover {
          color: var(--brand-primary) !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;