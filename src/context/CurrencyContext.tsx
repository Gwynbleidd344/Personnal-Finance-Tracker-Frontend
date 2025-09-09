import { createContext, useState } from 'react';

export const CurrencyContext = createContext({
    currency: 'EUR',
    setCurrency: (_: string) => {},
});

type Props = {
    children: React.ReactNode;
};

export const CurrencyProvider = ({ children }: Props) => {
    const [currencyValue, setCurrencyValue] = useState<string>(() => {
        try {
            const stored = localStorage.getItem('currency');
            return stored || 'EUR';
        } catch (e) {
            return 'EUR';
        }
    });

    const setCurrency = (c: string) => {
      localStorage.setItem('currency', c);
        
        setCurrencyValue(c);
    };

    return (
        <CurrencyContext.Provider value={{ currency: currencyValue, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};
