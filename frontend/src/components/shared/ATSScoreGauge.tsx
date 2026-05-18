import React from 'react';

interface ATSScoreGaugeProps {
  score: number;
  grade?: string;
  size?: number;
  label?: string;
}

export const ATSScoreGauge: React.FC<ATSScoreGaugeProps> = ({
  score,
  grade = 'N/A',
  size = 140,
  label = 'ATS Score'
}) => {
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 80) return '#10b981'; // Emerald
    if (val >= 60) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90 overflow-visible">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={strokeWidth}
          />
          {/* Active Circle with Glowing Gradient */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out',
              filter: `drop-shadow(0 0 6px ${scoreColor}40)`
            }}
          />
        </svg>

        {/* Center Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">
            {label}
          </span>
          <span className="text-3xl font-black text-white leading-none mt-1">
            {score}%
          </span>
          {grade && (
            <span className="text-[10px] font-extrabold uppercase mt-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
              Grade: {grade}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
