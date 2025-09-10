import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import googleLogo from '../assets/Google.png';
import { FaUser, FaLock } from 'react-icons/fa';
import ErrorMessage from '../components/UI/ErrorMessage.tsx';
import LoadingSpinner from '../components/UI/LoadingSpinner.tsx';
import { useTranslation } from 'react-i18next';

export default function LogIn() {
    const { t } = useTranslation();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogIn = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                mode: 'cors', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, rememberMe }),
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error('Réponse non JSON');
            }

            if (res.ok) {
                navigate('/dashboard');
            } else {
                setError(data.message || 'Erreur inconnue');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
                    method: 'POST',
                    mode: 'cors', credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: tokenResponse.access_token }),
                });

                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch {
                    throw new Error('Réponse non JSON');
                }

                if (res.ok) {
                    navigate('/dashboard');
                } else {
                    setError(data.message || 'Erreur inconnue');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur inconnue');
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            setError('Google login failed');
        },
    });

    return (
        <div className="relative flex min-h-screen pt-0 flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
            {error && (
                <div className="absolute bottom-4 left-1/2 w-full max-w-md -translate-x-1/2">
                    <ErrorMessage
                        message={error}
                        onClose={() => setError('')}
                    />
                </div>
            )}

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {t('app_title', 'Personal Finance Tracker')}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {t('login_welcome', 'Welcome back! Please sign in to continue.')}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadow-2xl sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleLogIn}>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t('email_address', 'Email address')}
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaUser className="text-gray-600" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-10 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                    placeholder={t('email_placeholder', 'you@example.com')}
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t('password_label', 'Password')}
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaLock className="text-gray-600" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-10 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                    placeholder={t('password_placeholder', '••••••••')}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    {t('remember_me', 'Remember me')}
                                </label>
                            </div>
                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    {t('forgot_password', 'Forgot your password?')}
                                </a>
                            </div>
                        </div>


                        <div>
                            <button
                                type="submit"
                                className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-neutral-950 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                            >
                                {loading ? <LoadingSpinner /> : t('sign_in', 'Sign in')}
                            </button>
                        </div>
                    </form>


                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                {t('new_to_app', 'New to Personal Finance Tracker?')}
                            </span>
                        </div>
                    </div>


                    <div className="mt-6">
                        <Link to="/signup">
                            <button className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
                                {t('create_account', 'Create an account')}
                            </button>
                        </Link>
                    </div>


                    <div className="mt-4 flex justify-center text-gray-500">
                        <h3>{t('or_with', 'or with')}</h3>
                    </div>
                    <div className="mt-2 flex gap-4">

                        <button
                            onClick={() => googleLogin()}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2 font-semibold text-black transition hover:bg-gray-200 cursor-pointer">
                            <img
                                src={googleLogo}
                                alt="Google Logo"
                                className="h-5 w-5"
                            />
                            {t('google', 'Google')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
