import { useTranslation } from "react-i18next";

export default function TermsAndConditions() {
    const { t } = useTranslation();

    return (
        <div className="bg-gray-100 dark:bg-gray-900 shadow-md dark:border-2 dark:border-gray-800 rounded-lg p-8 mx-auto lg:h-[96vh] h-[calc(96vh-120px)] overflow-y-auto">
            <h1 className="m-5 border-b border-gray-300 dark:border-gray-700 p-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {t("terms_title")}
            </h1>

            <section className="mb-6">
                <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 mb-2">
                    {t("terms_intro_title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {t("terms_intro_text")}
                </p>
            </section>

            <section className="mb-6">
                <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 mb-2">
                    {t("user_obligations_title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {t("user_obligations_text")}
                </p>
            </section>

            <section className="mb-6">
                <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 mb-2">
                    {t("privacy_title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {t("privacy_text")}
                </p>
            </section>

            <section className="mb-6">
                <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 mb-2">
                    {t("disclaimer_title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {t("disclaimer_text")}
                </p>
            </section>

            <section className="mb-6">
                <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 mb-2">
                    {t("changes_title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {t("changes_text")}
                </p>
            </section>
        </div>
    );
}
