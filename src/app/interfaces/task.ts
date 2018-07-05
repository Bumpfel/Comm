export interface TaskCategory {
    name: string;
    // sortId: number;
    tasks: Task[];
    collapsed?: boolean;
}

export interface Task {
    id: number;
    subject: string;
    description: string;
    priority: number;
    points: number;
    status: string;
    startedAt?: string;
    editedAt?: string; //MultiDate;
    completedAt?: string;
}

export interface Status {
    index: number;
    name: string;
}

export interface MultiDate { // not working
    timestamp: string[];
}