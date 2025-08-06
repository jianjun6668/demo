import React from 'react';

interface GridLinesProps {
  showGrid: boolean;
  columns: number;
  gridSize: number;
  gap: number;
  containerHeight: number;
}

const GridLines: React.FC<GridLinesProps> = ({
  showGrid,
  columns,
  gridSize,
  gap,
  containerHeight
}) => {
  if (!showGrid) return null;
  
  const lines = [];
  const maxHeight = containerHeight || 500;
  
  // 垂直线
  for (let i = 0; i <= columns; i++) {
    const x = i * (gridSize + gap) - gap / 2;
    lines.push(
      <div
        key={`v-${i}`}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: 0,
          width: '1px',
          height: `${maxHeight}px`,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
    );
  }
  
  // 水平线
  const rows = Math.ceil(maxHeight / (gridSize + gap));
  for (let i = 0; i <= rows; i++) {
    const y = i * (gridSize + gap) - gap / 2;
    lines.push(
      <div
        key={`h-${i}`}
        style={{
          position: 'absolute',
          left: 0,
          top: `${y}px`,
          width: '100%',
          height: '1px',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
    );
  }
  
  return <>{lines}</>;
};

export default GridLines;