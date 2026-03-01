import { useState } from 'react';
import { Checkbox, ActionIcon, Tooltip, TextInput } from '@mantine/core';
import { IconTrash, IconCheck, IconEdit, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { TodoItem, TodoStatus } from '../models/todo';
import { motion } from 'framer-motion';
import { useIntl } from 'react-intl';
import './TodoItemCard.css';

interface TodoItemCardProps {
    todo: TodoItem;
    onToggle: (id: number, currentStatus: TodoStatus) => void;
    onDeleteClick: (id: number) => void;
    onEdit: (id: number, newTitle: string) => Promise<void>;
}

export function TodoItemCard({ todo, onToggle, onDeleteClick, onEdit }: TodoItemCardProps) {
    const intl = useIntl();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);

    const handleSave = async () => {
        if (editTitle.trim().length === 0) return;
        await onEdit(todo.id, editTitle);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(todo.title);
        setIsEditing(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
            className="todo-card"
        >
            <div className="todo-content">
                <Checkbox
                    checked={todo.status === TodoStatus.Done}
                    onChange={() => onToggle(todo.id, todo.status)}
                    color="teal"
                    size="md"
                    icon={({ className }) => <IconCheck className={className} stroke={3} />}
                />
                {isEditing ? (
                    <TextInput
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.currentTarget.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancel();
                        }}
                        autoFocus
                        style={{ flex: 1, marginLeft: 15 }}
                    />
                ) : (
                    <span className={`todo-title ${todo.status === TodoStatus.Done ? 'completed' : ''}`}>
                        {todo.title}
                    </span>
                )}
            </div>

            <div className="todo-actions">
                {isEditing ? (
                    <>
                        <Tooltip label={intl.formatMessage({ id: 'app.saveTooltip' })}>
                            <ActionIcon
                                variant="light"
                                color="teal"
                                onClick={handleSave}
                                aria-label="Save"
                            >
                                <IconDeviceFloppy stroke={1.5} size={18} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={intl.formatMessage({ id: 'app.cancelTooltip' })}>
                            <ActionIcon
                                variant="light"
                                color="gray"
                                onClick={handleCancel}
                                aria-label="Cancel"
                            >
                                <IconX stroke={1.5} size={18} />
                            </ActionIcon>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <Tooltip label={intl.formatMessage({ id: 'app.editTooltip' })}>
                            <ActionIcon
                                variant="light"
                                color="blue"
                                onClick={() => setIsEditing(true)}
                                aria-label="Edit"
                            >
                                <IconEdit stroke={1.5} size={18} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={intl.formatMessage({ id: 'app.deleteTooltip' })}>
                            <ActionIcon
                                variant="light"
                                color="red"
                                onClick={() => onDeleteClick(todo.id)}
                                aria-label="Delete"
                            >
                                <IconTrash stroke={1.5} size={18} />
                            </ActionIcon>
                        </Tooltip>
                    </>
                )}
            </div>
        </motion.div>
    );
}
