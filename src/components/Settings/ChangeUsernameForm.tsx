import { useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'

export default function ChangeUsernameForm() {
    const [username, setUsername] = useLocalStorage('username', '');
    const [inputValue, setInputValue] = useState(username);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setUsername(inputValue);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col max-w-[300px] lg:max-w-1/3">
            <input
                type="text"
                required
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border p-2 rounded mb-4 w-auto"
                placeholder="Your new Username"
            />
            <button
                type="submit"
                className="bg-blue-500 w-fit cursor-pointer active:scale-95 text-white p-2 rounded flex items-center gap-2"
            >
                <i className="bx bx-save"></i>
                Save
            </button>

        </form>
    )
}
