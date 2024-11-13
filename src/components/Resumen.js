import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

import axios from "axios";
import { url } from "../helpers/url.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

//NOTIFICACIONES
import * as Notifications from "expo-notifications";

import { PagosContext } from "./Context/pagosContext.js";

import Pagos from "./Pagos";
import Deudores from "./Deudores";

const Resumen = () => {


  const {verPagos} = useContext(PagosContext);

  const [modalPagos, setModalPagos] = useState(false);
  const [modalDeudores, setModalDeudores] = useState(false); 
  
  //PUSHEAR NOTIFICACIONES
  const registerForPushNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
  
      // Obtén el id_admin desde AsyncStorage o como sea que lo estés gestionando
      const adminIdString = await AsyncStorage.getItem("adminId");
      const adminId = parseInt(adminIdString, 10);      
  
      // Enviar el token y el id_admin a tu backend
      await axios.post(`${url}/guardarToken`, { administrador_id: adminId, token });
    } else {
      console.log("Permisos de notificación denegados");
    }
  };

  //VERIFICAR EL INVENTARIO
  const verificarInventario = async () => { 
    try {
      // Obtén el id_admin del AsyncStorage
      const adminIdString = await AsyncStorage.getItem("adminId");
      const adminId = parseInt(adminIdString, 10);
  
      // Asegúrate de que el id_admin está definido
      if (!adminId) {
        console.error("ID de administrador no encontrado");
        return;
      }
  
      // Hacer la solicitud al backend
      const response = await axios.post(`${url}/verificarInventario`, { id_admin: adminId });

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
  
    } catch (error) {
      console.error("Error al verificar el inventario:", error);
    }
  };

  useEffect(() => {
    registerForPushNotifications();
    verificarInventario();  
  }, [])

  return (
    <View style={styles.container}>

      <TouchableOpacity 
      style={styles.btn}
      onPress={() => {
        setModalPagos(true);
      }}
      >
        <Text style={{color:'#000', fontSize: 24}}>Pagos{' '}</Text>
        <Text style={styles.nro}>{verPagos.length}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.btn}
      onPress={() => {
        setModalDeudores(true);
      }}
      >
        <Text style={{color:'#000', fontSize: 24}}>Deudores</Text>
        <Text style={styles.nro}>15</Text>
      </TouchableOpacity>

      <Modal visible={modalPagos} animationType="fade">
        <Pagos 
        setModalPagos={setModalPagos}
        verPagos={verPagos}
        />
      </Modal>

      <Modal visible={modalDeudores} animationType="fade">
        <Deudores/>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: '#f2f2f2'
  },
  btn: {
    backgroundColor: "#fff",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 20,
    padding: 20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around'
  },
  nro:{
    fontSize: 30,
    fontWeight: '900'
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
    color: '#fee03e',
    fontWeight: '600'
  },
  fecha:{
    fontSize: 14,
    fontWeight: '300'
  },
  monto: {
    fontSize: 14,
    fontWeight: '800'
  }
});

export default Resumen;
