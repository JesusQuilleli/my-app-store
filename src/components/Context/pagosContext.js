import React, { createContext, useState, useEffect } from 'react';

import {url} from './../../helpers/url.js'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PagosContext = createContext();

export const PagosProvider = ({ children }) => {
  const [verPagos, setVerPagos] = useState([]);
  
  // Función para cargar los pagos desde el servidor
  const cargarPagos = async () => {
    try {
      const adminIdString = await AsyncStorage.getItem("adminId");
      if (adminIdString === null) {
        console.log("ID de administrador no encontrado.");
        return;
      }
      const adminId = parseInt(adminIdString, 10);
      if (isNaN(adminId)) {
        console.log("ID de administrador no es un número válido.");
        return;
      }
      const respuesta = await axios.get(`${url}/verPagos/${adminId}`);
      const resultadoVerPagos = respuesta.data.data;
      setVerPagos(resultadoVerPagos);
    } catch (error) { 
      console.log("Error al cargar Pagos", error);
    }  
  };

  // Efecto para cargar los pagos al iniciar el contexto
  useEffect(() => {
    cargarPagos();
  }, []);

  return (
    <PagosContext.Provider value={{ verPagos, cargarPagos }}>
      {children}
    </PagosContext.Provider>
  );
};