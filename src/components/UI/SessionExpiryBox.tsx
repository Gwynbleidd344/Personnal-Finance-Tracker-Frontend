import { useEffect, useState } from "react";
import { getAccessToken } from "../../utils/getCookiesToken";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"

export default function SessionExpiryBox() {
    const [isExpired, setIsExpired] = useState<boolean>(false)
    const navigate = useNavigate()

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
            }).then((res) => { if (res.ok) { setIsExpired(false); navigate(0) } else navigate("/") })
        } catch (error: any) {
            console.log(error.message)
        }
    }

    return isExpired ? (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="z-100 text-[15px] fixed bottom-5 right-5 p-1.5 pl-3 rounded-xl flex items-center justify-between w-full max-w-[250px] gap-1  bg-red-600 h-fit">
            <h4 className="font-medium text-white">Your session expired</h4>
            <button type="button" className="w-fit h-fit rounded-lg py-1 px-2 bg-white text-gray-800 font-medium" onClick={refreshToken}>Refresh</button>
        </motion.div>
    ) : <></>
}