import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { Item, Sprint } from '../types';
import { fetchActiveSprint, fetchSprintItems, updateItem, closeSprint, createSprint } from '../api';
import ItemCard from '../components/ItemCard';
import SprintCloseModal from '../components/SprintCloseModal';
import DroppableContainer from '../components/DroppableContainer';
import '../App.css';

const ActiveSprintPage: React.FC = () => {
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [items, setItems] = useState<{
    'To Do': Item[];
    'In Progress': Item[];
    'Done': Item[];
  }>({
    'To Do': [],
    'In Progress': [],
    'Done': [],
  });
  const [loading, setLoading] = useState(true);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  // Set up sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const sprint = await fetchActiveSprint();
      setActiveSprint(sprint);

      if (sprint) {
        const sprintItems = await fetchSprintItems(sprint.id);
        const categorizedItems = {
          'To Do': sprintItems.filter(item => item.status === 'To Do'),
          'In Progress': sprintItems.filter(item => item.status === 'In Progress'),
          'Done': sprintItems.filter(item => item.status === 'Done'),
        };
        setItems(categorizedItems);
      } else {
        setItems({ 'To Do': [], 'In Progress': [], 'Done': [] });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id.toString();
    
    // Find the active item
    for (const [container, containerItems] of Object.entries(items)) {
      const item = containerItems.find(item => `item-${item.id}` === id);
      if (item) {
        setActiveItem(item);
        break;
      }
    }
    
    setActiveId(id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setActiveItem(null);
    
    if (!over) return;
    
    const activeId = active.id.toString();
    const overId = over.id.toString();
    
    // If dropping on a container
    if (overId === 'To Do' || overId === 'In Progress' || overId === 'Done') {
      const itemId = parseInt(activeId.split('-')[1]);
      
      // Find the container and item
      let sourceContainer: string | null = null;
      let sourceIndex = -1;
      
      for (const [container, containerItems] of Object.entries(items)) {
        const index = containerItems.findIndex(item => `item-${item.id}` === activeId);
        if (index !== -1) {
          sourceContainer = container;
          sourceIndex = index;
          break;
        }
      }
      
      if (sourceContainer === null || sourceIndex === -1) return;
      
      const destinationContainer = overId;
      
      // If the container hasn't changed, do nothing
      if (sourceContainer === destinationContainer) return;
      
      // Create new arrays
      const sourceItems = [...items[sourceContainer as keyof typeof items]];
      const destinationItems = [...items[destinationContainer as keyof typeof items]];
      
      // Remove from source
      const [movedItem] = sourceItems.splice(sourceIndex, 1);
      
      // Add to destination with updated status
      const updatedItem = { ...movedItem, status: destinationContainer };
      destinationItems.push(updatedItem);
      
      // Update state
      setItems({
        ...items,
        [sourceContainer]: sourceItems,
        [destinationContainer]: destinationItems
      });
      
      // Update in the backend
      try {
        await updateItem(itemId, { status: destinationContainer });
        console.log(`Updated item ${itemId} to ${destinationContainer}`);
      } catch (error) {
        console.error('Error updating item status:', error);
        await loadData();
      }
    }
  };

  const handleCloseSprint = async (createNewSprint: boolean) => {
    if (!activeSprint) return;

    try {
      if (createNewSprint) {
        await closeSprint(activeSprint.id);
      } else {
        const newSprint = await createSprint();
        await closeSprint(activeSprint.id, newSprint.id);
      }
      await loadData();
      setShowCloseModal(false);
    } catch (error) {
      console.error('Error closing sprint:', error);
    }
  };

  return (
    <div className="active-sprint-page">
      <div className="active-sprint-header">
        <h1>Active Sprint</h1>
        {activeSprint && (
          <div className="sprint-info">
            <h2>{activeSprint.name}</h2>
            <span className="sprint-dates">
              {new Date(activeSprint.start_date).toLocaleDateString()} - {new Date(activeSprint.end_date).toLocaleDateString()}
            </span>
            <button className="btn btn-danger" onClick={() => setShowCloseModal(true)}>
              Close Sprint
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : !activeSprint ? (
        <div className="no-active-sprint">
          <p>No active sprint. Please activate a sprint from the Backlog page.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="board-container">
            {Object.entries(items).map(([columnId, columnItems]) => (
              <DroppableContainer
                key={columnId}
                id={columnId}
                title={columnId}
                items={columnItems.map(item => ({
                  id: `item-${item.id}`,
                  data: item
                }))}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeId && activeItem ? (
              <div className="item-overlay">
                <ItemCard item={activeItem} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {showCloseModal && activeSprint && (
        <SprintCloseModal
          sprint={activeSprint}
          onClose={() => setShowCloseModal(false)}
          onCloseSprint={handleCloseSprint}
        />
      )}
    </div>
  );
};

export default ActiveSprintPage;