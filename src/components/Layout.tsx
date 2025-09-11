import { Outlet } from 'react-router-dom';
import NavBar from './Dashboard/NavBar';
import SessionExpiryBox from './UI/SessionExpiryBox';

export default function Layout() {
    return (
        <div className={`flex flex-col lg:flex-row min-h-screen bg-gray-300 dark:bg-gray-900`}>
            <NavBar />
            <SessionExpiryBox />
            <main className="flex-1 mt-4 px-4">
                <Outlet />
            </main>
        </div>
    );
}
