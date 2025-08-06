import React from 'react';
import { GridWaterfallLayout } from './components';
import './App.css';

function App() {
  // 示例数据 - 随机大小顺序排列，展示智能空隙填充
  const sampleItems = [
    { id: 1, col: 1, row: 1 },
    { id: 2, col: 4, row: 2 },
    { id: 3, col: 1, row: 1 },
    { id: 4, col: 2, row: 2 },
    { id: 5, col: 1, row: 1 },
    { id: 6, col: 1, row: 1 },
    { id: 7, col: 4, row: 2 },
    { id: 8, col: 1, row: 1 },
    { id: 9, col: 2, row: 2 },
    { id: 10, col: 1, row: 1 },
    { id: 11, col: 1, row: 1 },
    { id: 12, col: 2, row: 2 },
    { id: 13, col: 1, row: 1 },
    { id: 14, col: 4, row: 2 },
    { id: 15, col: 1, row: 1 },
    { id: 16, col: 1, row: 1 },
    { id: 17, col: 2, row: 2 },
    { id: 18, col: 1, row: 1 },
    { id: 19, col: 1, row: 1 },
    { id: 20, col: 1, row: 1 },
    { id: 21, col: 1, row: 1 },
    { id: 22, col: 1, row: 1 },
    { id: 23, col: 1, row: 1 },
    { id: 24, col: 1, row: 1 },
    { id: 25, col: 1, row: 1 }
  ];

  return (
    <div className="App">
      <GridWaterfallLayout
        columns={10}
        items={sampleItems}
        gridSize={50}
        gap={6}
      />
    </div>
  );
}

export default App;
