import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from './nav';

const PassengerSettings = ({ history }) => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    }
    const fetchUserData = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };

      try {
        const { data } = await axios.get('http://localhost:5000/api/private/user', config);
        setUser(data.data);
      } catch (error) {
        localStorage.removeItem('authToken');
        setError('You are not authorized, please login again');
        history.push('/login');
      }
    };

    fetchUserData();
  }, [history]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    };
    try {
      await axios.put('http://localhost:5000/api/private/user', user, config);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white border-b-2 border-gray-200">
        <Nav tab="passenger" />
      </header>
      <section className="flex items-center justify-center mt-10">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-4 text-center">Settings</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={user.first_name || ''}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={user.last_name || ''}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password || ''}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </section>
    </div>
  );
};

export default PassengerSettings;
