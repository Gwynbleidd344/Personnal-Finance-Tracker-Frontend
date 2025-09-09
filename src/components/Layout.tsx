import { Outlet } from 'react-router-dom';
import NavBar from './Dashboard/NavBar';
import useWindowDimensions from '../hooks/useWindowDimensions';

export default function Layout() {
    const { width } = useWindowDimensions()
    const isWideViewPort = () => width > 1024

    return (
        <div className={`flex ${isWideViewPort() ? "flex-row" : "flex-col"} min-h-screen bg-gray-300 dark:bg-gray-900`}>
            <NavBar />
            <main className="flex-1 mt-4 px-4">
                <Outlet />
            </main>
        </div>
    );
}
