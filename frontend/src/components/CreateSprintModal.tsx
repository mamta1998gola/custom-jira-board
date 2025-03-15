import React, { useState } from 'react';
import { Sprint } from '../types';
import '../App.css';

interface CreateSprintModalProps {
    onClose: () => void;
    onCreateSprint: (sprint: Partial<Sprint>) => void;
}

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({ onClose, onCreateSprint }) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    // Calculate end date (10 working days from start date)
    const calculateEndDate = (start: string) => {
        const date = new Date(start);
        let workingDays = 0;
        let currentDate = new Date(date);

        while (workingDays < 10) {
            currentDate.setDate(currentDate.getDate() + 1);
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                workingDays++;
            }
        }

        return currentDate.toISOString().split('T')[0];
    };

    const [endDate, setEndDate] = useState(calculateEndDate(startDate));

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        setEndDate(calculateEndDate(newStartDate));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateSprint({
            name: name || undefined, // Let the backend generate a name if none provided
            start_date: startDate,
            end_date: endDate,
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Create New Sprint</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="sprint-name">Sprint Name (Optional)</label>
                        <input
                            id="sprint-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Leave blank for auto-generated name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="start-date">Start Date</label>
                        <input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="end-date">End Date (10 working days)</label>
                        <input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create Sprint
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSprintModal;
