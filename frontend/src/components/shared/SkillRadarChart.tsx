import React from 'react';

interface SkillRadarChartProps {
  categories?: string[];
  currentScores?: number[];
  targetScores?: number[];
  size?: number;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  categories = ['Programming', 'SysDesign', 'Database', 'Cloud', 'Comm'],
  currentScores = [60, 45, 55, 30, 75],
  targetScores = [90, 80, 85, 75, 80],
  size = 300
}) => {
  const center = size / 2;
  const rMax = size * 0.35;
  const numPoints = categories.length;

  const polarToCartesian = (angleIndex: number, value: number) => {
    const angle = (Math.PI * 2 * angleIndex) / numPoints - Math.PI / 2;
    const radius = (value / 100) * rMax;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Build grid concentric polygons (25, 50, 75, 100)
  const gridPolys = [25, 50, 75, 100].map((level) => {
    const points = Array.from({ length: numPoints })
      .map((_, i) => {
        const pt = polarToCartesian(i, level);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');
    return (
      <polygon
        key={level}
        points={points}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />
    );
  });

  // Build Axis Lines
  const axisLines = Array.from({ length: numPoints }).map((_, i) => {
    const outerPt = polarToCartesian(i, 100);
    return (
      <line
        key={i}
        x1={center}
        y1={center}
        x2={outerPt.x}
        y2={outerPt.y}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.5"
      />
    );
  });

  // Target Polygon
  const targetPoints = targetScores
    .map((val, i) => {
      const pt = polarToCartesian(i, val);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  // Current Polygon
  const currentPoints = currentScores
    .map((val, i) => {
      const pt = polarToCartesian(i, val);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  // Category Text Labels
  const labels = categories.map((cat, i) => {
    const pt = polarToCartesian(i, 115);
    const isLeft = pt.x < center;
    const isCenter = Math.abs(pt.x - center) < 10;
    const textAnchor = isCenter ? 'middle' : isLeft ? 'end' : 'start';

    return (
      <text
        key={i}
        x={pt.x}
        y={pt.y + 4}
        fill="#94a3b8"
        fontSize="9"
        fontWeight="bold"
        textAnchor={textAnchor}
      >
        {cat}
      </text>
    );
  });

  return (
    <div className="w-full flex justify-center py-4 bg-slate-900/10 rounded-2xl border border-white/5 relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* Outer Glow */}
        <circle cx={center} cy={center} r={rMax} fill="url(#radarGlow)" />

        {/* concentric circles / axis */}
        {gridPolys}
        {axisLines}

        {/* Target Poly (Emerald) */}
        <polygon
          points={targetPoints}
          fill="rgba(16, 185, 129, 0.06)"
          stroke="#10b981"
          strokeWidth="2"
        />

        {/* Current Poly (Rose) */}
        <polygon
          points={currentPoints}
          fill="rgba(244, 63, 94, 0.05)"
          stroke="#f43f5e"
          strokeWidth="2"
        />

        {/* Axis Labels */}
        {labels}

        {/* Target Nodes */}
        {targetScores.map((val, i) => {
          const pt = polarToCartesian(i, val);
          return <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#10b981" stroke="#fff" strokeWidth="1" />;
        })}

        {/* Current Nodes */}
        {currentScores.map((val, i) => {
          const pt = polarToCartesian(i, val);
          return <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#f43f5e" stroke="#fff" strokeWidth="1" />;
        })}
      </svg>
    </div>
  );
};
