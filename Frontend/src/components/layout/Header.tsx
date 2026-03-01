import { Group, Title, ActionIcon, useMantineColorScheme, useComputedColorScheme, Image, Tooltip } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { useLocale } from '../../LocaleContext';

export function Header() {
    const intl = useIntl();
    const { locale, setLocale } = useLocale();
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });

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
            </Group>
        </Group>
    );
}
