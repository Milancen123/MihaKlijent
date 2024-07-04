import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "./nav";

const PrivateScreenRide = ({ tab }) => {
  const { ride_id } = useParams();
  const navigate = useNavigate();
  const [rideData, setRideData] = useState(null);
  const [passengersData, setPassengersData] = useState([]);
  const [passengersChange, setPassengersChange] = useState(false);
  const [reservation, setReservation] = useState(false);
  const [error, setError] = useState("");

  const checkReservation = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/api/private/checkReservation/${ride_id}`,
        config
      );
      if (response.data.success) {
        setReservation(response.data.reserved);
      }
    } catch (err) {
      setError("Error checking reservation status");
    }
  };

  const getPassengers = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/api/private/getPassengers/${ride_id}`,
        config
      );
      if (response.data.success) {
        setPassengersData(response.data.data);
        setPassengersChange(true);
      }
    } catch (err) {
      setError("Error fetching passengers data");
    }
  };

  useEffect(() => {
    const fetchRideData = async () => {
      if (!localStorage.getItem("authToken")) {
        navigate("/login");
        return;
      }
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

        await checkReservation();
        const response = await axios.get(
          `http://localhost:5000/api/private/searchRides/${ride_id}`,
          config
        );

        await getPassengers();

        const ride = response.data.data;
        const date = new Date(ride.date_of_depart);
        const estimatedTimeParts = ride.estimated_time.split(":");
        const estimatedHours = parseInt(estimatedTimeParts[0]);
        const estimatedMinutes = parseInt(estimatedTimeParts[1]);

        const end_time = new Date(date);
        end_time.setHours(end_time.getHours() + estimatedHours);
        end_time.setMinutes(end_time.getMinutes() + estimatedMinutes);

        const processedRide = {
          ...ride,
          date: date,
          start_time: date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          end_time: end_time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: (ride.price_in_cents / 100) * 117,
        };

        setRideData(processedRide);
      } catch (err) {
        setError("Error fetching ride data");
      }
    };
    fetchRideData();
  }, [ride_id, navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!rideData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const handleReservation = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await axios.post(
        `http://localhost:5000/api/private/reserveRide/${ride_id}`,
        {},
        config
      );
      if (response.data.success) {
        setReservation(true);
        await getPassengers();
      } else {
        setError("Something went wrong with the reservation");
      }
    } catch (err) {
      setError("Error making reservation");
    }
  };

  const otkaziRezervaciju = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await axios.post(
        `http://localhost:5000/api/private/cancelRide/${ride_id}`,
        {},
        config
      );
      if (response.data.success) {
        setReservation(false);
        await getPassengers();
      } else {
        setError("Something went wrong with the cancellation");
      }
    } catch (err) {
      setError("Error cancelling reservation");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3">
          <Nav tab="passenger"/>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-6 py-12 flex flex-col items-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {rideData.date.toLocaleDateString("sr-RS", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700">Start</h2>
              <p className="text-gray-600">{rideData.start_time}</p>
              <p className="text-gray-600">{rideData.start_dest}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700">End</h2>
              <p className="text-gray-600">{rideData.end_time}</p>
              <p className="text-gray-600">{rideData.end_dest}</p>
            </div>
          </div>
          <div className="text-left mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Price per Passenger</h2>
            <p className="text-2xl font-bold text-blue-500">
              {rideData.price.toFixed(2)} RSD
            </p>
          </div>
          <div className="flex items-center mb-6">
            <img className="w-10 h-10 rounded-full mr-4" src="/acc_pic.png" alt="Driver" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Driver</h2>
              <p className="text-gray-600">{rideData.first_name}</p>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Passengers</h2>
            <div className="space-y-4">
              {passengersChange &&
                passengersData.map((passenger, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gray-100 rounded-lg"
                  >
                    <img className="w-8 h-8 rounded-full mr-4" src="/acc_pic.png" alt="Passenger" />
                    <p className="text-gray-700">{passenger.first_name}</p>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex justify-center">
            {reservation ? (
              <button
                onClick={otkaziRezervaciju}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow hover:bg-red-600 transition-colors duration-200"
              >
                Cancel Reservation
              </button>
            ) : (
              <button
                onClick={handleReservation}
                className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg shadow hover:bg-cyan-600 transition-colors duration-200"
              >
                Reserve Ride
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivateScreenRide;
