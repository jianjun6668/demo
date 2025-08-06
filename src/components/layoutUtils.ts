import { GridItem, LayoutItem } from './types';

// 检查指定位置是否可以放置组件
export const canPlaceAt = (
  x: number, 
  y: number, 
  item: GridItem, 
  occupiedGrid: boolean[][],
  columns: number
) => {
  // 检查边界
  if (x + item.col > columns || y < 0) return false;
  
  // 检查该区域是否被占用
  for (let row = y; row < y + item.row; row++) {
    for (let col = x; col < x + item.col; col++) {
      if (occupiedGrid[row] && occupiedGrid[row][col]) {
        return false;
      }
    }
  }
  return true;
};

// 在网格中标记占用区域
export const markOccupied = (
  x: number, 
  y: number, 
  item: GridItem, 
  occupiedGrid: boolean[][],
  columns: number
) => {
  for (let row = y; row < y + item.row; row++) {
    if (!occupiedGrid[row]) {
      occupiedGrid[row] = new Array(columns).fill(false);
    }
    for (let col = x; col < x + item.col; col++) {
      occupiedGrid[row][col] = true;
    }
  }
};

// 寻找最佳放置位置（考虑空隙填充）
export const findBestPositionInGrid = (
  item: GridItem, 
  occupiedGrid: boolean[][],
  columns: number
) => {
  // 计算当前网格的最大高度
  const maxHeight = Math.max(occupiedGrid.length, 20); // 至少20行高度
  
  // 从上到下、从左到右扫描寻找可放置的位置
  for (let y = 0; y < maxHeight; y++) {
    for (let x = 0; x <= columns - item.col; x++) {
      if (canPlaceAt(x, y, item, occupiedGrid, columns)) {
        // 找到第一个可放置的位置就是最佳位置（最上面、最左边）
        return { x, y };
      }
    }
  }

  return null;
};

// 寻找最佳放置位置（带空隙检测）
export const findBestPositionWithGapFilling = (
  item: GridItem, 
  occupiedGrid: boolean[][],
  columns: number
) => {
  const maxHeight = Math.max(occupiedGrid.length, 20);
  
  // 对于小组件(1x1)，优先填充空隙
  if (item.col === 1 && item.row === 1) {
    // 扫描已有内容区域寻找空隙
    for (let y = 0; y < Math.min(maxHeight, 10); y++) { // 限制在前10行寻找空隙
      for (let x = 0; x <= columns - item.col; x++) {
        if (canPlaceAt(x, y, item, occupiedGrid, columns)) {
          return { x, y };
        }
      }
    }
  }
  
  // 对于大组件或找不到空隙的小组件，使用普通布局
  return findBestPositionInGrid(item, occupiedGrid, columns);
};

// 优化的瀑布流布局算法 - 保持随机顺序但智能填充
export const calculateLayout = (items: GridItem[], columns: number): LayoutItem[] => {
  // 保持原始顺序，不进行大小排序
  const itemsToPlace = [...items];
  const occupiedGrid: boolean[][] = [];
  const newLayoutItems: LayoutItem[] = [];

  // 第一轮：按原始顺序放置所有组件
  itemsToPlace.forEach(item => {
    const position = findBestPositionInGrid(item, occupiedGrid, columns);
    
    if (position) {
      const layoutItem: LayoutItem = {
        ...item,
        x: position.x,
        y: position.y
      };
      
      newLayoutItems.push(layoutItem);
      markOccupied(position.x, position.y, item, occupiedGrid, columns);
    }
  });

  // 第二轮：智能重排小组件填充空隙
  const smallItems = newLayoutItems.filter(item => item.col * item.row === 1);
  
  // 随机打乱小组件处理顺序
  const shuffledSmallItems = [...smallItems].sort(() => Math.random() - 0.5);
  
  shuffledSmallItems.forEach(item => {
    // 清除当前位置
    for (let row = item.y; row < item.y + item.row; row++) {
      for (let col = item.x; col < item.x + item.col; col++) {
        if (occupiedGrid[row]) {
          occupiedGrid[row][col] = false;
        }
      }
    }
    
    // 寻找更好的位置（优先填充空隙）
    const newPosition = findBestPositionWithGapFilling(item, occupiedGrid, columns);
    if (newPosition) {
      item.x = newPosition.x;
      item.y = newPosition.y;
      markOccupied(newPosition.x, newPosition.y, item, occupiedGrid, columns);
    } else {
      // 如果找不到位置，恢复原位置
      markOccupied(item.x, item.y, item, occupiedGrid, columns);
    }
  });

  return newLayoutItems;
};