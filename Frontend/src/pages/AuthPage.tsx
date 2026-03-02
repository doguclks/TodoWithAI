import { useState } from 'react';
import {
    TextInput, PasswordInput, Button, Title,
    Text, Anchor, Stack, Alert, Group, ActionIcon,
    useMantineColorScheme, useComputedColorScheme, Image, Tooltip,
    Box, Flex, Center,
    Container
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { AuthApi } from '../api/AuthApi';
import { useAuth } from '../contexts/AuthContext';
import { useIntl } from 'react-intl';
import { useLocale } from '../LocaleContext';
import { IconAlertCircle, IconSun, IconMoon } from '@tabler/icons-react';

export default function AuthPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [animating, setAnimating] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();
    const intl = useIntl();
    const { locale, setLocale } = useLocale();
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });

    const toggleMode = () => {
        setAnimating(true);
        setTimeout(() => {
            setIsRegister((prev) => !prev);
            setError('');
            setUserName('');
            setEmail('');
            setPassword('');
            setAnimating(false);
        }, 250);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                const response = await AuthApi.register({ userName, email, password });
                login(response.token, response.email, response.userName);
            } else {
                const response = await AuthApi.login({ email, password });
                login(response.token, response.email, response.userName);
            }
            navigate('/');
        } catch (err: any) {
            let errorKey = 'auth.error.generic';

            const errorMessage = err.response?.data?.message || '';
            const status = err.response?.status;

            if (status === 401 || errorMessage.includes('Invalid') || errorMessage.includes('Unauthorized')) {
                errorKey = 'auth.error.invalidCredentials';
            } else if (errorMessage.includes('exists') || errorMessage.includes('duplicate')) {
                errorKey = 'auth.error.userExists';
            }

            setError(intl.formatMessage({ id: errorKey }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex style={{ height: '100vh', overflow: 'hidden' }}>
            {/* Left Side: Mosaic Background */}
            <Box
                visibleFrom="md"
                style={{
                    flex: 1.5,
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)'
                }}
            >
                <Image
                    src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop"
                    style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        opacity: 0.6,
                        filter: 'grayscale(20%)'
                    }}
                />
                <Center
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: '40px',
                        background: 'rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(2px)'
                    }}
                >
                    <Stack align="center" gap="xs">
                        <Title
                            order={1}
                            style={{
                                color: 'white',
                                fontSize: '4.5rem',
                                fontWeight: 900,
                                textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                letterSpacing: '-2px'
                            }}
                        >
                            TickIt!
                        </Title>
                        <Text
                            size="xl"
                            style={{
                                color: 'rgba(255,255,255,0.85)',
                                fontWeight: 500,
                                textAlign: 'center',
                                maxWidth: '500px'
                            }}
                        >
                            {intl.formatMessage({ id: 'dashboard.welcome' })}
                        </Text>
                    </Stack>
                </Center>
            </Box>

            {/* Right Side: Auth Form */}
            <Box
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px',
                    backgroundColor: 'var(--mantine-color-body)'
                }}
            >
                <Container size={400} w="100%">
                    {/* Controls Row */}
                    <Group justify="flex-end" mb="xl" gap="xs">
                        <Tooltip label="Türkçe">
                            <ActionIcon variant={locale === 'tr' ? 'light' : 'subtle'} onClick={() => setLocale('tr')} size="lg" radius="xl">
                                <Image src="https://flagcdn.com/w40/tr.png" w={22} h={22} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="English">
                            <ActionIcon variant={locale === 'en' ? 'light' : 'subtle'} onClick={() => setLocale('en')} size="lg" radius="xl">
                                <Image src="https://flagcdn.com/w40/gb.png" w={22} h={22} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                            </ActionIcon>
                        </Tooltip>
                        <ActionIcon
                            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                            variant="default" size="lg" radius="xl"
                        >
                            {computedColorScheme === 'dark' ? <IconSun size={18} stroke={1.5} /> : <IconMoon size={18} stroke={1.5} />}
                        </ActionIcon>
                    </Group>

                    <Title
                        ta="left"
                        mb="xs"
                        style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                        }}
                    >
                        {isRegister
                            ? intl.formatMessage({ id: 'auth.registerTitle' })
                            : intl.formatMessage({ id: 'auth.loginTitle' })}
                    </Title>

                    <Text c="dimmed" size="sm" ta="left" mb="xl">
                        {isRegister
                            ? intl.formatMessage({ id: 'auth.hasAccount' })
                            : intl.formatMessage({ id: 'auth.noAccount' })}{' '}
                        <Anchor size="sm" component="button" type="button" onClick={toggleMode} style={{ fontWeight: 600 }}>
                            {isRegister
                                ? intl.formatMessage({ id: 'auth.switchToLogin' })
                                : intl.formatMessage({ id: 'auth.switchToRegister' })}
                        </Anchor>
                    </Text>

                    <Box
                        style={{
                            opacity: animating ? 0 : 1,
                            transform: animating ? 'translateX(20px)' : 'translateX(0)',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <form onSubmit={handleSubmit}>
                            <Stack gap="md">
                                {error && (
                                    <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
                                        {error}
                                    </Alert>
                                )}

                                {isRegister && (
                                    <TextInput
                                        label={intl.formatMessage({ id: 'auth.username' })}
                                        placeholder={intl.formatMessage({ id: 'auth.usernamePlaceholder' })}
                                        required
                                        size="md"
                                        radius="md"
                                        value={userName}
                                        onChange={(e) => setUserName(e.currentTarget.value)}
                                    />
                                )}

                                <TextInput
                                    label={intl.formatMessage({ id: 'auth.email' })}
                                    placeholder={intl.formatMessage({ id: 'auth.emailPlaceholder' })}
                                    required
                                    size="md"
                                    radius="md"
                                    value={email}
                                    onChange={(e) => setEmail(e.currentTarget.value)}
                                />

                                <PasswordInput
                                    label={intl.formatMessage({ id: 'auth.password' })}
                                    placeholder={intl.formatMessage({ id: 'auth.passwordPlaceholder' })}
                                    required
                                    size="md"
                                    radius="md"
                                    value={password}
                                    onChange={(e) => setPassword(e.currentTarget.value)}
                                />

                                <Button
                                    fullWidth
                                    size="md"
                                    mt="md"
                                    type="submit"
                                    loading={loading}
                                    color="indigo"
                                    radius="md"
                                >
                                    {isRegister
                                        ? intl.formatMessage({ id: 'auth.register' })
                                        : intl.formatMessage({ id: 'auth.login' })}
                                </Button>
                            </Stack>
                        </form>
                    </Box>
                </Container>
            </Box>
        </Flex>
    );
}
