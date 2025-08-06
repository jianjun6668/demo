import React, { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import { GridItem, LayoutItem, GridWaterfallLayoutProps } from './types';
import { calculateLayout } from './layoutUtils';
import DraggableGridItem from './DraggableGridItem';
import GridControls from './GridControls';
import GridLines from './GridLines';
import './GridWaterfallLayout.css';

const GridWaterfallLayout: React.FC<GridWaterfallLayoutProps> = ({
  columns = 10,
  items = [],
  gridSize = 50,
  gap = 4
}) => {
  // 默认示例数据
  const defaultItems: GridItem[] = [
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
    { id: 11, col: 4, row: 2 },
    { id: 12, col: 1, row: 1 }
  ];

  const [currentItems, setCurrentItems] = useState<GridItem[]>(
    items.length > 0 ? items : defaultItems
  );
  const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([]);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  // 拖拽传感器配置
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 需要拖拽8px才激活
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 容器样式
  const containerStyle = useMemo(() => {
    const containerWidth = columns * (gridSize + gap) - gap;
    return {
      width: `${containerWidth}px`,
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, ${gridSize}px)`,
      gridAutoRows: `${gridSize}px`,
      gap: `${gap}px`,
      position: 'relative' as const
    };
  }, [columns, gridSize, gap]);

  // 拖拽开始事件
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  // 拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = currentItems.findIndex((item) => item.id === active.id);
      const newIndex = currentItems.findIndex((item) => item.id === over?.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(currentItems, oldIndex, newIndex);
        setCurrentItems(newItems);
      }
    }
    
    // 最后设置activeId为null，这会触发useEffect重新计算布局
    setActiveId(null);
  };

  // 当items或columns变化时重新计算布局（拖拽过程中不计算）
  useEffect(() => {
    // 如果正在拖拽，不重新计算布局
    if (activeId !== null) return;
    
    const newLayoutItems = calculateLayout(currentItems, columns);
    setLayoutItems(newLayoutItems);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItems, columns, activeId]);

  // 容器高度计算 - CSS Grid 会自动处理高度
  const containerHeight = useMemo(() => {
    if (layoutItems.length === 0) return 0;
    const maxY = Math.max(...layoutItems.map(item => item.y + item.row));
    return maxY * (gridSize + gap) - gap;
  }, [layoutItems, gridSize, gap]);

  // 切换网格显示
  const handleToggleGrid = () => {
    setShowGrid(!showGrid);
  };

  return (
    <div className="grid-waterfall-container">
      <GridControls
        showGrid={showGrid}
        onToggleGrid={handleToggleGrid}
        columns={columns}
        itemCount={currentItems.length}
      />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={layoutItems.map(item => item.id)} 
          strategy={rectSortingStrategy}
        >
          <div 
            className="grid-container" 
            style={containerStyle}
          >
            <GridLines
              showGrid={showGrid}
              columns={columns}
              gridSize={gridSize}
              gap={gap}
              containerHeight={containerHeight}
            />
            {layoutItems.map(item => (
              <DraggableGridItem
                key={item.id}
                item={item}
                gridSize={gridSize}
                gap={gap}
              />
            ))}
          </div>
        </SortableContext>
        
        {/* 原始元素已经跟随鼠标，不需要DragOverlay */}
      </DndContext>
    </div>
  );
};

export default GridWaterfallLayout;