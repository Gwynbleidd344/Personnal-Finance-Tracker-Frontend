import { createContext, useState } from 'react';

export const CurrencyContext = createContext({
    currency: 'EUR',
    setCurrency: (_: string) => {},
});

type Props = {
    children: React.ReactNode;
};

export const CurrencyProvider = ({ children }: Props) => {
    const [currency, setCurrency] = useState('EUR');

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};
