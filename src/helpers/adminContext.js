import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

  const [adminExists, setAdminExist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const respuesta = await axios.get("http://192.168.3.61:8800/vAdmin");
        setAdminExist(respuesta.data.adminExists);
      } catch (error) {
        
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  return (
    <AdminContext.Provider value={{ adminExists, setAdminExist, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};
