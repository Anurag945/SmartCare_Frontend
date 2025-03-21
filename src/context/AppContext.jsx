import { createContext, useEffect, useState, useMemo } from "react";
import doctorsData from "../assets/doc"; // Import local JSON data

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || false);
  const [userData, setUserData] = useState(false);

  // Function to load doctors data from JSON
  const getDoctorsData = () => {
    if (doctorsData && Array.isArray(doctorsData)) {
      setDoctors(doctorsData); // ✅ Directly setting doctors list
    } else {
      console.error("Failed to load doctors: Invalid data format");
    }
  };

  // Load doctors data on component mount
  useEffect(() => {
    getDoctorsData();
  }, []);

  // Simulate user data based on token status
  useEffect(() => {
    if (token) {
      setUserData({
        id: "123",
        name: "John Doe",
        email: "johndoe@example.com",
      });
    } else {
      setUserData(false);
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      doctors,
      getDoctorsData,
      currencySymbol,
      token,
      setToken,
      userData,
      setUserData,
    }),
    [doctors, token, userData]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
