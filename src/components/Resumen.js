import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";

import axios from "axios";
import { url } from "../helpers/url.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

//NOTIFICACIONES
import * as Notifications from "expo-notifications";
//CALIDAD DE LA RED
import * as Network from "expo-network";

import { PagosContext } from "./Context/pagosContext.js";

import LottieView from "lottie-react-native";

import Pagos from "./Pagos";
import InfoCard from "./components--/card.js";

const Resumen = () => {
  const {
    verPagos,
    setVerPagos,
    cargarPagos,
    cargarPagosCodigo,
    ventasResumidas,
  } = useContext(PagosContext);

  const [modalPagos, setModalPagos] = useState(false);

  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState("WIFI");
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  const opacity = useState(new Animated.Value(0))[0]; // Valor inicial de opacidad (0)

  // Efecto para verificar la conexión de red
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync(); // Obtener estado de la red

        setIsConnected(networkState.isConnected); // Actualizar estado de conexión
        setConnectionType(networkState.type); // Obtener el tipo de conexión (wifi, celular, etc.)

        // Animar la opacidad para que aparezca el mensaje de conexión
        Animated.timing(opacity, {
          toValue: 1, // Cambiar la opacidad a 1
          duration: 1000, // Duración de la animación
          useNativeDriver: true,
        }).start();

        // Después de 3 segundos, cambiar a "Dashboard" y desvanecer el mensaje de conexión
        setTimeout(() => {
          setShowInitialMessage(false); // Ocultar el mensaje de conexión
          Animated.timing(opacity, {
            toValue: 0, // Hacer que el mensaje desaparezca lentamente
            duration: 1000,
            useNativeDriver: true,
          }).start();
        }, 3000); // 3 segundos para mostrar el mensaje de conexión
      } catch (error) {
        console.log("Error al verificar la conexión:", error);
      }
    };

    checkConnection(); // Verificar la conexión al cargar el componente

    // Opcional: puedes usar un listener para monitorear cambios de red si lo necesitas
    // Network.addListener('connectionChange', checkConnection);

    return () => {
      // Limpiar listeners si es necesario
      // Network.removeListener('connectionChange', checkConnection);
    };
  }, []); // Se ejecuta solo una vez al cargar el componente

  //PUSHEAR NOTIFICACIONES
  const registerForPushNotifications = async () => {
    try {
      // Verifica si hay conexión a Internet
      const networkState = await Network.getNetworkStateAsync();

      if (!networkState.isConnected) {
        console.log("No hay conexión a Internet.");
        return;
      }

      // Si está conectado, solicita permisos de notificación
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.log("Permisos de notificación denegados");
        return;
      }

      // Obtiene el token de notificación de Expo
      const token = (await Notifications.getExpoPushTokenAsync()).data;

      // Obtén el ID del administrador desde AsyncStorage
      const adminIdString = await AsyncStorage.getItem("adminId");
      const adminId = parseInt(adminIdString, 10);

      if (isNaN(adminId)) {
        console.log("ID de administrador no válido.");
        return;
      }

      // Envía el token al backend si todo está correcto
      const response = await axios.post(`${url}/guardarToken`, {
        administrador_id: adminId,
        token,
      });

      if (response.status === 200) {
        console.log("Token de notificación registrado con éxito.");
      } else {
        console.log("Error al guardar el token en el backend");
      }
    } catch (error) {
      console.log("Error al registrar el token de notificación:", error);
    }
  };

  //VERIFICAR EL INVENTARIO
  const verificarInventario = async () => {
    try {
      // Obtén el id_admin del AsyncStorage
      const adminIdString = await AsyncStorage.getItem("adminId");
      const adminId = parseInt(adminIdString, 10);

      // Asegúrate de que el id_admin está definido
      if (isNaN(adminId)) {
        console.error("ID de administrador no encontrado");
        return;
      }

      // Hacer la solicitud al backend
      const response = await axios.post(`${url}/verificarInventario`, {
        id_admin: adminId,
      });

      if (response.status === 200) {
        // Configura el manejador de notificaciones
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });
      } else {
        console.log("Error al verificar inventario.");
      }
    } catch (error) {
      console.error("Error al verificar el inventario:", error);
    }
  };

  useEffect(() => {
    registerForPushNotifications();
    verificarInventario();
  }, []);

  return (
    <View style={styles.container}>
      {showInitialMessage && (
        <Animated.View
          style={{
            alignItems: "center",
            opacity,
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 20,
            margin: 10,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "900", marginTop: 15 }}>
            Tipo de Conexión:{" "}
            {connectionType === "WIFI" ? (
              <Text>Red WiFi</Text>
            ) : (
              <Text>Datos Móviles</Text>
            )}
          </Text>
          <Text
            style={
              isConnected
                ? {
                    fontSize: 19,
                    fontWeight: "900",
                    marginTop: 15,
                    color: "green",
                  }
                : {
                    fontSize: 19,
                    fontWeight: "900",
                    marginTop: 15,
                    color: "red",
                  }
            }
          >
            {isConnected
              ? "Conexión estable"
              : "Conexión inestable o sin conexión"}
          </Text>
        </Animated.View>
      )}

      <InfoCard title="Aplicación de Gestión, Control de Ventas y Pagos" />

      <View style={{ backgroundColor: "#fff", borderRadius: 20 }}>
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
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setModalPagos(true);
          }}
        >
          <Text
            style={{
              color: "#000",
              fontSize: 20,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Pagos{" "}
          </Text>
          <Text style={styles.nro}>
            {verPagos.length === 0 ? (
              <Text style={{ fontSize: 12, textTransform: "uppercase" }}>
                Historial de pagos vacio
              </Text>
            ) : (
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#ffc727" }}
              >
                {verPagos.length}
              </Text>
            )}
          </Text>
        </TouchableOpacity>

        <View style={styles.btn}>
          <Text
            style={{
              color: "#000",
              fontSize: 20,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Ventas{" "}
          </Text>
          <Text style={styles.nro}>
            {verPagos.length === 0 ? (
              <Text style={{ fontSize: 12, textTransform: "uppercase" }}>
                Sin Ventas Realizadas
              </Text>
            ) : (
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#ffc727" }}
              >
                {ventasResumidas.length}
              </Text>
            )}
          </Text>
        </View>
      </View>

      <Modal visible={modalPagos} animationType="fade">
        <Pagos
          setModalPagos={setModalPagos}
          verPagos={verPagos}
          setVerPagos={setVerPagos}
          cargarPagos={cargarPagos}
          cargarPagosCodigo={cargarPagosCodigo}
        />
      </Modal>
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
