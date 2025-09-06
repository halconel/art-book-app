import React, { useState, useEffect } from 'react';
import logoSrc from '../../assets/images/favicon.svg';

const useIntroAnimation = images => {
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);
  const [animationStage, setAnimationStage] = useState(0); // 0: logo visible, 1: fade out, 2: scale up, 3: remove

  // Intro animation sequence
  useEffect(() => {
    if (!showIntroAnimation) return;
    if (!images || images.length === 0) return;

    const animationTimeline = [
      { stage: 1, delay: 2000 },
      { stage: 2, delay: 3000 },
      { stage: 3, delay: 5000 },
    ];

    const timers = animationTimeline.map(({ stage, delay }) =>
      setTimeout(() => {
        setAnimationStage(stage);
        if (stage === 3) {
          setTimeout(() => {
            setShowIntroAnimation(false);
          }, 1000);
        }
      }, delay)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [showIntroAnimation, images]);

  return { showIntroAnimation, animationStage };
};

const IntroAnimation = ({ images }) => {
  const { showIntroAnimation, animationStage } = useIntroAnimation(images);

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

  if (!showIntroAnimation) {
    return null;
  }

  return (
    <div className="intro-intro-animation-overlay">
      <img src={logoSrc} alt="Logo" className={getLogoClassName()} />
    </div>
  );
};

export default IntroAnimation;
