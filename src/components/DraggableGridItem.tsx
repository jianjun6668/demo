/*
 * @Author: wangjj wangjj@ckt.cn
 * @Date: 2025-08-05 12:10:18
 * @LastEditors: wangjj wangjj@ckt.cn
 * @LastEditTime: 2025-08-06 10:22:38
 * @FilePath: \demo\src\components\DraggableGridItem.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DraggableGridItemProps, GridItem } from './types';

const DraggableGridItem: React.FC<DraggableGridItemProps> = ({ item, gridSize, gap }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    gridArea: `${item.y + 1} / ${item.x + 1} / ${item.y + item.row + 1} / ${item.x + item.col + 1}`,
    // 拖拽时应用transform，让元素跟随鼠标移动
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'all 0.3s ease',
    zIndex: isDragging ? 1000 : 1,
    opacity: 1,
  };

  const getItemClassName = (item: GridItem) => {
    const baseClass = `grid-item size-${item.col}x${item.row}`;
    return isDragging ? `${baseClass} dragging` : baseClass;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={getItemClassName(item)}
      {...attributes}
      {...listeners}
    >
      <div className="grid-item-content">
        <div className="drag-handle">⋮⋮</div>
        <h3>Item {item.id}</h3>
        <div className="position-info">
          ({item.x}, {item.y})
        </div>
      </div>
    </div>
  );
};

export default DraggableGridItem;