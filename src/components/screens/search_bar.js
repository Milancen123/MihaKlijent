import React, { useState } from 'react';

const SearchBar = ({ handleSubmit }) => {
    const [start_dest, setStartDest] = useState('');
    const [end_dest, setEndDest] = useState('');
    const [num_seats, setNumSeats] = useState('');
    const [date, setDate] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(start_dest, end_dest, num_seats, date);
    }

    return (
        <form onSubmit={onSubmit} className='flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-200 rounded-lg shadow-lg'>
            <div className='flex flex-col md:flex-row gap-4 items-center'>
                <div className='flex flex-col'>
                    <label className='text-gray-800 font-bold' htmlFor='start_dest'>Start Destination</label>
                    <input className='p-2 border border-gray-400 rounded-md' id='start_dest' type='text' value={start_dest} onChange={(e) => setStartDest(e.target.value)} />
                </div>
                <div className='flex flex-col'>
                    <label className='text-gray-800 font-bold' htmlFor='end_dest'>End Destination</label>
                    <input className='p-2 border border-gray-400 rounded-md' id='end_dest' type='text' value={end_dest} onChange={(e) => setEndDest(e.target.value)} />
                </div>
                <div className='flex flex-col'>
                    <label className='text-gray-800 font-bold' htmlFor='num_seats'>Number of Seats</label>
                    <input className='p-2 border text-black border-gray-400 rounded-md' id='num_seats' type='number' value={num_seats} onChange={(e) => setNumSeats(e.target.value)} />
                </div>
                <div className='flex flex-col'>
                    <label className='text-gray-800 font-bold' htmlFor='date'>Date</label>
                    <input className='p-2 border border-gray-400 rounded-md text-black' id='date' type='date' value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>
            <button className='px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-all duration-300' type='submit'>Search</button>
        </form>
    );
}

export default SearchBar;
