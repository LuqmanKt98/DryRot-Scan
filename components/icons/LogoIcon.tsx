import React from 'react';

const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="DRS Logo"
  >
    <circle cx="60" cy="60" r="58" fill="#1b263b" />
    <circle cx="60" cy="60" r="48" fill="none" stroke="#f97316" strokeWidth="10" />
    <text
      x="50%"
      y="50%"
      dy=".35em"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
      fontSize="52"
      fontWeight="bold"
      fill="#ffffff"
      stroke="#0d1b2a"
      strokeWidth="10"
      strokeLinejoin="round"
    >
      DRS
    </text>
    <text
      x="50%"
      y="50%"
      dy=".35em"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
      fontSize="52"
      fontWeight="bold"
      fill="#ffffff"
      stroke="#f97316"
      strokeWidth="3"
    >
      DRS
    </text>
  </svg>
);

export default LogoIcon;