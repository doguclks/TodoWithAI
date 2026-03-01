import { useEffect, useState } from 'react';
import { Title, Text, Container, Loader, Center, Stack, UnstyledButton, Group } from '@mantine/core';
import { IconPlus, IconLayoutDashboard } from '@tabler/icons-react';
import { TodoApi } from '../api/TodoApi';
import { Todo } from '../models/todo';
import { DashboardCard } from '../components/DashboardCard';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { dispatchTodosChangedEvent } from '../events/todoEvents';
import './Dashboard.css';

export default function Dashboard() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const intl = useIntl();

    const fetchTodos = async () => {
        try {
            setLoading(true);
            const data = await TodoApi.getTodos();
            setTodos(data);
        } catch (error) {
            console.error('Failed to fetch todos', error);
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
                icon: '📄'
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
            fetchTodos();
        } catch (error) {
            console.error('Failed to delete page', error);
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
                <Group align="center" gap="sm">
                    <IconLayoutDashboard size={32} color="var(--mantine-color-indigo-6)" />
                    <Title order={1} className="header-title">
                        {intl.formatMessage({ id: 'app.title', defaultMessage: 'TickIt!' })} {intl.formatMessage({ id: 'dashboard.title', defaultMessage: 'Dashboard' })}
                    </Title>
                </Group>

                <Text c="dimmed" size="lg">
                    {intl.formatMessage({ id: 'dashboard.welcome', defaultMessage: 'Welcome back! Here are your current todo boards.' })}
                </Text>

                <div className="dashboard-grid">
                    {todos.map((todo) => (
                        <DashboardCard
                            key={todo.id}
                            todo={todo}
                            onDelete={handleDeletePage}
                        />
                    ))}

                    <UnstyledButton className="add-card" onClick={handleCreatePage}>
                        <Stack align="center" gap="xs">
                            <IconPlus size={32} color="var(--mantine-color-indigo-5)" />
                            <Text fw={600} c="indigo">
                                {intl.formatMessage({ id: 'sidebar.addPage', defaultMessage: 'Add New Page' })}
                            </Text>
                        </Stack>
                    </UnstyledButton>
                </div>
            </Stack>
        </Container>
    );
}
