import React, { createContext, useState, useEffect } from "react";

import { url } from "./../../helpers/url.js";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PagosContext = createContext();

export const PagosProvider = ({ children }) => {
  const [verPagos, setVerPagos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoNoEncontrado, setProductoNoEncontrado] = useState(false);

  //VENTAS
  const [ventasResumidas, setVentasResumidas] = useState([]);

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
      if (error.response) {
        // Error de respuesta de la API (404, 500, etc.)
        console.log(
          "Error de la API:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        // Error de la solicitud (por ejemplo, no se pudo conectar al servidor)
        console.log("Error en la solicitud:", error.request);
      } else {
        // Otro tipo de error
        console.log("Error desconocido:", error.message);
      }
    }
  };

  // Función para cargar los pagos desde el servidor
  const cargarPagosCodigo = async (codigo) => {
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

      const respuesta = await axios.get(
        `${url}/verPagosCodigoVenta/${adminId}/${codigo}`
      );

      const resultadoVerPagos = respuesta.data.data;
      setVerPagos(resultadoVerPagos);
    } catch (error) {
      if (error.response) {
        // Error de respuesta de la API (404, 500, etc.)
        console.log(
          "Error de la API:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        // Error de la solicitud (por ejemplo, no se pudo conectar al servidor)
        console.log("Error en la solicitud:", error.request);
      } else {
        // Otro tipo de error
        console.log("Error desconocido:", error.message);
      }
    }
  };

  //PRODUCTOS

  //FUNCION CARGAR PRODUCTOS
  const cargarProductos = async () => {
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
      const respuesta = await axios.get(`${url}/cargarProductos/${adminId}`);
      const resultadoProductos = respuesta.data.resultado;
      setProductos(resultadoProductos);
      setProductoNoEncontrado(false);
    } catch (error) {
      console.log("Error al cargar Productos", error);
    }
  };

  //VENTAS

  //FUNCION CARGAR VENTAS
  const cargarVentas = async () => {
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
      const respuesta = await axios.get(`${url}/infoResum/${adminId}`);
      const resultadoVentasResumidas = respuesta.data.response;
      setVentasResumidas(resultadoVentasResumidas);
    } catch (error) {
      console.log("Error al cargar Ventas", error);
    }
  };

  // Efecto para cargar los pagos al iniciar el contexto
  useEffect(() => {
    cargarPagos();
    cargarProductos();
    cargarVentas();
  }, []);

  return (
    <PagosContext.Provider
      value={{
        verPagos,
        cargarPagos,
        setVerPagos,
        cargarPagosCodigo,
        productos,
        setProductos,
        cargarProductos,
        productoNoEncontrado,
        setProductoNoEncontrado,
        ventasResumidas,
        setVentasResumidas,
        cargarVentas
      }}
    >
      {children}
    </PagosContext.Provider>
  );
};
