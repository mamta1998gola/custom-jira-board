import React, { useState, useEffect } from 'react';
import { Item, Sprint } from '../types';
import { fetchBacklogItems, fetchSprints, createItem, updateItem, createSprint, activateSprint } from '../api';
import CreateItemModal from '../components/CreateItemModal';
import CreateSprintModal from '../components/CreateSprintModal';
import BacklogItem from '../components/BacklogItem';
import '../App.css';

const BacklogPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [showCreateItemModal, setShowCreateItemModal] = useState(false);
    const [showCreateSprintModal, setShowCreateSprintModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const [fetchedItems, fetchedSprints] = await Promise.all([
                fetchBacklogItems(),
                fetchSprints()
            ]);
            setItems(fetchedItems);
            setSprints(fetchedSprints);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateItem = async (newItem: Partial<Item>) => {
        try {
            await createItem(newItem);
            await loadData();
            setShowCreateItemModal(false);
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    const handleCreateSprint = async (newSprint: Partial<Sprint>) => {
        try {
            await createSprint(newSprint);
            await loadData();
            setShowCreateSprintModal(false);
        } catch (error) {
            console.error('Error creating sprint:', error);
        }
    };

    const handleMoveToSprint = async (itemId: number, sprintId: number) => {
        try {
            await updateItem(itemId, { sprint_id: sprintId, status: 'To Do' });
            await loadData();
        } catch (error) {
            console.error('Error moving item to sprint:', error);
        }
    };

    const handleActivateSprint = async (sprintId: number) => {
        try {
            await activateSprint(sprintId);
            await loadData();
        } catch (error) {
            console.error('Error activating sprint:', error);
        }
    };

    return (
        <div className="backlog-page">
            <div className="backlog-header">
                <h1>Backlog</h1>
                <div className="backlog-actions">
                    <button className="btn btn-primary" onClick={() => setShowCreateItemModal(true)}>
                        Create Item
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowCreateSprintModal(true)}>
                        Create Sprint
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="backlog-content">
                    <div className="sprints-section">
                        <h2>Sprints</h2>
                        {sprints.length === 0 ? (
                            <div className="no-sprints">No sprints created yet.</div>
                        ) : (
                            <ul className="sprint-list">
                                {sprints.map(sprint => (
                                    <li key={sprint.id} className={`sprint-item ${sprint.is_active ? 'active' : ''}`}>
                                        <div className="sprint-details">
                                            <span className="sprint-name">{sprint.name}</span>
                                            <span className="sprint-dates">
                                                {new Date(sprint.start_date).toLocaleDateString()} - {new Date(sprint.end_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {!sprint.is_active && !sprint.is_closed && (
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => handleActivateSprint(sprint.id)}
                                            >
                                                Activate
                                            </button>
                                        )}
                                        {sprint.is_active && <span className="active-tag">Active</span>}
                                        {sprint.is_closed && <span className="closed-tag">Closed</span>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="backlog-items-section">
                        <h2>Items</h2>
                        {items.length === 0 ? (
                            <div className="no-items">No backlog items created yet.</div>
                        ) : (
                            <div className="backlog-items">
                                {items.map(item => (
                                    <BacklogItem
                                        key={item.id}
                                        item={item}
                                        sprints={sprints.filter(s => !s.is_closed)}
                                        onMoveToSprint={handleMoveToSprint}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showCreateItemModal && (
                <CreateItemModal
                    onClose={() => setShowCreateItemModal(false)}
                    onCreateItem={handleCreateItem}
                />
            )}

            {showCreateSprintModal && (
                <CreateSprintModal
                    onClose={() => setShowCreateSprintModal(false)}
                    onCreateSprint={handleCreateSprint}
                />
            )}
        </div>
    );
};

export default BacklogPage;
