import React from 'react';
import { Link } from 'react-router-dom';
import scanningSvg from '../../../assets/images/footer.png';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="waved-background" />
      <div className="footer-container">
        <div className="footer-left">
          <div className="social-section">
            <h3>/SOCIAL</h3>
            <div className="social-links">
              <button type="button" className="social-link">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="social-icon"
                >
                  <path
                    d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 6L8 8.5 4.5 6h7z"
                    fill="currentColor"
                  />
                </svg>
                ARTSTATION
              </button>
              <button type="button" className="social-link">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="social-icon"
                >
                  <path
                    d="M8 0L6.59 1.41l2.75 2.75H0v2h9.34l-2.75 2.75L8 10l5-5-5-5z"
                    fill="currentColor"
                  />
                </svg>
                YOUTUBE
              </button>
              <button type="button" className="social-link">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="social-icon"
                >
                  <path
                    d="M13.545 2.907a4.13 4.13 0 00-.832-.634c-.39-.198-.8-.336-1.22-.408A6.27 6.27 0 008 2a6.27 6.27 0 00-3.493.865c-.42.072-.83.21-1.22.408a4.13 4.13 0 00-.832.634 4.13 4.13 0 00-.634.832c-.198.39-.336.8-.408 1.22A6.27 6.27 0 001 8c0 1.24.224 2.466.635 3.632.072.42.21.83.408 1.22.136.315.315.594.832.634.39.198.8.336 1.22.408A6.27 6.27 0 008 14a6.27 6.27 0 003.493-.865c.42-.072.83-.21 1.22-.408.315-.136.594-.315.832-.634.198-.39.336-.8.408-1.22A6.27 6.27 0 0015 8a6.27 6.27 0 00-.865-3.493c-.072-.42-.21-.83-.408-1.22a4.13 4.13 0 00-.832-.634z"
                    fill="currentColor"
                  />
                </svg>
                DISCORD
              </button>
              <button type="button" className="social-link">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="social-icon"
                >
                  <path
                    d="M16 8A8 8 0 110 8a8 8 0 0116 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.296-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 01-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 00-.013-.315.337.337 0 00-.114-.217.526.526 0 00-.31-.093c-.3.005-.763.166-2.984 1.09z"
                    fill="currentColor"
                  />
                </svg>
                TELEGRAM
              </button>
              <button type="button" className="social-link">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="social-icon"
                >
                  <path
                    d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0016 3.542a6.658 6.658 0 01-1.889.518 3.301 3.301 0 001.447-1.817 6.533 6.533 0 01-2.087.793A3.286 3.286 0 007.875 6.03a9.325 9.325 0 01-6.767-3.429 3.289 3.289 0 001.018 4.382A3.323 3.323 0 01.64 6.575v.045a3.288 3.288 0 002.632 3.218 3.203 3.203 0 01-.865.115 3.23 3.23 0 01-.614-.057 3.283 3.283 0 003.067 2.277A6.588 6.588 0 01.78 13.58a6.32 6.32 0 01-.78-.045A9.344 9.344 0 005.026 15z"
                    fill="currentColor"
                  />
                </svg>
                TWITTER
              </button>
              <button type="button" className="social-link">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="social-icon"
                >
                  <path
                    d="M15.545 6.558a9.42 9.42 0 01.139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 118 0a7.689 7.689 0 015.352 2.082l-2.284 2.284A4.347 4.347 0 008 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 000 3.063c.632 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 001.599-2.431H8v-3.08h7.545z"
                    fill="currentColor"
                  />
                </svg>
                VK
              </button>
            </div>
          </div>

          <div className="nav-section">
            <h3>/NAV</h3>
            <div className="nav-buttons">
              <Link to="/" className="nav-button active">
                HOME
              </Link>
              <Link to="/resume" className="nav-button">
                CURRICULUM VITAE
              </Link>
              <Link to="/gallery" className="nav-button">
                ART GALLERY
              </Link>
              <Link to="/projects" className="nav-button">
                PROJECTS
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-right">
          <div className="scanning-svg">
            <img src={scanningSvg} alt="Scanning" className="scanning-image" />
          </div>

          <div className="footer-logo">
            <div className="logo-text">ATOM.SERGAL</div>
            <div className="logo-tagline">CONCEPT ART</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
