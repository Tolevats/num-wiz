import React from "react";
import "./Footer.css";
import { FaTiktok, FaTwitch, FaDiscord } from "react-icons/fa6";

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
          <h4 className="text-xs md:text-base lg:text-lg" aria-label="Join our online community">Join the League of Num Wiz Kids!</h4>
          <div className="footer-column">
            <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="TikTok"
            className="text-gray-500 hover:text-primary dark:hover:text-primary-light transition-colors community-link pulse-animation"
          >
            <FaTiktok className="h-6 w-6 md:h-12 md:w-12 lg:h-18 lg:w-18"/>
          </a>
          </div>
          <div className="footer-column">
            <a
            href="https://www.twitch.tv/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Twitch"
            className="text-gray-500 hover:text-primary dark:hover:text-primary-light transition-colors community-link pulse-animation"
          >
            <FaTwitch className="h-6 w-6 md:h-12 md:w-12 lg:h-18 lg:w-18"/>
          </a>
          </div>
          <div className="footer-column">
            <a
            href="https://discord.com/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Discord"
            className="text-gray-500 hover:text-primary dark:hover:text-primary-light transition-colors community-link pulse-animation"
          >
            <FaDiscord className="h-6 w-6 md:h-12 md:w-12 lg:h-18 lg:w-18"/>
          </a>
          </div>
        </div>

        <div className="footer-section">
          <p className="text-sm copyright-line">{currentYear} Num Wiz © - Where Numbers Come to Play!</p>
          <p className="text-xs author-line text-gray-500 mt-1">Made with 💚 by @Tolevats</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
