import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";

import axios from "axios";
import { url } from "./../helpers/url.js";

import Entypo from "@expo/vector-icons/Entypo";

import { formatearFecha } from "../helpers/validaciones";

const Pagos = ({
  setModalPagos,
  verPagos,
  setVerPagos,
  cargarPagos,
  cargarPagosCodigo,
}) => {
  //PARA ELIMINAR PAGOS
  const [pagosSeleccionados, setPagosSeleccionados] = useState([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const seleccionarPago = (idPago) => {
    setModoSeleccion(true); // Activa el modo selección al seleccionar una venta

    if (pagosSeleccionados.includes(idPago)) {
      // Si la venta ya está seleccionada, la deselecciona
      const nuevosPagosSeleccionados = pagosSeleccionados.filter(
        (id) => id !== idPago
      );
      setPagosSeleccionados(nuevosPagosSeleccionados);

      // Si no quedan ventas seleccionadas, desactiva el modo selección
      if (nuevosPagosSeleccionados.length === 0) {
        setModoSeleccion(false);
      }
    } else {
      // Si la venta no está seleccionada, la agrega a las seleccionadas
      setPagosSeleccionados([...pagosSeleccionados, idPago]);
    }
  };

  // Función para seleccionar o deseleccionar todas las ventas
  const seleccionarTodas = () => {
    if (pagosSeleccionados.length === verPagos.length) {
      // Si ya están todas seleccionadas, deseleccionarlas
      setPagosSeleccionados([]);
      setModoSeleccion(false);
    } else {
      // Seleccionar todas las ventas
      const todosLosIds = verPagos.map((pago) => pago.ID_PAGO);
      setPagosSeleccionados(todosLosIds);
      console.log(todosLosIds);
    }
  };

  // Función para eliminar las ventas seleccionadas
  const eliminarPagosSeleccionadas = async () => {
    setIsLoading(true);
    try {
      // Realiza la solicitud DELETE al endpoint enviando los IDs de las ventas seleccionadas
      const response = await axios.delete(`${url}/eliminarPagos`, {
        data: { ids: pagosSeleccionados },
      });

      if (response.status === 200) {
        // Filtra las ventas eliminadas de la lista en el frontend
        setVerPagos((pagos) =>
          pagos.filter((pagos) => !pagosSeleccionados.includes(pagos.ID_PAGO))
        );

        // Limpia la selección y desactiva el modo selección
        setPagosSeleccionados([]);
        setModoSeleccion(false);

        await cargarPagos();

        console.log("Ventas eliminadas con éxito");
      } else {
        console.log("Error: No se encontraron algunas ventas para eliminar");
      }
    } catch (error) {
      console.log("Error al eliminar ventas en el Frontend", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlerEliminar = () => {
    // Mostrar la advertencia de confirmación
    Alert.alert(
      "Confirmar eliminación", // Título del alert
      "¿Estás seguro de eliminar todos los pagos seleccionados?", // Mensaje
      [
        {
          text: "No", // Botón "No"
          onPress: () => {
            setPagosSeleccionados([]);
            setModoSeleccion(false);
          },
          style: "cancel", // Estilo del botón "No"
        },
        {
          text: "Sí", // Botón "Sí"
          onPress: () => eliminarPagosSeleccionadas(), // Ejecuta la eliminación si elige "Sí"
          style: "destructive", // Estilo del botón "Sí" para indicar acción destructiva
        },
      ],
      { cancelable: false } // Hace que el alert no se cierre al tocar fuera de él
    );
  };


  const Item = ({
    CLIENTE,
    FECHA_PAGO,
    MONTO_ABONADO,
    MONTO_PENDIENTE,
    ESTADO_VENTA,
    VENTA_ID,
    SELECCIONADO,
  }) => (
    <View style={[styles.item, SELECCIONADO && styles.itemSeleccionado]}>
      <Text style={styles.nombreCliente}>{CLIENTE}</Text>
      <Text style={styles.defecto}>
        Fecha de Pago:{" "}
        <Text style={{ color: "#000" }}>{formatearFecha(FECHA_PAGO)}</Text>
      </Text>
      <Text style={styles.defecto}>
        Deuda Total: <Text style={{ color: "#000" }}>{MONTO_PENDIENTE}</Text>{" "}
        <Text style={{ fontSize: 12 }}>Dolares</Text>
      </Text>

      <Text style={styles.defecto}>
        Monto Abonado: <Text style={{ color: "#000" }}>{MONTO_ABONADO}</Text>{" "}
        <Text style={{ fontSize: 12 }}>Dolares</Text>
      </Text>
      {ESTADO_VENTA === "PENDIENTE" && (
        <Text style={styles.defecto}>
          Deuda Restante:{" "}
          <Text style={{ color: "#000" }}>
            {(MONTO_PENDIENTE - MONTO_ABONADO).toFixed(2)}
          </Text>{" "}
          <Text style={{ fontSize: 12 }}>Dolares</Text>
        </Text>
      )}
      <Text style={styles.defecto}>
        Estado de Venta:{" "}
        <Text
          style={
            ESTADO_VENTA === "PENDIENTE" ? { color: "red" } : { color: "green" }
          }
        >
          {ESTADO_VENTA}
        </Text>{" "}
      </Text>
      <Text style={styles.defecto}>
        Codigo Venta: <Text style={{ color: "#000" }}>{VENTA_ID}</Text>{" "}
      </Text>
    </View>
  );

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
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => {
              setModalPagos(false);
            }}
            style={styles.btnAtras}
          >
            <Entypo name="arrow-long-left" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Pagos</Text>
        </View>
      </View>

      <View style={styles.boxInput}>
        <TextInput
          placeholder="Buscar por Codigo"
          placeholderTextColor="#888"
          style={{ textAlign: "center" }}
          onChangeText={(value) => {
            if (value.length > 0) {
              cargarPagosCodigo(value);
            } else {
              cargarPagos();
            }
          }}
        />
      </View>

      {verPagos.length === 0 && (
        <Text style={{ fontSize: 24, marginVertical: 20, fontWeight: "900" }}>
          Sin Historial de Pagos
        </Text>
      )}

     {verPagos.length !== 0 && (<FlatList
        data={verPagos}
        keyExtractor={(item) => item.ID_PAGO}
        style={styles.tablePagos}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if (modoSeleccion) {
                seleccionarPago(item.ID_PAGO);
              }
            }}
            onLongPress={() => seleccionarPago(item.ID_PAGO)}
          >
            <Item
              CLIENTE={item.CLIENTE}
              FECHA_PAGO={item.FECHA_PAGO}
              MONTO_ABONADO={item.MONTO_ABONADO}
              MONTO_PENDIENTE={item.MONTO_PENDIENTE}
              ESTADO_VENTA={item.ESTADO_VENTA}
              VENTA_ID={item.VENTA_ID}
              SELECCIONADO={pagosSeleccionados.includes(item.ID_PAGO)}
            />
          </TouchableOpacity>
        )}
      />)}
      {modoSeleccion && (
        <View style={styles.buttonContainerEliminar}>
          <TouchableOpacity
            style={styles.BtnEliminar}
            onPress={() => handlerEliminar()}
          >
            <Text style={styles.BtnEliminarText}>Eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.BtnEliminar, { backgroundColor: "#888" }]}
            onPress={() => seleccionarTodas()}
          >
            <Text style={styles.BtnEliminarText}>
              {pagosSeleccionados.length === verPagos.length ? (
                <Text>Cancelar</Text>
              ) : (
                <Text>Seleccionar Todas</Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Pagos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    backgroundColor: "#fee03e",
    width: "100%",
    padding: 15,
  },
  titulo: {
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 90,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnAtras: {
    padding: 5,
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
    color: "#888",
  },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderBottomColor: "#000",
    borderBottomWidth: 0.2,
    alignItems: "center",
  },
  itemSeleccionado: {
    backgroundColor: "#dcdcdc", // Cambia el fondo para indicar selección
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
  },
  buttonContainerEliminar: {
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  BtnEliminar: {
    width: "80%",
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2.5,
  },
  BtnEliminarText: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFF",
    fontWeight: "900",
    textTransform: "uppercase",
  },
});
