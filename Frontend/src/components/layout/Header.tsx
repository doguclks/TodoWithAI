import { Group, Title, ActionIcon, useMantineColorScheme, useComputedColorScheme, Image, Tooltip, Menu, Avatar, Text, Stack, UnstyledButton } from '@mantine/core';
import { IconSun, IconMoon, IconLogout, IconChevronDown } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { useLocale } from '../../LocaleContext';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
    const intl = useIntl();
    const { locale, setLocale } = useLocale();
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });
    const { user, logout } = useAuth();

    return (
        <Group h="100%" px="md" justify="space-between" align="center">
            <Title order={3} className="header-title" style={{ background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {intl.formatMessage({ id: 'app.title', defaultMessage: 'Todo App' })}
            </Title>
            <Group gap="sm">
                <Tooltip label="English">
                    <ActionIcon variant={locale === 'en' ? 'light' : 'subtle'} onClick={() => setLocale('en')} size="lg" radius="xl">
                        <Image src="https://flagcdn.com/w40/gb.png" w={24} h={24} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Türkçe">
                    <ActionIcon variant={locale === 'tr' ? 'light' : 'subtle'} onClick={() => setLocale('tr')} size="lg" radius="xl">
                        <Image src="https://flagcdn.com/w40/tr.png" w={24} h={24} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                    </ActionIcon>
                </Tooltip>
                <ActionIcon onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')} variant="default" size="lg" aria-label="Toggle color scheme" ml="sm">
                    {computedColorScheme === 'dark' ? <IconSun stroke={1.5} /> : <IconMoon stroke={1.5} />}
                </ActionIcon>
                {user && (
                    <Menu shadow="md" width={220} position="bottom-end" transitionProps={{ transition: 'pop-top-right' }}>
                        <Menu.Target>
                            <UnstyledButton p="xs" style={{
                                borderRadius: 'var(--mantine-radius-md)',
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'var(--mantine-color-gray-light)'
                                }
                            }}>
                                <Group gap="sm">
                                    <Avatar color="indigo" radius="xl" size="md" variant="light">
                                        {user.userName.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Stack gap={0} visibleFrom="xs">
                                        <Text size="sm" fw={600} style={{ lineHeight: 1.2 }}>
                                            {user.userName}
                                        </Text>
                                        <Text size="xs" c="dimmed" style={{ lineHeight: 1.2 }}>
                                            {user.email}
                                        </Text>
                                    </Stack>
                                    <IconChevronDown size={14} stroke={1.5} color="var(--mantine-color-dimmed)" />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>{intl.formatMessage({ id: 'auth.hasAccount', defaultMessage: 'User Profile' })}</Menu.Label>
                            <Menu.Divider />
                            <Menu.Item c="red" leftSection={<IconLogout size={16} />} onClick={logout}>
                                {intl.formatMessage({ id: 'app.logout', defaultMessage: 'Logout' })}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                )}
            </Group>
        </Group>
    );
}
