import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "./nav";

const DriverScreenRide = () => {
  const { ride_id } = useParams();
  const navigate = useNavigate();
  const [rideData, setRideData] = useState(null);
  const [passengersData, setPassengersData] = useState([]);
  const [passengersChange, setPassengersChange] = useState(false);
  const [reservation, setReservation] = useState(false);
  const [error, setError] = useState("");
  const [available, setAvailable] = useState(false);
  const [updateScreen, setUpdateScreen] = useState(false);
  const [formData, setFormData] = useState({
    date_start: "",
    time_start: "",
    time_end: "",
    start_dest: "",
    end_dest: "",
    price: "",
  });

  const checkRideAvailability = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/api/driver/checkRide/${ride_id}`,
        config
      );
      if (response.data.success) {
        setAvailable(true);
      } else {
        setError("Ride is no longer active. Please go back.");
      }
    } catch (err) {
      setError("Error checking ride availability");
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
        `http://localhost:5000/api/driver/getPassengers/${ride_id}`,
        config
      );
      if (response.data.success) {
        setPassengersData(response.data.data);
        setPassengersChange(true);
      }
    } catch (err) {
      setError("Error fetching passengers");
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
        await checkRideAvailability();
        const response = await axios.get(
          `http://localhost:5000/api/driver/searchRides/${ride_id}`,
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
        setFormData({
          date_start: date.toISOString().split("T")[0],
          time_start: date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          time_end: end_time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          start_dest: ride.start_dest,
          end_dest: ride.end_dest,
          price: (ride.price_in_cents / 100) * 117,
        });
      } catch (err) {
        setError("Trip canceled, return to the previous screen");
      }
    };
    fetchRideData();
  }, [ride_id, navigate]);

  const handleReservation = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await axios.post(
        "http://localhost:5000/api/private/reserveRide/" + ride_id,
        {},
        config
      );
      if (!response.data.success) setError("Something went wrong");

      if (response.data.success) {
        setReservation(true);
        await getPassengers();
      }
    } catch (err) {
      setError("Error making reservation");
    }
  };

  const cancelReservation = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await axios.delete(
        `http://localhost:5000/api/driver/deleteRide/${ride_id}`,
        config
      );
      if (!response.data.success) setError("Something went wrong");
      if (response.data.success) {
        setAvailable(false);
      }
    } catch (err) {
      setError("Error canceling ride");
    }
  };

  const updateRide = () => {
    setUpdateScreen(true);
  };

  const closeUpdateScreen = () => {
    setUpdateScreen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await axios.put(
        `http://localhost:5000/api/driver/updateRide/${ride_id}`,
        formData,
        config
      );
      if (response.data.success) {
        setRideData({
          ...rideData,
          ...formData,
          date: new Date(formData.date_start),
          start_time: formData.time_start,
          end_time: formData.time_end,
          start_dest: formData.start_dest,
          end_dest: formData.end_dest,
          price: parseFloat(formData.price),
        });
        closeUpdateScreen();
      } else {
        setError("Update failed");
      }
    } catch (err) {
      setError("Error updating ride");
    }
  };

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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-3">
          <Nav />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">
              {rideData.date.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h1>
            <button
              onClick={updateRide}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <img className="w-6 h-6" src="/edit.png" alt="edit" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-bold text-gray-700">Start</h2>
              <p className="text-gray-600">{rideData.start_time}</p>
              <p className="text-gray-600">{rideData.start_dest}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-bold text-gray-700">End</h2>
              <p className="text-gray-600">{rideData.end_time}</p>
              <p className="text-gray-600">{rideData.end_dest}</p>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-700">Price per Passenger</h2>
            <p className="text-2xl font-bold text-blue-500">
              {rideData.price.toFixed(2)} RSD
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-700">Driver</h2>
            <div className="flex items-center">
              <img className="w-10 h-10 rounded-full" src="/acc_pic.png" alt="Driver" />
              <p className="ml-4 text-gray-700">{rideData.first_name}</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-700">Passengers</h2>
            <div className="mt-4 space-y-4">
              {passengersChange &&
                passengersData.map((passenger, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gray-100 rounded-lg"
                  >
                    <img
                      className="w-8 h-8 rounded-full"
                      src="/acc_pic.png"
                      alt="Passenger"
                    />
                    <p className="ml-4 text-gray-700">{passenger.first_name}</p>
                  </div>
                ))}
            </div>
          </div>
          <div className="mt-6">
            {available ? (
              <button
                onClick={cancelReservation}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow hover:bg-red-600 transition-colors duration-200"
              >
                Cancel Ride
              </button>
            ) : (
              <button className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg shadow cursor-not-allowed">
                Ride Cancelled
              </button>
            )}
          </div>
        </div>
      </main>
      {updateScreen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2 lg:w-1/3 relative">
              <button
                className="absolute top-2 right-2 text-2xl font-bold text-gray-700"
                onClick={closeUpdateScreen}
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-4">Update Ride Details</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-700">Departure Date</label>
                  <input
                    type="date"
                    name="date_start"
                    value={formData.date_start}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Departure Time</label>
                  <input
                    type="time"
                    name="time_start"
                    value={formData.time_start}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">End Time</label>
                  <input
                    type="time"
                    name="time_end"
                    value={formData.time_end}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Start Destination</label>
                  <input
                    type="text"
                    name="start_dest"
                    value={formData.start_dest}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">End Destination</label>
                  <input
                    type="text"
                    name="end_dest"
                    value={formData.end_dest}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Price per Passenger</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-200"
                  >
                    Update Ride
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DriverScreenRide;
