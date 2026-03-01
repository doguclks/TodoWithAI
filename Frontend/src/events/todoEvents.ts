import { Todo } from '../models/todo';

export const dispatchTodoUpdateEvent = (todoId: number, updates: Partial<Todo>) => {
    const event = new CustomEvent('todoUpdated', { detail: { todoId, updates } });
    window.dispatchEvent(event);
};

export const dispatchTodosChangedEvent = () => {
    const event = new CustomEvent('todosChanged');
    window.dispatchEvent(event);
};
