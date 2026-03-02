import { useEffect, useState } from 'react';
import { Title, Text, Container, Loader, Center, Stack, UnstyledButton, Group, TextInput } from '@mantine/core';
import { IconPlus, IconLayoutDashboard, IconSearch } from '@tabler/icons-react';
import { TodoApi } from '../api/TodoApi';
import { Todo } from '../models/todo';
import { DashboardCard } from '../components/DashboardCard';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { dispatchTodosChangedEvent } from '../events/todoEvents';
import './Dashboard.css';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function Dashboard() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const intl = useIntl();

    const fetchTodos = async (search?: string) => {
        try {
            setLoading(true);
            const data = await TodoApi.getTodos(search);
            // Sort by isPinned and then order if not searching
            const sortedData = search ? data : [...data].sort((a, b) => {
                if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
                return (a.order || 0) - (b.order || 0);
            });
            setTodos(sortedData);
        } catch (error) {
            console.error('Failed to fetch todos', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTodos(searchQuery);
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const handleTodosChanged = () => {
            fetchTodos(searchQuery);
        };
        window.addEventListener('todosChanged', handleTodosChanged);
        return () => window.removeEventListener('todosChanged', handleTodosChanged);
    }, [searchQuery]);

    const handleCreatePage = async () => {
        try {
            const newTodo = await TodoApi.createTodo({
                title: intl.formatMessage({ id: 'common.newPage', defaultMessage: 'New Page' }),
                icon: '📄',
                isPinned: false,
                order: todos.length
            });
            dispatchTodosChangedEvent();
            navigate(`/todo/${newTodo.id}`);
        } catch (error) {
            console.error('Failed to create page', error);
        }
    };

    const handleDeletePage = async (id: number) => {
        try {
            await TodoApi.deleteTodo(id);
            dispatchTodosChangedEvent();
            fetchTodos(searchQuery);
        } catch (error) {
            console.error('Failed to delete page', error);
        }
    };

    const handlePin = async (id: number) => {
        try {
            await TodoApi.pinTodo(id);
            dispatchTodosChangedEvent();
            fetchTodos(searchQuery);
        } catch (error) {
            console.error('Failed to pin todo', error);
        }
    };

    const handleUnpin = async (id: number) => {
        try {
            await TodoApi.unpinTodo(id);
            dispatchTodosChangedEvent();
            fetchTodos(searchQuery);
        } catch (error) {
            console.error('Failed to unpin todo', error);
        }
    };

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination || searchQuery !== '') return;

        const reorderedTodos = Array.from(todos);
        const [removed] = reorderedTodos.splice(result.source.index, 1);
        reorderedTodos.splice(result.destination.index, 0, removed);

        // Update local state for immediate feedback
        setTodos(reorderedTodos);

        // Update orders in backend
        try {
            const updates = reorderedTodos.map((t, index) => ({
                id: t.id,
                order: index
            }));
            await TodoApi.updateOrder(updates);
            dispatchTodosChangedEvent();
        } catch (error) {
            console.error('Failed to update order', error);
            fetchTodos(searchQuery); // Revert on failure
        }
    };

    if (loading) {
        return (
            <Center style={{ height: '70vh' }}>
                <Loader size="xl" type="bars" color="indigo" />
            </Center>
        );
    }

    return (
        <Container className="dashboard-container" size="xl">
            <Stack gap="xl">
                <Group justify="space-between" align="center" className="dashboard-header-row">
                    <Group align="center" gap="sm">
                        <IconLayoutDashboard size={32} color="var(--mantine-color-indigo-6)" />
                        <Title order={1} className="header-title">
                            {intl.formatMessage({ id: 'app.title', defaultMessage: 'TickIt!' })} {intl.formatMessage({ id: 'dashboard.title', defaultMessage: 'Dashboard' })}
                        </Title>
                    </Group>

                    <TextInput
                        placeholder={intl.formatMessage({ id: 'dashboard.searchPlaceholder', defaultMessage: 'Search boards...' })}
                        leftSection={<IconSearch size={18} stroke={1.5} />}
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.currentTarget.value)}
                        size="md"
                        radius="md"
                        className="search-input"
                        style={{ width: '300px' }}
                    />
                </Group>

                <Text c="dimmed" size="lg" style={{ marginTop: -10 }}>
                    {intl.formatMessage({ id: 'dashboard.welcome', defaultMessage: 'Welcome back! Here are your current todo boards.' })}
                </Text>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="dashboard-grid" direction="horizontal">
                        {(provided) => (
                            <div
                                className="dashboard-grid"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {todos.map((todo, index) => (
                                    <Draggable
                                        key={todo.id}
                                        draggableId={todo.id.toString()}
                                        index={index}
                                        isDragDisabled={searchQuery !== ''}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <DashboardCard
                                                    todo={todo}
                                                    onDelete={handleDeletePage}
                                                    onPin={handlePin}
                                                    onUnpin={handleUnpin}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}

                                {searchQuery === '' && (
                                    <UnstyledButton className="add-card" onClick={handleCreatePage}>
                                        <Stack align="center" gap="xs">
                                            <IconPlus size={32} color="var(--mantine-color-indigo-5)" />
                                            <Text fw={600} c="indigo">
                                                {intl.formatMessage({ id: 'sidebar.addPage', defaultMessage: 'Add New Page' })}
                                            </Text>
                                        </Stack>
                                    </UnstyledButton>
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                {todos.length === 0 && searchQuery !== '' && (
                    <Center mt="xl">
                        <Text c="dimmed" size="lg">
                            {intl.formatMessage({ id: 'app.emptyMessage', defaultMessage: 'No results found.' })}
                        </Text>
                    </Center>
                )}
            </Stack>
        </Container>
    );
}
