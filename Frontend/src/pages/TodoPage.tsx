import { useEffect, useState } from 'react';
import { Title, Button, TextInput, Loader, Center, Group, Badge, Popover } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useIntl } from 'react-intl';
import { useParams, useNavigate } from 'react-router-dom';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import { TodoItemApi, TodoApi } from '../api/api';
import { TodoItem, TodoStatus, Todo } from '../models/todo';
import { TodoItemCard } from '../components/TodoItemCard';
import { dispatchTodoUpdateEvent, dispatchTodosChangedEvent } from '../events/todoEvents';
import './TodoPage.css';

export default function TodoPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [todo, setTodo] = useState<Todo | null>(null);
    const [items, setItems] = useState<TodoItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [popoverOpened, setPopoverOpened] = useState(false);

    const intl = useIntl();

    const form = useForm({
        initialValues: { title: '' },
        validate: {
            title: (value: string) => (value.trim().length === 0 ? intl.formatMessage({ id: 'validation.titleRequired' }) : null),
        },
    });

    const loadPageData = async () => {
        if (!id) return;
        const todoId = parseInt(id);
        if (isNaN(todoId)) {
            navigate('/');
            return;
        }

        try {
            setLoading(true);
            const [fetchedTodo, fetchedItems] = await Promise.all([
                TodoApi.getTodo(todoId),
                TodoItemApi.getItems(todoId)
            ]);
            setTodo(fetchedTodo);
            setEditTitle(fetchedTodo.title);
            setItems(fetchedItems.sort((a, b) => b.id - a.id));
        } catch (error) {
            notifications.show({ title: intl.formatMessage({ id: 'notification.error' }), message: intl.formatMessage({ id: 'notification.errorFetch' }), color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPageData(); }, [id]);

    useEffect(() => {
        const handleTodoUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<{ todoId: number; updates: Partial<Todo> }>;
            if (todo && customEvent.detail.todoId === todo.id) {
                setTodo(prev => prev ? { ...prev, ...customEvent.detail.updates } : null);
                if (customEvent.detail.updates.title) setEditTitle(customEvent.detail.updates.title);
            }
        };

        window.addEventListener('todoUpdated', handleTodoUpdate);
        return () => window.removeEventListener('todoUpdated', handleTodoUpdate);
    }, [todo]);

    const handleUpdateTitle = async () => {
        if (!todo || !editTitle.trim() || editTitle === todo.title) {
            setIsEditingTitle(false);
            setEditTitle(todo?.title || '');
            return;
        }

        try {
            const updated = { ...todo, title: editTitle.trim(), items: [] };
            await TodoApi.updateTodo(todo.id, updated);
            setTodo(prev => prev ? { ...prev, title: editTitle.trim() } : null);
            dispatchTodoUpdateEvent(todo.id, { title: editTitle.trim() });
            dispatchTodosChangedEvent();
            setIsEditingTitle(false);
        } catch (error) {
            notifications.show({ title: intl.formatMessage({ id: 'notification.error' }), message: intl.formatMessage({ id: 'notification.errorTitleUpdate', defaultMessage: 'Failed to update title' }), color: 'red' });
        }
    };

    const handleUpdateIcon = async (emojiData: EmojiClickData) => {
        if (!todo) return;
        const emoji = emojiData.emoji;
        try {
            const updated = { ...todo, icon: emoji, items: [] };
            await TodoApi.updateTodo(todo.id, updated);
            setTodo(prev => prev ? { ...prev, icon: emoji } : null);
            dispatchTodoUpdateEvent(todo.id, { icon: emoji });
            dispatchTodosChangedEvent();
            setPopoverOpened(false);
        } catch (error) {
            notifications.show({ title: intl.formatMessage({ id: 'notification.error' }), message: intl.formatMessage({ id: 'notification.errorIconUpdate', defaultMessage: 'Failed to update icon' }), color: 'red' });
        }
    };

    const handleAddItem = async (values: typeof form.values) => {
        if (!id) return;
        try {
            const newItem = await TodoItemApi.createItem({
                title: values.title.trim(),
                status: TodoStatus.Todo,
                todoId: parseInt(id)
            });
            setItems((prev) => [newItem, ...prev]);
            form.reset();
            notifications.show({ title: intl.formatMessage({ id: 'notification.success' }), message: intl.formatMessage({ id: 'notification.successAdd' }), color: 'teal' });
        } catch (error) {
            notifications.show({ title: intl.formatMessage({ id: 'notification.error' }), message: intl.formatMessage({ id: 'notification.errorAdd' }), color: 'red' });
        }
    };

    const handleToggleItem = async (itemId: number, currentStatus: TodoStatus) => {
        const itemToUpdate = items.find((t) => t.id === itemId);
        if (!itemToUpdate) return;

        let newStatus = currentStatus === TodoStatus.Done ? TodoStatus.Todo : TodoStatus.Done;

        try {
            const updatedItem = { ...itemToUpdate, status: newStatus };
            await TodoItemApi.updateItem(itemId, updatedItem);
            setItems((prev) => prev.map((t) => (t.id === itemId ? updatedItem : t)));
        } catch (error) {
            notifications.show({ title: intl.formatMessage({ id: 'notification.error' }), message: intl.formatMessage({ id: 'notification.errorUpdate' }), color: 'red' });
        }
    };

    const handleEditItem = async (itemId: number, newTitle: string) => {
        const itemToUpdate = items.find((t) => t.id === itemId);
        if (!itemToUpdate || itemToUpdate.title === newTitle) return;

        try {
            const updatedItem = { ...itemToUpdate, title: newTitle };
            await TodoItemApi.updateItem(itemId, updatedItem);
            setItems((prev) => prev.map((t) => (t.id === itemId ? updatedItem : t)));
            notifications.show({ title: intl.formatMessage({ id: 'notification.success' }), message: intl.formatMessage({ id: 'notification.successEdit' }), color: 'teal' });
        } catch (error) {
            notifications.show({ title: intl.formatMessage({ id: 'notification.error' }), message: intl.formatMessage({ id: 'notification.errorEdit' }), color: 'red' });
        }
    };

    const deleteWithApi = async (itemId: number) => {
        try {
            await TodoItemApi.deleteItem(itemId);
            setItems((prev) => prev.filter((t) => t.id !== itemId));
            notifications.show({ title: intl.formatMessage({ id: 'notification.deleted' }), message: intl.formatMessage({ id: 'notification.successDelete' }), color: 'blue' });
        } catch (error) {
            notifications.show({ title: intl.formatMessage({ id: 'notification.error' }), message: intl.formatMessage({ id: 'notification.errorDelete' }), color: 'red' });
        }
    };

    const handleDeleteClick = (itemId: number) => {
        modals.openConfirmModal({
            title: intl.formatMessage({ id: 'modal.deleteTitle' }),
            centered: true,
            children: <p>{intl.formatMessage({ id: 'modal.deleteMessage' })}</p>,
            labels: { confirm: intl.formatMessage({ id: 'modal.deleteConfirm' }), cancel: intl.formatMessage({ id: 'modal.deleteCancel' }) },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteWithApi(itemId),
        });
    };

    const onDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const newStatus = parseInt(destination.droppableId) as TodoStatus;
        const itemId = parseInt(draggableId);

        const itemIndex = items.findIndex(t => t.id === itemId);
        if (itemIndex === -1) return;

        const originalItem = items[itemIndex];
        if (originalItem.status === newStatus && source.index === destination.index) return;

        const updatedItems = [...items];
        updatedItems[itemIndex] = { ...originalItem, status: newStatus };
        setItems(updatedItems);

        try {
            await TodoItemApi.updateItem(itemId, { ...originalItem, status: newStatus });
        } catch (error) {
            setItems(items);
            notifications.show({ title: intl.formatMessage({ id: 'notification.error' }), message: intl.formatMessage({ id: 'notification.errorUpdate' }), color: 'red' });
        }
    };

    const columns = [
        { id: TodoStatus.Todo.toString(), title: intl.formatMessage({ id: 'column.todo' }), color: 'grape', status: TodoStatus.Todo },
        { id: TodoStatus.InProgress.toString(), title: intl.formatMessage({ id: 'column.inProgress' }), color: 'yellow', status: TodoStatus.InProgress },
        { id: TodoStatus.Done.toString(), title: intl.formatMessage({ id: 'column.done' }), color: 'green', status: TodoStatus.Done }
    ];

    if (loading) return <Center pt="xl"><Loader color="indigo" type="bars" /></Center>;
    if (!todo) return <Center pt="xl"><Title order={3}>{intl.formatMessage({ id: 'common.pageNotFound', defaultMessage: 'Page not found' })}</Title></Center>;

    return (
        <div className="page-wrapper">
            <Group mb="xl" align="center" gap="sm">
                <Popover opened={popoverOpened} onChange={setPopoverOpened} position="bottom" withArrow shadow="md">
                    <Popover.Target>
                        <span
                            style={{ fontSize: '2rem', cursor: 'pointer' }}
                            onClick={() => setPopoverOpened(o => !o)}
                        >
                            {todo.icon}
                        </span>
                    </Popover.Target>
                    <Popover.Dropdown p={0}>
                        <EmojiPicker onEmojiClick={handleUpdateIcon} />
                    </Popover.Dropdown>
                </Popover>

                {isEditingTitle ? (
                    <TextInput
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleUpdateTitle}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
                        autoFocus
                        size="xl"
                        styles={{ input: { fontSize: '1.5rem', fontWeight: 700, padding: 0, minHeight: 'auto', border: 'none' } }}
                    />
                ) : (
                    <Title order={2} className="header-title" onClick={() => setIsEditingTitle(true)} style={{ cursor: 'pointer' }}>
                        {todo.title}
                    </Title>
                )}
            </Group>

            <form onSubmit={form.onSubmit(handleAddItem)} className="add-container">
                <TextInput placeholder={intl.formatMessage({ id: 'app.addPlaceholder' })} style={{ flex: 1 }} size="md" radius="md" {...form.getInputProps('title')} />
                <Button type="submit" size="md" radius="md" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} leftSection={<IconPlus size={18} />}>
                    {intl.formatMessage({ id: 'app.addButton' })}
                </Button>
            </form>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-board">
                    {columns.map(col => (
                        <div key={col.id} className={`kanban-column status-${col.status}`}>
                            <Group justify="space-between" className="kanban-column-header">
                                <Title order={3} size="h4">{col.title}</Title>
                                <Badge color={col.color} variant="light" size="lg" circle>
                                    {items.filter(t => t.status === col.status).length}
                                </Badge>
                            </Group>

                            <Droppable droppableId={col.id}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="kanban-list">
                                        {items
                                            .filter(t => t.status === col.status)
                                            .map((item, index) => (
                                                <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="draggable-card-wrapper"
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                opacity: snapshot.isDragging ? 0.8 : 1,
                                                            }}
                                                        >
                                                            <TodoItemCard
                                                                todo={item}
                                                                onToggle={(id) => handleToggleItem(id, item.status)}
                                                                onDeleteClick={handleDeleteClick}
                                                                onEdit={handleEditItem}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
