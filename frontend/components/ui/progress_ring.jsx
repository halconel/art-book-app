import React from 'react';

const ProgressRing = ({ progress = 0, size = 45, strokeWidth = 3 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <svg className="progress-ring" width={size} height={size}>
      <circle
        className="progress-ring-circle-bg"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="progress-ring-circle"
        stroke="#FE4A56"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: `${size / 2}px ${size / 2}px`,
          transition: 'stroke-dashoffset 0.05s linear',
        }}
      />
    </svg>
  );
};

export default ProgressRing;
