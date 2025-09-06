import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangePasswordForm from '../components/Settings/ChangePasswordForm';
import ChangeUsernameForm from '../components/Settings/ChangeUsernameForm';
import LanguageToggle from '../components/UI/LanguageToggle';
import ThemeToggle from '../components/UI/ThemeToggle';

import CurrencySettings from '../components/Settings/CurrencySettings';
import DeleteData from "../components/Settings/DeleteData.tsx";
import DeleteAccount from '../components/Settings/DeleteAccount.tsx';

export default function Settings() {
    const [isChangePasswordOpen, setIsChangePasswordOpen] =
        useState<boolean>(false);
    const [isChangeUsernameOpen, setIsChangeUsernameOpen] =
        useState<boolean>(false);

    const { t } = useTranslation();
    const [userSummary, setUserSummary] = useState<{ email: string, createdAt: string }>({ createdAt: '', email: '' })

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, { headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") } }).then(async res => setUserSummary(await res.json())).catch(rej => console.log(rej.message))
    }, [])

    return (
        <div className="mx-auto h-[94vh] overflow-y-scroll rounded-lg bg-gray-100 p-8 shadow-md">
            <h1 className="mb-6 border-b border-gray-300 pb-4 text-3xl font-bold text-gray-800">
                {t('settings_title', 'Settings')}
            </h1>

            <div className='pb-2'>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    {t('general_account_informations', "General account informations")}
                </h2>
                <div className='my-1 bg-gray-50 w-fit min-w-[300px] p-2 px-4 rounded-lg border border-gray-200 flex items-center gap-3'>
                    <h4 className='font-medium text-gray-800 text-[16px]'>Email:</h4><p className='text-gray-600'>{userSummary.email}</p>
                </div>
                <div className='my-1 bg-gray-50 w-fit min-w-[300px] p-2 px-4 rounded-lg border border-gray-200 flex items-center gap-3'>
                    <h4 className='font-medium text-gray-800 text-[16px]'>{t("join_date", "Join Date")}:</h4><p className='text-gray-600'>{new Date(userSummary.createdAt).toLocaleDateString(t("local_date_format","en-US"), { year: "numeric", month: "short", day: "2-digit" })}</p>
                </div>
            </div>

            <div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    {t('managing_account_title', 'Managing Account')}
                </h2>
                <p className="mb-6 text-gray-600">
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
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 transition duration-200 hover:bg-gray-100"
                >
                    <div className="flex items-center gap-3">
                        <i className="bx bx-lock text-xl text-gray-700"></i>
                        <span className="font-medium text-gray-800">
                            {t('change_password', 'Change Password')}
                        </span>
                        <p className="ml-12 text-gray-500">
                            {t(
                                'change_password_description',
                                'Change your password to keep your account safe.',
                            )}
                        </p>
                    </div>
                    <i
                        className={`bx bx-chevron-${isChangePasswordOpen ? 'up' : 'down'
                            } text-xl text-gray-600 transition-transform`}
                    ></i>
                </button>

                <div
                    className={`overflow-hidden transition-all duration-300 ${isChangePasswordOpen
                        ? 'mt-4 max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
                        <ChangePasswordForm />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <button
                    onClick={() =>
                        setIsChangeUsernameOpen(!isChangeUsernameOpen)
                    }
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 transition duration-200 hover:bg-gray-100"
                >
                    <div className="flex items-center gap-3">
                        <i className="bxr bx-user-circle text-xl text-gray-700"></i>
                        <span className="font-medium text-gray-800">
                            {t('change_username', 'Change Username')}
                        </span>
                        <p className="ml-12 text-gray-500">
                            {t(
                                'change_username_description',
                                'You can change you username at any time.',
                            )}
                        </p>
                    </div>
                    <i
                        className={`bx bx-chevron-${isChangeUsernameOpen ? 'up' : 'down'
                            } text-xl text-gray-600 transition-transform`}
                    ></i>
                </button>

                <div
                    className={`overflow-hidden transition-all duration-300 ${isChangeUsernameOpen
                        ? 'mt-4 max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
                        <ChangeUsernameForm />
                    </div>
                </div>
            </div>
            <div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    {t('display_settings_title', 'Display')}
                </h2>
                <p className="mb-6 text-gray-600">
                    {t(
                        'display_settings_description',
                        'Change the display settings of the application.',
                    )}
                </p>
            </div>
            <LanguageToggle />
            <ThemeToggle />

            <CurrencySettings />
            <h2 className="font-semibold text-xl text-gray-900 mt-6 mb-2">
                {t("delete_data_title", "Data Managing")}
            </h2>
            <p className="text-gray-600 ml-1">
                {t(
                    "delete_data_description",
                    "Deleting your data is not reversible."
                )}
            </p>
            <DeleteData />
            <DeleteAccount />
        </div>
    );
}
