import React, { useState } from 'react';
import { Item, Sprint } from '../types';
import ItemDetailsModal from './ItemDetailsModal';
import '../App.css';

interface BacklogItemProps {
item: Item;
sprints: Sprint[];
onMoveToSprint: (itemId: number, sprintId: number) => void;
}

const BacklogItem: React.FC<BacklogItemProps> = ({ item, sprints, onMoveToSprint }) => {
const [showDetails, setShowDetails] = useState(false);
const [showSprintDropdown, setShowSprintDropdown] = useState(false);

const getTypeIcon = (type: string) => {
switch (type) {
  case 'story':
    return '📝';
  case 'task':
    return '✅';
  case 'bug':
    return '🐞';
  default:
    return '📄';
}
};

return (
<div className="backlog-item">
  <div className="item-header" onClick={() => setShowDetails(true)}>
    <span className="item-type">{getTypeIcon(item.item_type)}</span>
    <h3 className="item-title">{item.title}</h3>
  </div>
  <div className="item-actions">
    <button 
      className="btn btn-sm"
      onClick={() => setShowSprintDropdown(!showSprintDropdown)}
    >
      Move to Sprint
    </button>
    
    {showSprintDropdown && (
      <div className="sprint-dropdown">
        {sprints.length === 0 ? (
          <div className="no-sprints">No active sprints</div>
        ) : (
          sprints.map(sprint => (
            <button 
              key={sprint.id}
              className="sprint-option"
              onClick={() => {
                onMoveToSprint(item.id, sprint.id);
                setShowSprintDropdown(false);
              }}
            >
              {sprint.name} {sprint.is_active ? '(Active)' : ''}
            </button>
          ))
        )}
      </div>
    )}
  </div>

  {showDetails && (
    <ItemDetailsModal 
      item={item}
      onClose={() => setShowDetails(false)}
    />
  )}
</div>
);
};

export default BacklogItem;
