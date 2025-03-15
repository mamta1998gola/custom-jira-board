import React, { useState } from 'react';
import { Item } from '../types';
import '../App.css';

interface CreateItemModalProps {
    onClose: () => void;
    onCreateItem: (item: Partial<Item>) => void;
}

const CreateItemModal: React.FC<CreateItemModalProps> = ({ onClose, onCreateItem }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [itemType, setItemType] = useState<'story' | 'task' | 'bug'>('story');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateItem({
            title,
            description,
            item_type: itemType,
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Create New Item</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="item-type">Type</label>
                        <select
                            id="item-type"
                            value={itemType}
                            onChange={(e) => setItemType(e.target.value as 'story' | 'task' | 'bug')}
                            required
                        >
                            <option value="story">Story</option>
                            <option value="task">Task</option>
                            <option value="bug">Bug</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="item-title">Title</label>
                        <input
                            id="item-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="item-description">Description</label>
                        <textarea
                            id="item-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateItemModal;
