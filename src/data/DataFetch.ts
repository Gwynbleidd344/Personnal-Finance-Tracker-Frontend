export async function getExpenses() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
            mode: 'cors',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Affiche les données reçues
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        throw error; // re-throw the error so the component can catch it
    }
}