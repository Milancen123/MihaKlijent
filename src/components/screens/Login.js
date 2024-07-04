import { findByText } from '@testing-library/react';
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


const Login = () => {
    const [tab, setTab] = useState('passenger'); // Initialize state for tab selection
    const [email, setEmail] = useState(''); // Initialize state for email input
    const [password, setPassword] = useState(''); // Initialize state for password input
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleTabChange = (selectedTab) => {
        setTab(selectedTab);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8000/v1/'+ tab + '/login', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password:password,
                }),
            });
            const data = await response.json();
            if(data.status === 'ok') {
                console.log(data);
                login();
                navigate('/123');
            }
            // Handle response data as needed (e.g., redirect, store user session, etc.)
            console.log('Login successful:', data);
        } catch (error) {
            console.error('Error logging in:', error);
            // Handle error (e.g., display error message to user)
        }
    };

    return (
        <div className='flex items-center justify-center w-full h-screen bg-gradient-to-r from-cyan-500 to-blue-500'>
            <div className='flex flex-col bg-white rounded-lg p-8 shadow-lg'>
                <div className='flex mb-4'>
                    <div
                        className={`flex-1 text-center py-2 cursor-pointer ${tab === 'passenger' ? 'bg-red-500 text-white' : 'bg-red-200'}`}
                        onClick={() => handleTabChange('passenger')}
                    >
                        Passenger
                    </div>
                    <div
                        className={`flex-1 text-center py-2 cursor-pointer ${tab === 'driver' ? 'bg-red-500 text-white' : 'bg-red-200'}`}
                        onClick={() => handleTabChange('driver')}
                    >
                        Driver
                    </div>
                </div>
                {tab === 'passenger' && (
                    <div className='flex flex-col items-center'>
                        <h1 className='mb-4'>Login as a passenger</h1>
                        <form className='flex flex-col' onSubmit={handleSubmit}>
                            <input
                                type='email'
                                placeholder='Email'
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500'
                                required
                            />
                            <input
                                type='password'
                                placeholder='Password'
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500'
                                required
                            />
                            <button
                                type='submit'
                                className='bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200'
                            >
                                Login
                            </button>
                            <button className='bg-gray-300 text-gray-700 py-2 rounded-lg mt-2 hover:bg-gray-400 transition-colors duration-200'>
                                SignUp
                            </button>
                        </form>
                    </div>
                )}
                {tab === 'driver' && (
                    <div className='flex flex-col items-center'>
                        <h1 className='mb-4'>Login as a driver</h1>
                        <form className='flex flex-col' onSubmit={handleSubmit}>
                            <input
                                type='email'
                                placeholder='Email'
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500'
                                required
                            />
                            <input
                                type='password'
                                placeholder='Password'
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500'
                                required
                            />
                            <button
                                type='submit'
                                className='bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200'
                            >
                                Login
                            </button>
                            <button className='bg-gray-300 text-gray-700 py-2 rounded-lg mt-2 hover:bg-gray-400 transition-colors duration-200'>
                                SignUp
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
