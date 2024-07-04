import React from 'react';
import { useNavigate } from 'react-router-dom';

const RideHistory = ({ id, date, start_dest, start_time, end_dest, end_time, first_name, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === 'passenger') {
      navigate(`/ride/${id}`);
    } else {
      navigate(`/driver/ride/${id}`);
    }
  };

  const getDateClass = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rideDate = new Date(date);
    rideDate.setHours(0, 0, 0, 0);

    if (rideDate.getTime() === today.getTime()) {
      return "bg-green-100 text-green-600";
    } else if (rideDate.getTime() > today.getTime()) {
      return "bg-yellow-100 text-yellow-600";
    } else {
      return "bg-red-100 text-red-600";
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-md ${getDateClass(date)}`}>
          <div className="text-2xl font-bold">{new Date(date).toLocaleDateString("en-US", { day: 'numeric' })}</div>
          <div className="text-sm">{new Date(date).toLocaleDateString("en-US", { month: 'short', year: 'numeric' })}</div>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <p className="font-semibold">{start_dest}</p>
            <p className="text-gray-500">{start_time}</p>
          </div>
          <img className="w-8 h-8" alt="arrow-right" src="arrow-right.png" />
          <div>
            <p className="font-semibold">{end_dest}</p>
            <p className="text-gray-500">{end_time}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-semibold text-lg">{first_name}</span>
        </div>
      </div>
    </div>
  );
};

export default RideHistory;
