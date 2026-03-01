import { AppShell } from '@mantine/core';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 280, breakpoint: 'sm' }}
            padding="md"
        >
            <AppShell.Header>
                <Header />
            </AppShell.Header>

            <AppShell.Navbar p={0} style={{ display: 'flex', flexDirection: 'column' }}>
                <Sidebar />
            </AppShell.Navbar>

            <AppShell.Main style={{ backgroundColor: 'var(--mantine-color-body)', minHeight: '100vh', padding: 'calc(var(--mantine-spacing-md) + 60px) var(--mantine-spacing-md) var(--mantine-spacing-md)' }}>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}
