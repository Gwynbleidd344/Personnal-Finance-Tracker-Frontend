import { useState, useEffect } from "react";
import getWindowDimensions from "../utils/GetWindowSize";

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState<{ width: number, height: number }>(getWindowDimensions())

    useEffect(() => {
        window.addEventListener('resize', () => setWindowDimensions(getWindowDimensions()))
        return () => window.removeEventListener('resize', () => setWindowDimensions(getWindowDimensions()))
    })

    return windowDimensions
}