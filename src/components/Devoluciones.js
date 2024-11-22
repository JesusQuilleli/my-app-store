import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { url } from "./../helpers/url.js";

import { PagosContext } from "./Context/pagosContext";

import { formatearFecha } from "../helpers/validaciones";

import InformacionDevolucion from "./sub-components/components--Devolciones/InformacionDevolucion.js";

const Devoluciones = () => {
  const [devolucionSeleccionada, setDevolucionSeleccionada] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [modalInformacionDevolucion, setModalInformacionDevolucion] =
    useState(false);

  const { cargarDevoluciones, devolucionesAll } = useContext(PagosContext);

  const Item = ({ CLIENTE, FECHA_DEVOLUCION }) => (
    <View style={styles.item}>
      <Text style={styles.nombreCliente}>{CLIENTE}</Text>
      <Text style={styles.defecto}>Fecha de Devolucion</Text>
      <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>
        {formatearFecha(FECHA_DEVOLUCION)}
      </Text>
    </View>
  );

  // Función para mostrar detalles del pago en el modal
  const mostrarDetallesDevolucion = (idDevolucion) => {
    const devolucion = devolucionesAll.find(
      (d) => d.ID_DEVOLUCION === idDevolucion
    );
    if (devolucion) {
      setDevolucionSeleccionada([devolucion]);
      setModalInformacionDevolucion(true);
    }
  };

  const vaciarHistorial = async () => {
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

      setIsLoading(true);
      // Realiza la solicitud DELETE al backend
      const response = await axios.delete(
        `${url}/eliminarDevoluciones/${adminId}`
      );

      if (response.status === 200) {
        // Vaciamos el estado en el frontend
        cargarDevoluciones();

        console.log("Historial de devoluciones eliminado con éxito");
      } else {
        console.log("Error al intentar eliminar el historial de devoluciones");
      }
    } catch (error) {
      console.error("Error al vaciar el historial de devoluciones:", error);
    } finally {
      setIsLoading(false); // Oculta el indicador de carga
    }
  };

  const handleProcesarVaciar = () => {

    // Mostrar la alerta de confirmación
    Alert.alert(
      "Confirmar Vaciar Historial Devoluciones",
      "¿Está seguro de que desea vaciar el historial?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            vaciarHistorial();
          },
        },
      ]
    );
  };

  useEffect(() => {
    cargarDevoluciones();
  }, []);

  return (
    <View style={styles.container}>
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

      <Text style={styles.devolucionesText}>
        Historial de <Text style={{ color: "#fcd53f" }}>Devoluciones</Text>
      </Text>

      <View style={styles.boxInput}>
        <TextInput
          placeholder="Buscar por Cliente"
          placeholderTextColor="#888"
          style={{ textAlign: "center" }}
          onChangeText={(value) => {
            if (value.length > 0) {
              //cargarPagosCodigo(value);
            } else {
              //cargarPagos();
            }
          }}
        />
      </View>

      {devolucionesAll.length === 0 && (
        <Text style={{ fontSize: 24, marginVertical: 20, fontWeight: "900" }}>
          Sin Devoluciones Realizadas
        </Text>
      )}

      {devolucionesAll.length !== 0 && (<FlatList
        data={devolucionesAll}
        keyExtractor={(item) => item.ID_DEVOLUCION}
        style={styles.tablePagos}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              mostrarDetallesDevolucion(item.ID_DEVOLUCION);
            }}
          >
            <Item
              CLIENTE={item.CLIENTE}
              FECHA_DEVOLUCION={item.FECHA_DEVOLUCION}
            />
          </TouchableOpacity>
        )}
      />)}

      {devolucionesAll.length !== 0 && (<TouchableOpacity 
      onPress={handleProcesarVaciar}
      style={styles.BtnVaciar}>
        <Text style={styles.BtnVaciarText}>Vaciar Historial</Text>
      </TouchableOpacity>)}

      <Modal visible={modalInformacionDevolucion} animationType="fade">
        <InformacionDevolucion
          setModalInformacionDevolucion={setModalInformacionDevolucion}
          devolucionSeleccionada={devolucionSeleccionada}
        />
      </Modal>
    </View>
  );
};

export default Devoluciones;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  tablePagos: {
    borderRadius: 15,
    overflow: "hidden",
    flex: 1,
    shadowColor: "#000",
    width: "100%",
    borderTopColor: "#000",
    borderTopWidth: 0.2,
  },
  nombreCliente: {
    fontSize: 18,
    fontWeight: "800",
  },
  defecto: {
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: "700",
    color: "red",
  },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    alignItems: "center",
  },
  itemSeleccionado: {
    backgroundColor: "#dcdcdc", // Cambia el fondo para indicar selección
  },
  devolucionesText: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 20,
    textTransform: "uppercase",
  },
  boxInput: {
    backgroundColor: "#efefef",
    width: "75%",
    borderBottomColor: "#fcd53f",
    borderBottomWidth: 2,
    borderRadius: 10,
    padding: 8,
    marginVertical: 15,
    textTransform: "uppercase",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  BtnVaciar: {
    width: "80%",
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  BtnVaciarText: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFF",
    fontWeight: "900",
    textTransform: "uppercase",
  },
});
