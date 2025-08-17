import React from 'react';
import logoSrc from '../../assets/images/favicon.svg';

const IntroAnimation = ({ animationStage }) => {
  const getLogoClassName = () => {
    const baseClass = 'intro-logo';
    switch (animationStage) {
      case 0:
        return `${baseClass} intro-logo-visible`;
      case 1:
        return `${baseClass} intro-logo-fade`;
      case 2:
        return `${baseClass} intro-logo-scale`;
      case 3:
        return `${baseClass} intro-logo-remove`;
      default:
        return baseClass;
    }
  };

  return (
    <div className="intro-intro-animation-overlay">
      <img src={logoSrc} alt="Logo" className={getLogoClassName()} />
    </div>
  );
};

export default IntroAnimation;
