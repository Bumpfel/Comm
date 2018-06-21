
interface TaskCategory { // Obsolete
    name: string;
    // name_key: string;
    tasks?: any;
}

interface Assignment {
    name: string;
    // name_key: string;
    // tasks?: Task[];
    tasks?: any;
}
interface AssignmentCategory {
    name: string;
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
