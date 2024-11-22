import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import { url } from "./../../../helpers/url.js";

const DevolucionesProcesar = ({
  setModalDevolucion,
  CLIENTE,
  VENTA_ID,
  historialVentas,
  cargarVentas,
  cargarProductos,
  closeInformacionVentas,
  cargarDevoluciones,
}) => {
  const fechaDevolucion = new Date().toISOString().split("T")[0];

  const [motivo, setMotivo] = useState("");

  //CARGA
  const [isLoading, setIsLoading] = useState(false);

  const enviarDevoluciones = async (
    cliente,
    ventaId,
    productos,
    fechaDevolucion,
    motivo
  ) => {
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

      // Validar entrada
      if (!ventaId || !productos || productos.length === 0) {
        console.error("Datos insuficientes para registrar devoluciones.");
        return;
      }

      setIsLoading(true);
      // Crear las devoluciones a partir de los productos
      const devoluciones = productos.map((producto) => ({
        CLIENTE: cliente,
        VENTA_ID: ventaId,
        PRODUCTO_ID: producto.ID_PRODUCTO,
        CANTIDAD: producto.CANTIDAD,
        FECHA_DEVOLUCION: fechaDevolucion,
        MOTIVO: motivo || "No especificado",
        ADMINISTRADOR_ID: adminId,
      }));

      const response = await axios.post(`${url}/procesarDevolucion`, {
        devoluciones,
      });

      if (response.status === 201) {
        console.log("Devoluciones registradas exitosamente:", response.data);

        cargarVentas();
        cargarProductos();
        cargarDevoluciones();
        
      } else {
        console.error("Error al registrar devoluciones:", response.data);
      }
    } catch (error) {
      console.error("Error en la solicitud de devoluciones:", error);
    } finally {
      setIsLoading(true);
    }
  };

  const cleaning = async () => {
    setMotivo("");
    setModalDevolucion(false);
    closeInformacionVentas();
  };

  const handleProcesarDevolucion = () => {
    if (!motivo) {
      Alert.alert(
        "Error al procesar la devolución.",
        "El motivo es requerido."
      );
      return;
    }

    // Mostrar la alerta de confirmación
    Alert.alert(
      "Confirmar devolución",
      "¿Está seguro de que desea procesar esta devolución?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            enviarDevoluciones(
              CLIENTE,
              VENTA_ID,
              historialVentas,
              fechaDevolucion,
              motivo
            );
            cleaning(); // Llamar a la función para limpiar los campos
          },
        },
      ]
    );
  };

  return (
    <View style={styles.modalOverlay}>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(242, 243, 244, 0.8)",
            zIndex: 1000,
          }}
        >
          <ActivityIndicator
            size="large"
            color="#fee03e"
            style={{ transform: [{ scale: 2 }] }}
          />
        </View>
      )}
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Devolución</Text>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => setModalDevolucion(false)}
          >
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={styles.motivoText}>Motivo</Text>
        <View style={styles.boxInput}>
          <TextInput
            placeholder="..."
            placeholderTextColor="#888"
            multiline={true}
            value={motivo}
            onChangeText={(value) => {
              setMotivo(value);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={handleProcesarDevolucion}
          style={styles.BtnDevolucion}
        >
          <Text style={styles.BtnDevolucionText}>Procesar Devolución</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DevolucionesProcesar;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 0.5,
    width: "100%",
  },
  titulo: {
    fontSize: 18,
    textTransform: "uppercase",
    color: "#888",
    padding: 5,
    fontWeight: "bold",
  },
  btnClose: {
    position: "absolute",
    top: -20,
    right: -18,
  },
  motivoText: {
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: "900",
    paddingVertical: 10,
  },
  boxInput: {
    backgroundColor: "#efefef",
    width: "75%",
    borderBottomColor: "#fcd53f",
    borderBottomWidth: 2,
    borderRadius: 10,
    padding: 8,
    textTransform: "uppercase",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  BtnDevolucion: {
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#ffc900",
    borderRadius: 5,
    padding: 8,
  },
  BtnDevolucionText: {
    fontSize: 16,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#FFF",
  },
});
