import React from 'react';

interface GridControlsProps {
  showGrid: boolean;
  onToggleGrid: () => void;
  columns: number;
  itemCount: number;
}

const GridControls: React.FC<GridControlsProps> = ({
  showGrid,
  onToggleGrid,
  columns,
  itemCount
}) => {
  return (
    <div className="controls">
      <div className="drag-instructions">
        <span className="drag-icon">🖱️</span>
        <span>拖拽任意组件来改变排列顺序</span>
      </div>
      <button 
        onClick={onToggleGrid} 
        className={`grid-btn ${showGrid ? 'active' : ''}`}
      >
        {showGrid ? '🔳 隐藏网格' : '🔲 显示网格'}
      </button>
      <div className="info">
        <span>列数: {columns} | 组件数量: {itemCount}</span>
      </div>
    </div>
  );
};

export default GridControls;