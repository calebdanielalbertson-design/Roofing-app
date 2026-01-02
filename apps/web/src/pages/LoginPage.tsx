import { useNavigate } from 'react-router-dom';

export function LoginPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">RoofPro Login</h1>
                <button
                    className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition"
                    onClick={() => navigate('/jobs')}
                >
                    Sign In
                </button>
            </div>
        </div>
    );
}
