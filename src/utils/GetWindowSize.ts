export default function getWindowDimensions() {
    const { innerWidth, innerHeight } = window
    return {
        width: innerWidth,
        height: innerHeight
    }
}