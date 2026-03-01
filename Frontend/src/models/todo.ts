export enum TodoStatus {
    Todo = 0,
    InProgress = 1,
    Done = 2
}

export interface TodoItem {
    id: number;
    title: string;
    status: TodoStatus;
    todoId: number;
}

export interface Todo {
    id: number;
    title: string;
    icon: string;
    date: string;
    items: TodoItem[];
}
