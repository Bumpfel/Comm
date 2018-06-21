interface TaskCategory {
    // id: string;
    name: string;
    name_key: string;
    // nextTaskId: number;
    tasks?: Task[];
}

interface Task {
    id: number;
    name: string;
    description: string;
    priority: number;
    points: number;
    status: string;
    deadline?: string;
    editedDate?: any[];
    startedDate?: string;
    completedDate?: string;
}
