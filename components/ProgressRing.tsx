
import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 to 100
}

const ProgressRing: React.FC<ProgressRingProps> = ({ progress }) => {
  const radius = 120;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
      <circle
        stroke="rgba(255, 255, 255, 0.2)"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="url(#gradient)"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, strokeLinecap: 'round' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className="transition-all duration-300 ease-linear"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34c759" />
          <stop offset="100%" stopColor="#007aff" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ProgressRing;
