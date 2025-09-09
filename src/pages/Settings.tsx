import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangePasswordForm from '../components/Settings/ChangePasswordForm';
import ChangeUsernameForm from '../components/Settings/ChangeUsernameForm';
import LanguageToggle from '../components/UI/LanguageToggle';
import ThemeToggle from '../components/UI/ThemeToggle';
import CurrencySettings from '../components/Settings/CurrencySettings';
import DeleteData from "../components/Settings/DeleteData.tsx";
import DeleteAccount from '../components/Settings/DeleteAccount.tsx';
import { getAccessToken } from '../utils/getCookiesToken.ts';

export default function Settings() {
    const [isChangePasswordOpen, setIsChangePasswordOpen] =
        useState<boolean>(false);
    const [isChangeUsernameOpen, setIsChangeUsernameOpen] =
        useState<boolean>(false);

    const { t } = useTranslation();
    const [userSummary, setUserSummary] = useState<{ email: string, createdAt: string }>({ createdAt: '', email: '' });
    const token = getAccessToken()

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
            mode: 'cors', credentials: 'include',
            headers: { Authorization: `${token}` },
        })
            .then(async res => setUserSummary(await res.json()))
            .catch(rej => console.log(rej.message));
    }, []);

    return (
        <div className="mx-auto lg:h-[96vh] h-[calc(96vh-120px)] overflow-y-scroll dark:border-2 dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-900 p-8 shadow-md">
            <h1 className="mb-6 border-b border-gray-300 dark:border-gray-700 pb-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
                {t('settings_title', 'Settings')}
            </h1>

            <div className='pb-2'>
                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {t('general_account_informations', "General account informations")}
                </h2>
                <div className='my-1 bg-gray-50 dark:bg-gray-800 w-[300px] min-w-[150px] max-w-full p-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3'>
                    <h4 className='font-medium text-gray-800 dark:text-gray-100 text-[16px]'>Email:</h4>
                    <p className='text-gray-600 dark:text-gray-400'>{userSummary.email}</p>
                </div>
                <div className='my-1 bg-gray-50 dark:bg-gray-800 w-[300px] min-w-[150px] max-w-full p-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3'>
                    <h4 className='font-medium text-gray-800 dark:text-gray-100 text-[16px]'>{t("join_date", "Join Date")}:</h4>
                    <p className='text-gray-600 dark:text-gray-400'>{new Date(userSummary.createdAt).toLocaleDateString(t("local_date_format", "en-US"), { year: "numeric", month: "short", day: "2-digit" })}</p>
                </div>
            </div>

            <div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {t('managing_account_title', 'Managing Account')}
                </h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                    {t(
                        'managing_account_description',
                        'Change your account settings and preferences.',
                    )}
                </p>
            </div>

            <div className="space-y-2">
                <button
                    onClick={() =>
                        setIsChangePasswordOpen(!isChangePasswordOpen)
                    }
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <div className="flex items-center gap-3">
                        <i className="bx bx-lock text-xl text-gray-700 dark:text-gray-300"></i>
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                            {t('change_password', 'Change Password')}
                        </span>
                        <p className="lg:inline-block hidden ml-12 text-gray-500 dark:text-gray-400">
                            {t(
                                'change_password_description',
                                'Change your password to keep your account safe.',
                            )}
                        </p>
                    </div>
                    <i
                        className={`bx bx-chevron-${isChangePasswordOpen ? 'up' : 'down'
                            } text-xl text-gray-600 dark:text-gray-400 transition-transform`}
                    ></i>
                </button>

                <div
                    className={`overflow-hidden transition-all duration-300 ${isChangePasswordOpen
                        ? 'mt-4 max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="mb-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 shadow-sm">
                        <ChangePasswordForm />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <button
                    onClick={() =>
                        setIsChangeUsernameOpen(!isChangeUsernameOpen)
                    }
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <div className="flex items-center gap-3">
                        <i className="bxr bx-user-circle text-xl text-gray-700 dark:text-gray-300"></i>
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                            {t('change_username', 'Change Username')}
                        </span>
                        <p className="ml-12 lg:inline-block hidden text-gray-500 dark:text-gray-400">
                            {t(
                                'change_username_description',
                                'You can change you username at any time.',
                            )}
                        </p>
                    </div>
                    <i
                        className={`bx bx-chevron-${isChangeUsernameOpen ? 'up' : 'down'
                            } text-xl text-gray-600 dark:text-gray-400 transition-transform`}
                    ></i>
                </button>

                <div
                    className={`overflow-hidden transition-all duration-300 ${isChangeUsernameOpen
                        ? 'mt-4 max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 shadow-sm">
                        <ChangeUsernameForm />
                    </div>
                </div>
            </div>

            <div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {t('display_settings_title', 'Display')}
                </h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                    {t(
                        'display_settings_description',
                        'Change the display settings of the application.',
                    )}
                </p>
            </div>
            <LanguageToggle />
            <ThemeToggle />
            <CurrencySettings />
            <DeleteData />
            <DeleteAccount />
        </div>
    );
}
