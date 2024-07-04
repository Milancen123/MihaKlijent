import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginScreen.css";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [tab, setTab] = useState("passenger");

    const handleTabChange = (tab) => {
        setTab(tab);
    }

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            navigate("/");
        }
    }, [navigate]);

    const loginHandler = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password, tab},
                config
            );
            localStorage.setItem("authToken", data.token);
            if(tab === 'passenger'){
                navigate("/");
            }else{
                navigate("/driver");
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-400'>
            <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
                <div className='flex justify-center mb-6'>
                    <button
                        className={`px-4 py-2 rounded-t-lg ${tab === 'passenger' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => handleTabChange('passenger')}
                    >
                        Passenger
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t-lg ${tab === 'driver' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => handleTabChange('driver')}
                    >
                        Driver
                    </button>
                </div>
                <div className='p-4'>
                    {tab === 'passenger' && (
                        <div>
                            <h1 className='text-xl font-bold text-center mb-4'>Login as a Passenger</h1>
                            <form onSubmit={loginHandler}>
                                <input
                                    type='email'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='w-full mb-4 p-2 border border-gray-300 rounded-lg'
                                    required
                                />
                                <input
                                    type='password'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='w-full mb-4 p-2 border border-gray-300 rounded-lg'
                                    required
                                />
                                <button
                                    type='submit'
                                    className='w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200'
                                >
                                    Login
                                </button>
                                <button className='w-full bg-gray-300 text-gray-700 py-2 rounded-lg mt-2 hover:bg-gray-400 transition-colors duration-200'>
                                    Sign Up
                                </button>
                            </form>
                        </div>
                    )}
                    {tab === 'driver' && (
                        <div>
                            <h1 className='text-xl font-bold text-center mb-4'>Login as a Driver</h1>
                            <form onSubmit={loginHandler}>
                                <input
                                    type='email'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='w-full mb-4 p-2 border border-gray-300 rounded-lg'
                                    required
                                />
                                <input
                                    type='password'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='w-full mb-4 p-2 border border-gray-300 rounded-lg'
                                    required
                                />
                                <button
                                    type='submit'
                                    className='w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200'
                                >
                                    Login
                                </button>
                                <button className='w-full bg-gray-300 text-gray-700 py-2 rounded-lg mt-2 hover:bg-gray-400 transition-colors duration-200'>
                                    Sign Up
                                </button>
                            </form>
                        </div>
                    )}
                    {error && <div className='mt-4 text-red-500 text-center'>{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
