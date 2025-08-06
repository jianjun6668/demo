export interface GridItem {
  id: number;
  col: number;
  row: number;
}

export interface LayoutItem extends GridItem {
  x: number;
  y: number;
}

export interface GridWaterfallLayoutProps {
  columns?: number;
  items?: GridItem[];
  gridSize?: number;
  gap?: number;
}

export interface DraggableGridItemProps {
  item: LayoutItem;
  gridSize: number;
  gap: number;
}