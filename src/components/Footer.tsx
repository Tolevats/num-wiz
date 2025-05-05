import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-section contact-section">
        <div className="footer-cta">
          <h3 className="cta-heading magic-hover">Got Questions?</h3>
          <h4>Ask a Math Magician <span className="magic-text">(That's Us!)</span></h4>
          <button className="cta-button">contact@numwiz.com</button>
        </div>

        <div className="footer-section community-section">
          <h4 aria-label="Join our online community">Join the League of Num Wiz Kids!</h4>
          <div className="footer-column">
            <h4 className="community-link pulse-animation" >TikTok</h4>
            <p>
            {/* Add icon + anchor */}
            </p>
          </div>
          <div className="footer-column">
            <h4 className="community-link pulse-animation" >Twitch</h4>
            <p>
            {/* Add icon + anchor */}
            </p>
          </div>
          <div className="footer-column">
            <h4 className="community-link pulse-animation" >Discord</h4>
            <p>
            {/* Add icon + anchor */}
            </p>
          </div>
        </div>

        <div className="footer-section copyright-section">
          <p>© {currentYear} Num Wiz - Where Numbers Come to Play!</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
