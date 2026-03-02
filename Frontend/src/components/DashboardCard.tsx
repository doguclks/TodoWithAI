import { Card, Text, Group, ActionIcon, Stack, Tooltip } from '@mantine/core';
import { IconTrash, IconPin, IconPinFilled } from '@tabler/icons-react';
import { Todo } from '../models/todo';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { modals } from '@mantine/modals';

interface DashboardCardProps {
    todo: Todo;
    onDelete?: (id: number) => void;
    onPin?: (id: number) => void;
    onUnpin?: (id: number) => void;
}

export function DashboardCard({ todo, onDelete, onPin, onUnpin }: DashboardCardProps) {
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

    const handlePinClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (todo.isPinned) {
            onUnpin?.(todo.id);
        } else {
            onPin?.(todo.id);
        }
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
                style={{ cursor: 'pointer', height: '100%', position: 'relative' }}
                className="dashboard-card"
            >
                <Stack justify="space-between" h="100%">
                    <Group justify="space-between" align="flex-start">
                        <Text size="32px">{todo.icon || '📄'}</Text>
                        <Group gap={4}>
                            <Tooltip label={todo.isPinned ? "Unpin" : "Pin"}>
                                <ActionIcon
                                    variant="subtle"
                                    color={todo.isPinned ? "blue" : "gray"}
                                    onClick={handlePinClick}
                                >
                                    {todo.isPinned ? <IconPinFilled size={18} /> : <IconPin size={18} />}
                                </ActionIcon>
                            </Tooltip>
                            <ActionIcon
                                variant="subtle"
                                color="red"
                                onClick={handleDeleteClick}
                            >
                                <IconTrash size={20} />
                            </ActionIcon>
                        </Group>
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
