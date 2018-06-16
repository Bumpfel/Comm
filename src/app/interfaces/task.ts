interface TaskCategory {
    // id: string;
    name: string;
    name_key: string;
    nextTaskId: number;
    tasks?: Task[];
}

interface Task {
    id: string;
    name: string;
    description: string;
    priority: number;
    points: number;
    deadline?: string;
}
