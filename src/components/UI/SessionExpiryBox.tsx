import { useEffect, useState } from "react";
import { getAccessToken, getRefreshToken } from "../../utils/getCookiesToken";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"
import { useTranslation } from 'react-i18next'
import ErrorMessage from "./ErrorMessage";

export default function SessionExpiryBox() {
    const [isExpired, setIsExpired] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<boolean>(false)
    const navigate = useNavigate()
    const { t } = useTranslation()

    useEffect(() => {
        try {
            fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                mode: 'cors', credentials: 'include',
                headers: { Authorization: `${getAccessToken()}` },
            })
                .then(res => {
                    if (res.ok) return;
                    else {
                        return setIsExpired(true)
                    }
                })
        } catch (error) {

        }
    }, [])

    const refreshToken = () => {
        try {
            fetch(`${import.meta.env.VITE_API_URL}/api/auth/refreshlogin`, {
                method: 'POST',
                mode: 'cors', credentials: 'include',
            }).then(async (res) => {
                if (res.ok) {
                    setIsExpired(false);
                    navigate(0)
                } else {
                    setIsExpired(false)
                    setErrorMessage(true)
                }
            })
        } catch (error: any) {
            console.log(error.message)
        }
    }

    if (errorMessage) return <ErrorMessage message={getRefreshToken() ? t("refresh_error_with_token", "Failed to refresh. Logging out") : t("refresh_error_no_token", "No refresh token. Logging out")} onClose={() => navigate("/")} />

    if (isExpired) return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="z-100 text-[15px] fixed bottom-5 right-5 p-1.5 pl-3 shadow-md rounded-xl flex items-center justify-between w-fit max-w-[250px] gap-2  bg-red-600 h-fit">
            <h4 className="font-medium text-white">{t("session_expired", "Session expired")}</h4>
            <motion.button
                type="button"
                className="w-fit h-fit rounded-lg py-1 px-2 shadow-md bg-white text-gray-800 font-[600]"
                whileHover={{ scale: 1.05 }}
                onClick={refreshToken}>{t("refresh", "Refresh")}</motion.button>
        </motion.div>
    )
}