export interface Item {
    id: number;
    title: string;
    description: string;
    item_type: 'story' | 'task' | 'bug';
    status: string;
    sprint_id: number | null;
    created_at: string;
    comments?: Comment[];
}

export interface Comment {
    id: number;
    item_id: number;
    content: string;
    created_at: string;
}

export interface Sprint {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    is_closed: boolean;
}
