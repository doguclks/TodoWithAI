import { Card, Text, Group, ActionIcon, Stack } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { Todo } from '../models/todo';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { modals } from '@mantine/modals';

interface DashboardCardProps {
    todo: Todo;
    onDelete?: (id: number) => void;
}

export function DashboardCard({ todo, onDelete }: DashboardCardProps) {
    const navigate = useNavigate();
    const intl = useIntl();

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        modals.openConfirmModal({
            title: intl.formatMessage({ id: 'modal.deleteTitle', defaultMessage: 'Confirm Deletion' }),
            centered: true,
            children: (
                <Text size="sm">
                    {intl.formatMessage({ id: 'modal.deleteMessage', defaultMessage: 'Are you sure you want to delete this?' })}
                </Text>
            ),
            labels: {
                confirm: intl.formatMessage({ id: 'modal.deleteConfirm', defaultMessage: 'Delete' }),
                cancel: intl.formatMessage({ id: 'modal.deleteCancel', defaultMessage: 'Cancel' }),
            },
            confirmProps: { color: 'red' },
            onConfirm: () => onDelete?.(todo.id),
        });
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03, translateY: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                onClick={() => navigate(`/todo/${todo.id}`)}
                style={{ cursor: 'pointer', height: '100%' }}
                className="dashboard-card"
            >
                <Stack justify="space-between" h="100%">
                    <Group justify="space-between" align="flex-start">
                        <Text size="32px">{todo.icon || '📄'}</Text>
                        <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={handleDeleteClick}
                        >
                            <IconTrash size={20} />
                        </ActionIcon>
                    </Group>

                    <Stack gap={4}>
                        <Text fw={700} size="lg" truncate>
                            {todo.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {todo.items?.length || 0} {intl.formatMessage({ id: 'dashboard.tasks', defaultMessage: 'tasks' })}
                        </Text>
                    </Stack>
                </Stack>
            </Card>
        </motion.div>
    );
}
