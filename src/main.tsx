import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom';

import Layout from './components/Layout';
import Expense from './components/Transaction/Expense.tsx';
import './i18n';
import Categories from './pages/Categories.tsx';
import Dashboard from './pages/Dashboard';
import LogIn from './pages/LogIn';
import Settings from './pages/Settings.tsx';
import SignUp from './pages/SignUp';
import Support from './pages/Support.tsx';
import Income from './components/Transaction/Income.tsx';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: '/', element: <Navigate to="/login" /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/expenses', element: <Expense /> },
            { path: '/incomes', element: <Income /> },
            { path: '/categories', element: <Categories /> },
            { path: '/settings', element: <Settings /> },
            { path: '/support', element: <Support /> },
        ],
    },
    { path: '/login', element: <LogIn /> },
    { path: '/signup', element: <SignUp /> },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <CurrencyProvider >
                <RouterProvider router={router} />
            </CurrencyProvider>
        </GoogleOAuthProvider>
    </StrictMode>,
);
