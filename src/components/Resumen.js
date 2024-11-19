import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import axios from "axios";
import { url } from "../helpers/url.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

//NOTIFICACIONES
import * as Notifications from "expo-notifications";
//CALIDAD DE LA RED
import * as Network from "expo-network";

import { PagosContext } from "./Context/pagosContext.js";

import LottieView from "lottie-react-native";

import InfoCard from "./components--/card.js";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";

const Resumen = () => {
  const { verPagos, ventasResumidas, productos, clientes } =
    useContext(PagosContext);

  const [modalPagos, setModalPagos] = useState(false);

  //PUSHEAR NOTIFICACIONES
  const registerForPushNotifications = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();

      if (!networkState.isConnected) {
        console.log("No hay conexión a Internet.");
        return;
      }

      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.log("Permisos de notificación denegados");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;

      if (!token) {
        console.log("No se pudo obtener el token de notificación.");
        return;
      }

      const adminIdString = await AsyncStorage.getItem("adminId");
      const adminId = parseInt(adminIdString, 10);

      if (isNaN(adminId)) {
        console.log("ID de administrador no válido.");
        return;
      }

      const response = await axios.post(`${url}/guardarToken`, {
        administrador_id: adminId,
        token,
      });

      console.log("Respuesta del backend al guardar token:", response.data);

      if (response.status === 200) {
        console.log("Token de notificación registrado con éxito.");
      } else {
        console.log(
          "Error al guardar el token en el backend. Status:",
          response.status
        );
      }
    } catch (error) {
      console.log(
        "Error al registrar el token de notificación:",
        error.response?.data || error.message
      );
    }
  };

  const verificarInventario = async () => {
    try {
      const adminIdString = await AsyncStorage.getItem("adminId");
      const adminId = parseInt(adminIdString, 10);

      if (isNaN(adminId)) {
        console.error("ID de administrador no encontrado o no válido");
        return;
      }

      const response = await axios.post(`${url}/verificarInventario`, {
        id_admin: adminId,
      });

      console.log(
        "Respuesta del backend al verificar inventario:",
        response.data
      );

      if (response.status === 200) {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });
      } else {
        console.log("Error al verificar inventario. Status:", response.status);
      }
    } catch (error) {
      console.error(
        "Error al verificar el inventario:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    registerForPushNotifications();
    verificarInventario();
  }, []);

  return (
    <View style={styles.container}>
      <InfoCard title="Aplicación de Gestión, Control de Ventas y Pagos" />

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <LottieView
          source={require("./../../assets/animation/Animation - 1731902275259.json")} // Ruta a tu archivo de animación
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>

      <Text
        style={{
          marginVertical: 20,
          fontSize: 30,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Resumen de mis Operaciones
      </Text>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <View style={styles.btn}>
          <Text
            style={{
              color: "#000",
              fontSize: 20,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            <MaterialIcons name="payments" size={40} color="green" />
          </Text>
          <Text style={styles.nro}>
            {verPagos.length === 0 ? (
              <Text style={{ fontSize: 12, textTransform: "uppercase" }}>
                Sin pagos
              </Text>
            ) : (
              <Text
                style={{ fontSize: 30, fontWeight: "bold", color: "#333" }}
              >
                {verPagos.length}
              </Text>
            )}
          </Text>
        </View>

        <View style={styles.btn}>
          <Text
            style={{
              color: "#000",
              fontSize: 20,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            <MaterialIcons name="point-of-sale" size={40} color="gray" />
          </Text>
          <Text style={styles.nro}>
            {verPagos.length === 0 ? (
              <Text style={{ fontSize: 12, textTransform: "uppercase" }}>
                Sin Ventas
              </Text>
            ) : (
              <Text
                style={{ fontSize: 30, fontWeight: "bold", color: "#333" }}
              >
                {ventasResumidas.length}
              </Text>
            )}
          </Text>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginTop: 20,
        }}
      >
        <View style={styles.btn}>
          <Text
            style={{
              color: "#000",
              fontSize: 20,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            <FontAwesome5 name="shopping-cart" size={40} color="#ffdb27" />
          </Text>
          <Text style={styles.nro}>
            {productos.length === 0 ? (
              <Text style={{ fontSize: 12, textTransform: "uppercase" }}>
                Sin productos
              </Text>
            ) : (
              <Text
                style={{ fontSize: 30, fontWeight: "bold", color: "#333" }}
              >
                {productos.length}
              </Text>
            )}
          </Text>
        </View>

        <View style={styles.btn}>
          <Text
            style={{
              color: "#000",
              fontSize: 20,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            <Fontisto name="persons" size={40} color="#ffdab9" />
          </Text>
          <Text style={styles.nro}>
            {clientes.length === 0 ? (
              <Text style={{ fontSize: 12, textTransform: "uppercase" }}>
                Sin Clientes
              </Text>
            ) : (
              <Text
                style={{ fontSize: 30, fontWeight: "bold", color: "#333" }}
              >
                {clientes.length}
              </Text>
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  btn: {
    backgroundColor: "#fff",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  nro: {
    fontSize: 30,
    fontWeight: "900",
  },

  tableVentas: {
    width: "90%",
    marginTop: 10,
    borderRadius: 25,
    overflow: "hidden",
    maxHeight: 250,
  },
  item: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: "#000",
    borderBottomWidth: 0.2,
  },
  title: {
    fontSize: 18,
    color: "#fee03e",
    fontWeight: "600",
  },
  fecha: {
    fontSize: 14,
    fontWeight: "300",
  },
  monto: {
    fontSize: 14,
    fontWeight: "800",
  },
});

export default Resumen;
