import React from "react";
import "./Footer.css";
import { FaTiktok, FaTwitch, FaDiscord } from "react-icons/fa6";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-section">
        <div className="community-section">
          <h4 className="community-cta text-xs md:text-base lg:text-lg" aria-label="Join our online community">Join the League of NumWiz kids!</h4>
          <div className="community-link">
            <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="TikTok"
            className="text-gray-500 hover:text-primary dark:hover:text-primary-light transition-colors pulse-animation"
          >
            <FaTiktok className="h-6 w-6 md:h-12 md:w-12 lg:h-18 lg:w-18"/>
          </a>
          </div>
          <div className="community-link">
            <a
            href="https://www.twitch.tv/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Twitch"
            className="text-gray-500 hover:text-primary dark:hover:text-primary-light transition-colors pulse-animation"
          >
            <FaTwitch className="h-6 w-6 md:h-12 md:w-12 lg:h-18 lg:w-18"/>
          </a>
          </div>
          <div className="community-link">
            <a
            href="https://discord.com/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Discord"
            className="text-gray-500 hover:text-primary dark:hover:text-primary-light transition-colors pulse-animation"
          >
            <FaDiscord className="h-6 w-6 md:h-12 md:w-12 lg:h-18 lg:w-18"/>
          </a>
          </div>
        </div>
        <div className="contact-section">
          <h5 className="contact-cta">
            Got questions? Ask a math magician <span className="magic-hover magic-text">(That's us!)</span>
          </h5>
          <button className="contact-btn">contact@numwiz.com</button>
        </div>
        <div className="bottom-section">
          <p className="text-sm copyright-line">{currentYear} Num Wiz © - Where Numbers Come to Play!</p>
          <p className="text-xs author-line">Made with 💚 by @Tolevats</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
