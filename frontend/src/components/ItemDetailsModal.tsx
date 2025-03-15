import React, { useState, useEffect } from 'react';
import { Item, Comment } from '../types';
import { fetchItem, updateItem, addComment } from '../api';
import '../App.css';

interface ItemDetailsModalProps {
    item: Item;
    onClose: () => void;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item: initialItem, onClose }) => {
    const [item, setItem] = useState<Item>(initialItem);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(initialItem.title);
    const [description, setDescription] = useState(initialItem.description || '');
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadItemDetails = async () => {
            try {
                setLoading(true);
                const fetchedItem = await fetchItem(initialItem.id);
                setItem(fetchedItem);
                setTitle(fetchedItem.title);
                setDescription(fetchedItem.description || '');
            } catch (error) {
                console.error('Error loading item details:', error);
            } finally {
                setLoading(false);
            }
        };

        loadItemDetails();
    }, [initialItem.id]);

    const handleSaveChanges = async () => {
        try {
            await updateItem(item.id, { title, description });
            const updatedItem = await fetchItem(item.id);
            setItem(updatedItem);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            await addComment({
                item_id: item.id,
                content: newComment
            });

            const updatedItem = await fetchItem(item.id);
            setItem(updatedItem);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

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
        <div className="modal-overlay">
            <div className="modal item-details-modal">
                <div className="modal-header">
                    <div className="item-details-title">
                        <span className="item-type-icon">{getTypeIcon(item.item_type)}</span>
                        <h2>{isEditing ? 'Edit Item' : `${item.item_type.charAt(0).toUpperCase() + item.item_type.slice(1)} #${item.id}`}</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="item-details-content">
                        {isEditing ? (
                            <div className="edit-form">
                                <div className="form-group">
                                    <label htmlFor="edit-title">Title</label>
                                    <input
                                        id="edit-title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-description">Description</label>
                                    <textarea
                                        id="edit-description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={5}
                                    />
                                </div>
                                <div className="edit-actions">
                                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-primary" onClick={handleSaveChanges}>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="item-main">
                                    <h3 className="detail-title">{item.title}</h3>
                                    {item.description && (
                                        <div className="item-description">
                                            <p>{item.description}</p>
                                        </div>
                                    )}
                                    <button className="btn btn-sm" onClick={() => setIsEditing(true)}>
                                        Edit
                                    </button>
                                </div>

                                <div className="item-comments">
                                    <h4>Comments</h4>
                                    <div className="comments-list">
                                        {item.comments && item.comments.length > 0 ? (
                                            item.comments.map((comment) => (
                                                <div key={comment.id} className="comment">
                                                    <div className="comment-meta">
                                                        <span className="comment-date">
                                                            {new Date(comment.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="comment-content">{comment.content}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-comments">No comments yet.</p>
                                        )}
                                    </div>

                                    <div className="add-comment">
                                        <textarea
                                            placeholder="Add a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            rows={3}
                                        />
                                        <button className="btn btn-primary" onClick={handleAddComment}>
                                            Add Comment
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemDetailsModal;
