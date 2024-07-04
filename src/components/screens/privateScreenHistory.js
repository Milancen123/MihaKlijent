import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "./nav";
import RideHistory from "./rideHistory";

const PrivateScreenHistory = () => {
  const navigate = useNavigate();
  const [rideData, setRideData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        const response = await axios.get(
          `http://localhost:5000/api/private/getRidesByPassengerID`,
          config
        );

        const rides = response.data.data;

        const processedRides = rides.map((ride) => {
          const date = new Date(ride.date_of_depart);
          const estimatedTimeParts = ride.estimated_time.split(":");
          const estimatedHours = parseInt(estimatedTimeParts[0]);
          const estimatedMinutes = parseInt(estimatedTimeParts[1]);

          const end_time = new Date(date);
          end_time.setHours(end_time.getHours() + estimatedHours);
          end_time.setMinutes(end_time.getMinutes() + estimatedMinutes);

          return {
            ...ride,
            date,
            dateString: date.toLocaleDateString(),
            start_time: date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            end_time: end_time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });

        setRideData(processedRides);
        setLoading(false);
      } catch (err) {
        setError("There was an error fetching the ride data");
        setLoading(false);
      }
    };
    fetchRideData();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto py-3">
          <Nav tab="passenger"/>
        </div>
      </header>
      <main className="flex-grow container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Ride History
        </h1>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            {rideData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rideData.map((ride) => (
                  <RideHistory
                    key={ride.id}
                    id={ride.id}
                    date={ride.dateString}
                    start_dest={ride.start_dest}
                    start_time={ride.start_time}
                    end_dest={ride.end_dest}
                    end_time={ride.end_time}
                    first_name={ride.first_name}
                    type="passenger"
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-lg">No rides available</p>
            )}
          </>
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </main>
    </div>
  );
};

export default PrivateScreenHistory;
