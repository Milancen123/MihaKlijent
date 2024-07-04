import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "./nav";
import RideHistory from "./rideHistory";

const DriverHistoryRidesScreen = () => {
  const navigate = useNavigate();
  const [rideData, setRideData] = useState([]); // Changed initial state to an empty array
  const [loading, setLoading] = useState(true); // Add loading state
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
          `http://localhost:5000/api/driver/getRidesByDriverID`, // Removed the extra slash
          config
        );

        const rides = response.data.data;
        console.log("Rides fetched:", rides);

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
            date, // Keep date as Date object for comparison
            dateString: date.toLocaleDateString(), // Add a string representation for display
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
        setLoading(false); // Set loading to false after data is fetched
        console.log("Processed rides:", processedRides);
      } catch (err) {
        setError("There was an error fetching the ride data");
        setLoading(false); // Set loading to false in case of error
      }
    };
    fetchRideData();
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white px-6">
        <section className="flex flex-col ml-auto mr-auto py-3">
          <Nav tab={"driver"}/>
        </section>
      </header>
      <section className="h-full w-full">
        <h1 className="text-3xl text-center font-bold text-gray-800 py-4">
          Sva putovanja
        </h1>
        {loading ? (
          <div className="flex items-center justify-center mt-62">
            <div className="loader"></div> {/* Loader spinner */}
          </div>
        ) : (
          <>
            {rideData.length > 0 ? (
              rideData.map((ride) => (
                <RideHistory
                  key={ride.id}
                  id={ride.id}
                  date={ride.dateString} // Use the string representation for display
                  start_dest={ride.start_dest}
                  start_time={ride.start_time}
                  end_dest={ride.end_dest}
                  end_time={ride.end_time}
                  first_name={ride.first_name}
                  type="driver"
                />
              ))
            ) : (
              <p className="text-center">No rides available</p>
            )}
          </>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </section>
    </div>
  );
};

export default DriverHistoryRidesScreen;
