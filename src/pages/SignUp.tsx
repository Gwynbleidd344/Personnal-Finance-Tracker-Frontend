import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/UI/ErrorMessage.tsx';
import LoadingSpinner from '../components/UI/LoadingSpinner.tsx';
import { useTranslation } from 'react-i18next';

export default function SignUp() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        localStorage.setItem('username', username);
        console.log(localStorage.getItem('username'));

        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 201) {
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setError('');
                navigate('/login');
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Erreur inconnue');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
            setLoading(false);
        } finally {
            clearTimeout(timeout);
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
            {error && (
                <ErrorMessage message={error} onClose={() => setError('')} />
            )}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {t('signup_title', 'Create your account')}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {t('or_text', 'Or')} {' '}
                    <Link
                        to="/login"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        {t('sign_in_existing', 'sign in to your existing account')}
                    </Link>
                </p>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadow-2xl sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSignUp}>
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t('username_label', 'Username')}
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder={t('username_placeholder', 'John Doe')}
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t('email_address', 'Email address')}
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder={t('email_placeholder', 'you@example.com')}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    {t('password_label', 'Password')}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    {showPassword ? t('hide', 'Hide') : t('show', 'Show')}
                                </button>
                            </div>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder={t('password_placeholder', '••••••••')}
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t('confirm_password', 'Confirm Password')}
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder={t('password_placeholder', '••••••••')}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                            >
                                {loading ? <LoadingSpinner /> : t('sign_up_button', 'Sign up')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
