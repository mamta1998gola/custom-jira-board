import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Item } from '../types';
import ItemCard from './ItemCard';

interface SortableItemCardProps {
  id: string;
  item: Item;
}

const SortableItemCard: React.FC<SortableItemCardProps> = ({ id, item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    marginBottom: '10px',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <ItemCard item={item} />
    </div>
  );
};

export default SortableItemCard;