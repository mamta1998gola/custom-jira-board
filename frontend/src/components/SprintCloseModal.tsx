import React, { useState } from 'react';
import { Sprint } from '../types';
import '../App.css';

interface SprintCloseModalProps {
    sprint: Sprint;
    onClose: () => void;
    onCloseSprint: (createNewSprint: boolean) => void;
}

const SprintCloseModal: React.FC<SprintCloseModalProps> = ({ sprint, onClose, onCloseSprint }) => {
    const [createNewSprint, setCreateNewSprint] = useState(true);

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Close Sprint</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    <p>Are you sure you want to close "{sprint.name}"?</p>
                    <p>All incomplete items will be moved to:</p>

                    <div className="form-group">
                        <label>
                            <input
                                type="radio"
                                checked={createNewSprint}
                                onChange={() => setCreateNewSprint(true)}
                            />
                            Create a new sprint
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="radio"
                                checked={!createNewSprint}
                                onChange={() => setCreateNewSprint(false)}
                            />
                            Move to backlog
                        </label>
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => onCloseSprint(createNewSprint)}
                    >
                        Close Sprint
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SprintCloseModal;
