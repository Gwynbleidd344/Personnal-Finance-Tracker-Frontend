import { getAccessToken } from "./getCookiesToken";

export default async function changePassword(currentPassword: string, newPassword: string) {
    const token = getAccessToken()
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/change-password`, {
            method: "POST",
            mode: 'cors', credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`
            },
            body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            console.error("Erreur backend:", data);
            throw new Error(data?.message || `Échec (${res.status})`);
        }

        return data;
    } catch (error) {
        console.error("Erreur côté frontend:", error);
        throw error;
    }
}
