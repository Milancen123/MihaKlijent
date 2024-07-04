import React, { useState } from "react";
import axios from "axios";
import Nav from "./nav";

const DriverPrivateScreen = () => {
  const [numSeats, setNumSeats] = useState(1);
  const [priceInCents, setPriceInCents] = useState(0);
  const [startDest, setStartDest] = useState("");
  const [endDest, setEndDest] = useState("");
  const [startTime, setStartTime] = useState("");
  const [dateOfDepart, setDateOfDepart] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const convertedPriceInCents = parseInt((parseFloat(priceInCents) / 117) * 100);
    if (isNaN(convertedPriceInCents)) {
      setError("Invalid price value");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await axios.post(
        "http://localhost:5000/api/driver/ride",
        {
          numSeats,
          priceInCents: convertedPriceInCents,
          startDest,
          endDest,
          startTime,
          dateOfDepart,
          estimatedTime,
        },
        config
      );
      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setError("There was an error submitting the form");
    }
  };

  const resetForm = () => {
    setNumSeats(1);
    setPriceInCents(0);
    setStartDest("");
    setEndDest("");
    setStartTime("");
    setDateOfDepart("");
    setEstimatedTime("");
    setError("");
    setSubmitted(false);
  };

  const showSuccessMessage = () => {
    return (
      <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
        Voznja je uspešno objavljena!
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-3xl w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <Nav tab="driver" />
        <h1 className="text-3xl font-bold text-center mb-6">Dodaj novu vožnju</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="numSeats" className="block text-sm font-medium text-gray-700">
                Broj slobodnih mesta
              </label>
              <input
                type="number"
                id="numSeats"
                value={numSeats}
                onChange={(e) => setNumSeats(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="priceInCents" className="block text-sm font-medium text-gray-700">
                Cena (RSD)
              </label>
              <input
                type="text"
                id="priceInCents"
                value={priceInCents}
                onChange={(e) => setPriceInCents(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="startDest" className="block text-sm font-medium text-gray-700">
                Idem iz
              </label>
              <input
                type="text"
                id="startDest"
                value={startDest}
                onChange={(e) => setStartDest(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="endDest" className="block text-sm font-medium text-gray-700">
                Idem u
              </label>
              <input
                type="text"
                id="endDest"
                value={endDest}
                onChange={(e) => setEndDest(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Vreme polaska
              </label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="dateOfDepart" className="block text-sm font-medium text-gray-700">
                Datum polaska
              </label>
              <input
                type="date"
                id="dateOfDepart"
                value={dateOfDepart}
                onChange={(e) => setDateOfDepart(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700">
                Vreme trajanja putovanja
              </label>
              <input
                type="text"
                id="estimatedTime"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Objavi vožnju
            </button>
          </div>
          {submitted && showSuccessMessage()}
        </form>
      </div>
    </div>
  );
};

export default DriverPrivateScreen;
