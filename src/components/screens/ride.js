import React from 'react';
import { useNavigate } from 'react-router-dom';

const Ride = ({ id, start_dest, end_dest, first_name, price, start_time, end_time }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/ride/${id}`);
    }
    return (
        <div onClick={handleClick} className='flex flex-col md:flex-row items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md w-full'>
            <div className='flex flex-col md:flex-row items-center gap-4'>
                <div className='flex flex-col items-center md:items-start'>
                    <h2 className='text-lg font-bold'>{start_dest} to {end_dest}</h2>
                    <p className='text-gray-700'>{start_time} - {end_time}</p>
                </div>
                <div className='flex flex-col items-center md:items-start'>
                    <p className='text-gray-800'>Driver: {first_name}</p>
                    <p className='text-green-600 font-bold'>${price.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}

export default Ride;
