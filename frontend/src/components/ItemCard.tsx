import React, { useState } from 'react';
import { Item } from '../types';
import ItemDetailsModal from './ItemDetailsModal';
import '../App.css';

interface ItemCardProps {
    item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
    const [showDetails, setShowDetails] = useState(false);

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

    const getTypeClass = (type: string) => {
        return `item-card ${type}`;
    };

    return (
        <>
            <div className={getTypeClass(item.item_type)} onClick={() => setShowDetails(true)}>
                <div className="card-header">
                    <span className="item-type">{getTypeIcon(item.item_type)}</span>
                    <span className="item-id">#{item.id}</span>
                </div>
                <h4 className="item-title">{item.title}</h4>
                {item.description && (
                    <p className="item-description">
                        {item.description.length > 60
                            ? `${item.description.substring(0, 60)}...`
                            : item.description}
                    </p>
                )}
            </div>

            {showDetails && (
                <ItemDetailsModal
                    item={item}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    );
};

export default ItemCard;
