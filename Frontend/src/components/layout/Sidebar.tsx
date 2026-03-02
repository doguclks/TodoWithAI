import { useEffect, useState } from 'react';
import { ScrollArea, NavLink, ActionIcon, Group, Text, Loader, Center, Popover, TextInput } from '@mantine/core';
import { IconPlus, IconCheck, IconX, IconTrash, IconLayoutDashboard, IconPin, IconPinFilled } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useIntl } from 'react-intl';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { motion, AnimatePresence } from 'framer-motion';

import { TodoApi } from '../../api/api';
import { Todo } from '../../models/todo';
import { dispatchTodoUpdateEvent, dispatchTodosChangedEvent } from '../../events/todoEvents';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export function Sidebar() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const intl = useIntl();

    const fetchTodos = async () => {
        try {
            setLoading(true);
            const data = await TodoApi.getTodos();
            setTodos(data);
        } catch (error) {
            console.error("Failed to load todos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    useEffect(() => {
        const handleTodosChanged = () => {
            fetchTodos();
        };

        window.addEventListener('todosChanged', handleTodosChanged);
        return () => window.removeEventListener('todosChanged', handleTodosChanged);
    }, []);

    const handleCreatePage = async () => {
        try {
            const newTodo = await TodoApi.createTodo({
                title: intl.formatMessage({ id: 'common.newPage', defaultMessage: 'New Page' }),
                icon: '📄',
                isPinned: false,
                order: todos.length
            });
            setTodos(prev => [...prev, newTodo]);
            navigate(`/todo/${newTodo.id}`);
            dispatchTodosChangedEvent();
        } catch (error) {
            console.error("Failed to create page", error);
        }
    };

    const handleUpdateIcon = async (todo: Todo, emoji: string) => {
        try {
            const updated = { ...todo, icon: emoji, items: [] }; // Items not needed for update body
            await TodoApi.updateTodo(todo.id, updated);
            setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, icon: emoji } : t));
            dispatchTodoUpdateEvent(todo.id, { icon: emoji });
        } catch (error) {
            console.error("Failed to update icon", error);
        }
    };

    const startEditing = (todo: Todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
    };

    const saveEdit = async (todo: Todo) => {
        if (!editTitle.trim()) {
            setEditingId(null);
            return;
        }
        try {
            const updated = { ...todo, title: editTitle.trim(), items: [] };
            await TodoApi.updateTodo(todo.id, updated);
            setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, title: editTitle.trim() } : t));
            dispatchTodoUpdateEvent(todo.id, { title: editTitle.trim() });
        } catch (error) {
            console.error("Failed to save title", error);
        } finally {
            setEditingId(null);
        }
    };

    const confirmDeletePage = (todoId: number) => {
        modals.openConfirmModal({
            title: intl.formatMessage({ id: 'modal.deleteTitle', defaultMessage: 'Confirm Deletion' }),
            centered: true,
            children: <Text size="sm">{intl.formatMessage({ id: 'modal.deleteMessage', defaultMessage: 'Are you sure you want to delete this?' })}</Text>,
            labels: {
                confirm: intl.formatMessage({ id: 'modal.deleteConfirm', defaultMessage: 'Delete' }),
                cancel: intl.formatMessage({ id: 'modal.deleteCancel', defaultMessage: 'Cancel' })
            },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                try {
                    await TodoApi.deleteTodo(todoId);
                    setTodos(prev => prev.filter(t => t.id !== todoId));
                    dispatchTodosChangedEvent();
                    if (location.pathname === `/todo/${todoId}`) {
                        navigate('/');
                    }
                    notifications.show({
                        title: intl.formatMessage({ id: 'notification.deleted', defaultMessage: 'Deleted' }),
                        message: intl.formatMessage({ id: 'notification.successDelete', defaultMessage: 'Page successfully deleted' }),
                        color: 'blue'
                    });
                } catch (error) {
                    notifications.show({
                        title: intl.formatMessage({ id: 'notification.error', defaultMessage: 'Error' }),
                        message: intl.formatMessage({ id: 'notification.errorDelete', defaultMessage: 'Failed to delete page' }),
                        color: 'red'
                    });
                }
            },
        });
    };

    const handlePin = async (id: number) => {
        try {
            await TodoApi.pinTodo(id);
            fetchTodos();
            dispatchTodosChangedEvent();
        } catch (error) {
            console.error("Failed to pin todo", error);
        }
    };

    const handleUnpin = async (id: number) => {
        try {
            await TodoApi.unpinTodo(id);
            fetchTodos();
            dispatchTodosChangedEvent();
        } catch (error) {
            console.error("Failed to unpin todo", error);
        }
    };

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const reorderedTodos = Array.from(todos);
        const [removed] = reorderedTodos.splice(result.source.index, 1);
        reorderedTodos.splice(result.destination.index, 0, removed);

        setTodos(reorderedTodos);

        try {
            const updates = reorderedTodos.map((t, index) => ({
                id: t.id,
                order: index
            }));
            await TodoApi.updateOrder(updates);
            dispatchTodosChangedEvent();
        } catch (error) {
            console.error('Failed to update order', error);
            fetchTodos();
        }
    };

    return (
        <>
            <ScrollArea className="sidebar-scroll" style={{ flex: 1, padding: '10px' }}>
                <NavLink
                    label="Dashboard"
                    leftSection={<IconLayoutDashboard size={20} />}
                    onClick={() => navigate('/')}
                    active={location.pathname === '/'}
                    variant="light"
                    color="indigo"
                    style={{ borderRadius: '8px', marginBottom: '12px' }}
                />

                {loading ? (
                    <Center mt="md"><Loader size="sm" type="dots" /></Center>
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="sidebar-todos">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    <AnimatePresence initial={false}>
                                        {todos.map((todo, index) => {
                                            const isActive = location.pathname === `/todo/${todo.id}`;
                                            return (
                                                <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: -20 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <NavLink
                                                                    active={isActive}
                                                                    onClick={() => { if (editingId !== todo.id) navigate(`/todo/${todo.id}`); }}
                                                                    label={
                                                                        editingId === todo.id ? (
                                                                            <Group gap="xs" wrap="nowrap" onClick={(e) => e.stopPropagation()}>
                                                                                <TextInput
                                                                                    size="xs"
                                                                                    value={editTitle}
                                                                                    onChange={(e) => setEditTitle(e.currentTarget.value)}
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === 'Enter') saveEdit(todo);
                                                                                        if (e.key === 'Escape') setEditingId(null);
                                                                                    }}
                                                                                    autoFocus
                                                                                />
                                                                                <ActionIcon size="sm" color="green" onClick={() => saveEdit(todo)}><IconCheck size={14} /></ActionIcon>
                                                                                <ActionIcon size="sm" color="red" onClick={() => setEditingId(null)}><IconX size={14} /></ActionIcon>
                                                                            </Group>
                                                                        ) : (
                                                                            <Text size="sm" fw={isActive ? 600 : 400} onDoubleClick={() => startEditing(todo)} truncate>
                                                                                {todo.title}
                                                                            </Text>
                                                                        )
                                                                    }
                                                                    leftSection={
                                                                        <Popover width={350} position="right" withArrow shadow="md">
                                                                            <Popover.Target>
                                                                                <ActionIcon variant="subtle" size="sm" onClick={(e) => e.stopPropagation()}>
                                                                                    <Text size="lg">{todo.icon || '📄'}</Text>
                                                                                </ActionIcon>
                                                                            </Popover.Target>
                                                                            <Popover.Dropdown p={0}>
                                                                                <EmojiPicker
                                                                                    onEmojiClick={(e: EmojiClickData) => handleUpdateIcon(todo, e.emoji)}
                                                                                    lazyLoadEmojis={true}
                                                                                />
                                                                            </Popover.Dropdown>
                                                                        </Popover>
                                                                    }
                                                                    rightSection={
                                                                        <Group gap={4}>
                                                                            <ActionIcon
                                                                                variant="subtle"
                                                                                color={todo.isPinned ? "blue" : "gray"}
                                                                                size="sm"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    todo.isPinned ? handleUnpin(todo.id) : handlePin(todo.id);
                                                                                }}
                                                                            >
                                                                                {todo.isPinned ? <IconPinFilled size={14} /> : <IconPin size={14} />}
                                                                            </ActionIcon>
                                                                            <ActionIcon
                                                                                variant="subtle"
                                                                                color="gray"
                                                                                size="sm"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    confirmDeletePage(todo.id);
                                                                                }}
                                                                                className="sidebar-delete-btn"
                                                                            >
                                                                                <IconTrash size={14} />
                                                                            </ActionIcon>
                                                                        </Group>
                                                                    }
                                                                    variant="light"
                                                                    color="indigo"
                                                                    style={{ borderRadius: '8px', marginBottom: '4px' }}
                                                                />
                                                            </motion.div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                    </AnimatePresence>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </ScrollArea>
            <div style={{ padding: '16px', borderTop: '1px solid var(--mantine-color-default-border)' }}>
                <NavLink
                    label={intl.formatMessage({ id: 'sidebar.addPage', defaultMessage: 'Add New Page' })}
                    leftSection={<IconPlus size={16} />}
                    onClick={handleCreatePage}
                    variant="subtle"
                    active={false}
                    style={{ borderRadius: '8px', fontWeight: 500 }}
                />
            </div>
        </>
    );
}
