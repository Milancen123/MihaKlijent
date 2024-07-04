import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from './nav';
import SearchBar from './search_bar';
import Ride from './ride';

const PrivateScreen = ({ history }) => {
    const [error, setError] = useState("");
    const [privateData, setPrivateData] = useState("");
    const [rideData, setRideData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (start_dest, end_dest, num_seats, date) => {
        setLoading(true);
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            }
        }
        try {
            const response = await axios.post("http://localhost:5000/api/private/searchRides",
                { start_dest, end_dest, num_seats, date },
                config
            );
            const processedRides = response.data.data.map(ride => {
                const date = new Date(ride.date_of_depart);
                const estimatedTimeParts = ride.estimated_time.split(':');
                const estimatedHours = parseInt(estimatedTimeParts[0]);
                const estimatedMinutes = parseInt(estimatedTimeParts[1]);

                const end_time = new Date(date);
                end_time.setHours(end_time.getHours() + estimatedHours);
                end_time.setMinutes(end_time.getMinutes() + estimatedMinutes);

                return {
                    ...ride,
                    date: date,
                    start_time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    end_time: end_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    price: (ride.price_in_cents / 100) * 117
                };
            });
            setRideData(processedRides);

        } catch (err) {
            console.error(err);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            history.push("/login");
        }
        const fetchPrivateDate = async () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            }

            try {
                const { data } = await axios.get("http://localhost:5000/api/private", config);
                console.log(data);
                setPrivateData(data.data);
            } catch (error) {
                localStorage.removeItem("authToken");
                setError("You are not authorized please login")

            }
        }

        fetchPrivateDate();
    }, [history]);


    const isSameDay = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    const isTommorow = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            (date1.getDate() + 1) === date2.getDate()
        );
    }

    return (
        error ? (<span>Something Broke</span>) : (
            <div className='bg-white min-h-screen'>
                <header className='flex flex-col justify-center bg-gray-900 text-white'>
                    <section className="flex flex-col max-w-6xl mx-auto py-6">
                        <Nav tab="passenger"/>
                        <SearchBar handleSubmit={handleSubmit} />
                    </section>
                </header>
                <section className='flex-1 flex flex-col gap-8 max-w-6xl mx-auto p-4'>
                {loading ? (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="loader"></div>
                        </div>
                    ) : (
                        rideData.length === 0 ? (
                            <div className='flex flex-col items-center mt-20 text-2xl'>

                                <h1>No search results</h1>
                            </div>
                        ) : (
                            <div className='mb-8'>
                                <h1 className='text-xl font-bold'>{isSameDay(new Date(rideData[0].date), new Date()) ? "Today" : (isTommorow(new Date(rideData[0].date), new Date()) ? "Tomorrow" : rideData[0].date.toLocaleDateString())}</h1>
                                <div className='flex items-center mt-2'>
                                    <p className='text-lg'>{rideData[0].start_dest}</p>
                                    <img className='w-4 h-4 mx-2' alt="arrow_right" src='arrow-right.png' />
                                    <p className='text-lg'>{rideData[0].end_dest} :</p>
                                </div>
                                <p className='text-lg mt-2'>{rideData.length} {rideData.length === 1 ? "ride available" : (rideData.length > 4 ? "rides available" : "rides available") }</p>
                            </div>
                        )
                    )}
                    
                </section>
                {!loading && (
                    <section className='flex flex-col gap-6 items-center max-w-6xl mx-auto'>
                    {rideData.map((ride, index) => (
                        <Ride
                            key={index}
                            id={ride.id}
                            start_dest={ride.start_dest}
                            end_dest={ride.end_dest}
                            first_name={ride.first_name}
                            price={ride.price}
                            start_time={ride.start_time}
                            end_time={ride.end_time}
                        />
                    ))}
                </section>
                )}
            </div>
        )
    )
}

export default PrivateScreen;
