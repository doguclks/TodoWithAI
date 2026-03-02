import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardCard } from '../components/DashboardCard';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Todo } from '../models/todo';
import { MantineProvider } from '@mantine/core';

// Mocking dependencies
vi.mock('@tabler/icons-react', () => ({
    IconDotsVertical: () => <div data-testid="icon-dots" />,
    IconPin: () => <div data-testid="icon-pin" />,
    IconPinFilled: () => <div data-testid="icon-pin-filled" />,
    IconTrash: () => <div data-testid="icon-trash" />,
}));

// Mock Mantine modules that might cause issues in jsdom
vi.mock('@mantine/modals', () => ({
    modals: {
        openConfirmModal: vi.fn(),
    },
}));

const mockMessages = {
    'dashboard.tasks': 'tasks',
};

describe('DashboardCard', () => {
    const mockTodo: Todo = {
        id: 1,
        title: 'Test Board',
        icon: '🚀',
        items: new Array(5).fill({}),
        isPinned: false,
        date: new Date().toISOString(),
        order: 0
    };

    const defaultProps = {
        todo: mockTodo,
        onDelete: vi.fn(),
        onPin: vi.fn(),
        onUnpin: vi.fn(),
    };

    const renderComponent = (props = defaultProps) => {
        return render(
            <MemoryRouter>
                <IntlProvider locale="en" messages={mockMessages}>
                    <MantineProvider>
                        <DashboardCard {...props} />
                    </MantineProvider>
                </IntlProvider>
            </MemoryRouter>
        );
    };

    it('renders the title correctly', () => {
        renderComponent();
        expect(screen.getByText('Test Board')).toBeInTheDocument();
    });

    it('renders the icon correctly', () => {
        renderComponent();
        expect(screen.getByText('🚀')).toBeInTheDocument();
    });

    it('displays the correct item count message', () => {
        renderComponent();
        expect(screen.getByText(/5 tasks/i)).toBeInTheDocument();
    });
});
