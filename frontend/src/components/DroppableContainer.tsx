import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableItemCard from './SortableItemCard';
import { Item } from '../types';

interface DroppableContainerProps {
  id: string;
  title: string;
  items: {
    id: string;
    data: Item;
  }[];
}

const DroppableContainer: React.FC<DroppableContainerProps> = ({ id, title, items }) => {
  const { setNodeRef } = useDroppable({
    id
  });

  return (
    <div className="board-column">
      <h3 className="column-header">{title}</h3>
      <div 
        ref={setNodeRef}
        className="column-content"
        style={{ minHeight: '100px' }}
      >
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map(item => (
            <SortableItemCard 
              key={item.id}
              id={item.id}
              item={item.data}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default DroppableContainer;
