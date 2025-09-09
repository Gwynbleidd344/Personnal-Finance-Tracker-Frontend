import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export default function NavBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [username] = useLocalStorage('username', 'User');
    const { t } = useTranslation();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const { width } = useWindowDimensions()
    const isWideViewPort = () => width > 1024

    const textAnimation = (extraClasses = '') =>
        `transition-all duration-300 delay-150 transform ${isExpanded
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-2'
        } ${extraClasses}`;

    const baseItemClasses =
        'flex cursor-pointer items-center space-x-2 pl-1 py-1 rounded-lg transition-colors duration-200';

    const itemColors = {
        dashboard: {
            bg: 'bg-black dark:bg-white',
            text: 'text-gray-100 dark:text-black',
            hover: 'hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black',
        },
        incomes: {
            bg: 'bg-emerald-400 dark:bg-emerald-800',
            text: 'text-emerald-800 dark:text-emerald-200',
            hover: 'hover:bg-emerald-400 dark:hover:bg-emerald-900 hover:text-emerald-800 dark:hover:text-emerald-100',
        },
        expenses: {
            bg: 'bg-red-400 dark:bg-red-800',
            text: 'text-red-900 dark:text-red-200',
            hover: 'hover:bg-red-400 dark:hover:bg-red-900 hover:text-red-900 dark:hover:text-red-100',
        },
        categories: {
            bg: 'bg-indigo-300 dark:bg-indigo-800',
            text: 'text-indigo-700 dark:text-indigo-100',
            hover: 'hover:bg-indigo-200 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-100',
        },
        settings: {
            bg: 'bg-gray-500 dark:bg-gray-950',
            text: 'text-white dark:text-white',
            hover: 'hover:bg-gray-500 dark:hover:bg-gray-950 hover:text-white dark:hover:text-white',
        },
        support: {
            bg: 'bg-sky-300 dark:bg-sky-800',
            text: 'text-sky-700 dark:text-sky-100',
            hover: 'hover:bg-sky-200 dark:hover:bg-sky-900 hover:text-sky-600 dark:hover:text-sky-100',
        },
    };

    const getItemClasses =
        (key: keyof typeof itemColors) =>
            ({ isActive }: { isActive: boolean }) => {
                if (hoveredItem && hoveredItem !== key) {
                    return `${baseItemClasses} ${itemColors[key].hover}`;
                }
                return isActive
                    ? `${baseItemClasses} ${itemColors[key].bg} ${itemColors[key].text}`
                    : `${baseItemClasses} ${itemColors[key].hover}`;
            };

    return (
        <nav
            className={`sticky top-0 left-0 m-4 mr-0 flex ${isWideViewPort() ? 'flex-col h-[96vh]  p-6' : 'flex-row w-[calc(100%-32px)] ml-4 p-3 items-center'} justify-between rounded-lg bg-gray-100 shadow-md transition-all duration-300 dark:bg-gray-800 ${isExpanded ? 'w-64' : 'w-20'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Header */}
            {isWideViewPort() ? (<div className="flex flex-col items-center gap-3">
                <i className="bxr bx-user rounded-full border-4 border-b-blue-600 p-2 text-3xl text-gray-800 dark:text-white"></i>
                <span
                    className={`${textAnimation('text-xl font-medium text-gray-800 dark:text-white')}`}
                >
                    {username}
                </span>
            </div>) : <div></div>}

            {/* Links */}
            <div className={`flex ${isWideViewPort() ? 'flex-col mt-4 gap-2' : 'flex-row items-center gap-4'} font-medium text-gray-700 dark:text-gray-200`}>
                {(
                    [
                        'dashboard',
                        'incomes',
                        'expenses',
                        'categories',
                        'settings',
                        'support',
                    ] as const
                ).map((key) => (
                    <NavLink
                        key={key}
                        to={`/${key}`}
                        className={getItemClasses(key)}
                        onMouseEnter={() => setHoveredItem(key)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <i
                            className={`bxr bx-${
                                key === 'dashboard'
                                    ? 'pie-chart-alt'
                                    : key === 'incomes'
                                      ? 'wallet-note'
                                      : key === 'expenses'
                                        ? 'dollar-circle'
                                        : key === 'categories'
                                          ? 'folder'
                                          : key === 'settings'
                                            ? 'cog'
                                            : 'message-question-mark'
                                } text-2xl mr-1`}
                        ></i>
                        {isWideViewPort() && (<span className={`${textAnimation("text-nowrap")}`}>{t(key)}</span>)}
                    </NavLink>
                ))}
            </div>

            {/* Footer / Logout */}
            <NavLink
                className={`h-fit items-center`}
                to="/login">
                <div
                    className={`flex ${isWideViewPort() ? 'mt-4' : ''} cursor-pointer text-nowrap items-center space-x-2 text-gray-700 hover:text-red-600 dark:text-gray-200`}
                    onClick={() => localStorage.removeItem('accessToken')}
                >
                    <i className="bxr bx-arrow-out-left-square-half text-2xl"></i>
                    {isWideViewPort() && (<span className={textAnimation('text-xl font-medium')}>
                        {t('logout')}
                    </span>)}
                </div>
            </NavLink>
        </nav>
    );
}
