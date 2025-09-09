import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function GoogleCallback() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    }, [location, navigate]);

    return <div>Loading...</div>;
}
