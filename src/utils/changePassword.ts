export default async function changePassword(currentPassword: string, newPassword: string) {
    try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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
