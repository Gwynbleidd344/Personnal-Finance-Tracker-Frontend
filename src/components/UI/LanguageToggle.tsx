import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
    const { i18n, t } = useTranslation();
    const [language, setLanguage] = useState<string>(localStorage.getItem("appLanguage") || i18n.language || "en");

    const toggleLanguage = () => {
        const newLang = language === "en" ? "fr" : "en";
        i18n.changeLanguage(newLang);
        setLanguage(newLang);
        localStorage.setItem("appLanguage", newLang);
    };

    return (
        <div>
            <h2 className="font-semibold text-xl mt-6 text-gray-900 dark:text-gray-100 mb-2">
                {t("change_language", "Change Language")}
            </h2>
            <p className="text-gray-400 mb-6">
                {t("language_preference", "Choose in which language you are more comfortable.")}
            </p>
            <div className="flex items-center gap-3">
                <span className={`font-medium transition ${language === "fr" ? "text-gray-900 dark:text-gray-300" : "text-gray-500"}`}>FR</span>

                <button
                    onClick={toggleLanguage}
                    className={`w-14 h-8 flex items-center cursor-pointer rounded-full p-1 relative transition-colors duration-300 focus:outline-none bg-blue-500`}
                >
                    <div
                        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${language === "en" ? "translate-x-6" : "translate-x-0"
                            }`}
                    ></div>
                </button>

                <span className={`font-medium transition ${language === "en" ? "text-gray-900 dark:text-gray-300" : "text-gray-500"}`}>EN</span>
            </div>
        </div>
    );
}
