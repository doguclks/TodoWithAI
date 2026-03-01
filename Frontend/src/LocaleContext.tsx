import { createContext, useContext, useState, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import enMessages from './locales/en.json';
import trMessages from './locales/tr.json';

const messages: Record<string, any> = {
    en: enMessages,
    tr: trMessages,
};

interface LocaleContextType {
    locale: string;
    setLocale: (locale: string) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
    // Use browser language as default, fallback to en
    const [locale, setLocale] = useState<string>('tr');

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            <IntlProvider locale={locale} messages={messages[locale]}>
                {children}
            </IntlProvider>
        </LocaleContext.Provider>
    );
};
