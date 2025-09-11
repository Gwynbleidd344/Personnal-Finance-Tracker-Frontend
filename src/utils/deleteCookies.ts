export default function deleteCookies() {
    document.cookie.split("; ")
        .forEach(cookie => document.cookie = cookie.split("=")[0] + "=;expires=" + new Date().toUTCString())
}