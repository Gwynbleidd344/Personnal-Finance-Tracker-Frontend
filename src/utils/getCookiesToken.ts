export const getAccessToken = () => {
    return document.cookie?.split("; ")[0]?.split("=")[1] || ''
}
export const getRefreshToken = () => {
    return document.cookie?.split("; ")[1]?.split("=")[1] || ''
}