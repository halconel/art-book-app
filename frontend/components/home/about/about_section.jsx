import React from 'react';
import characterSrc from '../../../assets/images/character.png';

const InfoField = ({ label, value, subtitle }) => (
  <div className="info-field">
    <div className="field-label">{label}</div>
    <div className="field-value">{value}</div>
    {subtitle && <div className="field-subtitle">{subtitle}</div>}
  </div>
);

const AboutSection = () => {
  return (
    <div className="about-me-section">
      <div className="about-container">
        {/* Character Illustration */}
        <div className="character-illustration">
          <img
            src={characterSrc}
            alt="Character Illustration"
            className="character-image"
          />
        </div>

        {/* Info Card */}
        <div className="info-card">
          <div className="info-card-header">
            <h2>/ABOUT ME</h2>
          </div>

          <div className="info-fields-grid">
            {/* Left Column */}
            <div className="info-fields-left">
              <InfoField
                label="My name"
                value="ARTEM VINOGRADOV"
                subtitle="[nickname: Atom.Sergal]"
              />
              <InfoField label="Out there" value="RUSSIA/SAINT PETERSBURG" />
            </div>

            {/* Right Column */}
            <div className="info-fields-right">
              <InfoField label="DOB" value="01/06/2001" />
            </div>
          </div>

          <div className="info-separator" />

          {/* Content */}
          <div className="info-content">
            <p>
              I'm a concept artist and illustrator specializing in sci-fi
              environments, vehicles, and character design. My work focuses on
              creating immersive worlds that blend realistic details with
              fantastical elements.
            </p>

            <p>
              I draw inspiration from science fiction literature, films, and
              games to create artwork that tells stories about future worlds,
              alien landscapes, and the intersection of technology and nature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
