export default async function handleRequestError(
    response: Response,
    customFailMessage?: string,
) {
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error?.error || error?.message || customFailMessage || "An error occured")
    }
    return response
}