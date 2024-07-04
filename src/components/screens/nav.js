import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Nav = ({ tab }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRotated, setRotated] = useState(false);

  const handleArrowClick = () => {
    setIsVisible(!isVisible);
    setRotated(!isRotated);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    if (!!localStorage.getItem("authToken")) {
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  };

  const redirectPutovanja = () => {
    if (!!localStorage.getItem("authToken")) {
      if(tab==='passenger'){
        navigate("/history");
      }else{
        navigate("/driver_history");
      }
    }
  };
  
  const redirectSettings = ()=> {
    if (!!localStorage.getItem("authToken")) {
      navigate("/settings");
    }
  }
  return (
    <nav className="w-full flex flex-row flex-wrap py-4 bg-gray-800 text-white">
      <div className="flex flex-1 items-center">
        <img
          alt="logo_image"
          className="w-10 h-10 rounded-full"
          src="/logo.jpg"
        />
        <h1 className="text-2xl font-bold ml-2">CarShare</h1>
      </div>
      <div className="flex flex-1 justify-end relative items-center">
        <img alt="acc_image" className="w-10 h-10 rounded-full" src="/acc_pic.png" />
        <img
          alt="arrow_down"
          className={`w-8 h-8 ml-2 transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`}
          src="/arrow-down.png"
          onClick={handleArrowClick}
        />
        {isVisible && (
          <div className="absolute top-14 right-0 w-48 bg-white shadow-lg text-gray-800 mt-2 rounded-lg z-50">
            {tab === "passenger" ? (
              <div
                onClick={redirectPutovanja}
                className="flex items-center py-2 px-4 hover:bg-gray-100 cursor-pointer"
              >
                <img alt="settings" className="w-6 h-6 mr-2" src="/history.png" />
                <p>Trips</p>
              </div>
            ) : (
              <div
                onClick={redirectPutovanja}
                className="flex items-center py-2 px-4 hover:bg-gray-100 cursor-pointer"
              >
                <img alt="settings" className="w-6 h-6 mr-2" src="/history.png" />
                <p>All Rides</p>
              </div>
            )}
            <div onClick={redirectSettings} className="flex items-center py-2 px-4 hover:bg-gray-100 cursor-pointer">
              <img alt="settings" className="w-6 h-6 mr-2" src="/settings.png" />
              <p>Settings</p>
            </div>
            <div
              className="flex items-center py-2 px-4 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              <img alt="logout" className="w-6 h-6 mr-2" src="/logout.png" />
              <p>Logout</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
