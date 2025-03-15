import { Item, Sprint, Comment } from '../types';

const API_URL = 'http://localhost:5000/api';

export const fetchBacklogItems = async (): Promise<Item[]> => {
    const response = await fetch(`${API_URL}/items?status=backlog`);
    return response.json();
};

export const fetchSprintItems = async (sprintId: number): Promise<Item[]> => {
    const response = await fetch(`${API_URL}/items?sprint_id=${sprintId}`);
    return response.json();
};

export const fetchItem = async (itemId: number): Promise<Item> => {
    const response = await fetch(`${API_URL}/items/${itemId}`);
    return response.json();
};

export const createItem = async (item: Partial<Item>): Promise<{ id: number }> => {
    const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });
    return response.json();
};

export const updateItem = async (itemId: number, updates: Partial<Item>): Promise<void> => {
    await fetch(`${API_URL}/items/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
};

export const addComment = async (comment: Partial<Comment>): Promise<{ id: number }> => {
    const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
    });
    return response.json();
};

export const fetchSprints = async (): Promise<Sprint[]> => {
    const response = await fetch(`${API_URL}/sprints`);
    return response.json();
};

export const fetchActiveSprint = async (): Promise<Sprint | null> => {
    const response = await fetch(`${API_URL}/sprints?active=true`);
    const sprints = await response.json();
    return sprints.length > 0 ? sprints[0] : null;
};

export const createSprint = async (sprint: Partial<Sprint> = {}): Promise<Sprint> => {
    const response = await fetch(`${API_URL}/sprints`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sprint),
    });
    return response.json();
};

export const activateSprint = async (sprintId: number): Promise<void> => {
    await fetch(`${API_URL}/sprints/${sprintId}/activate`, {
        method: 'POST',
    });
};

export const closeSprint = async (sprintId: number, moveToSprintId?: number): Promise<{ new_sprint_id: number }> => {
    const response = await fetch(`${API_URL}/sprints/${sprintId}/close`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ move_to_sprint_id: moveToSprintId }),
    });
    return response.json();
};
