export const formatCurrency = (amount: any, currency: string, compact: boolean = false) => {
    const n = typeof amount === 'number' ? amount : parseFloat(amount) || 0;

    const toCompact = (value: number) => {
        const abs = Math.abs(value);
        if (abs >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
        if (abs >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (abs >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        return value.toFixed(2).replace(/\.00$/, '');
    };

    if (compact) {
        switch (currency) {
            case 'USD':
                return `$${toCompact(n)} $`;
            case 'MGA':
                return `${toCompact(n)} Ar`;
            case 'EUR':
            default:
                return `${toCompact(n)} €`;
        }
    }

    switch (currency) {
        case 'USD':
            return `$${n.toFixed(2)} $`;
        case 'MGA':
            return `${n.toFixed(2)} Ar`;
        case 'EUR':
        default:
            return `${n.toFixed(2)} €`;
    }
};
