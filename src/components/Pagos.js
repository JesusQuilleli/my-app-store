import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";

import axios from "axios";
import { url } from "./../helpers/url.js";

import InformacionPagos from "./sub-components/components--Pagos/InformacionPagos.js";

import { formatearFecha } from "../helpers/validaciones";

import { PagosContext } from "./Context/pagosContext.js";

const Pagos = () => {
  //PARA ELIMINAR PAGOS
  const [pagosSeleccionados, setPagosSeleccionados] = useState([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [Infopagos, setInfoPagos] = useState(false);

  const [pagoSeleccionado, setPagoSeleccionado] = useState([]);

  //CONTEXTO
  const {
    verPagos,
    setVerPagos,
    cargarPagos,
    cargarPagosCodigo
  } = useContext(PagosContext);

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

  // Función para mostrar detalles del pago en el modal
  const mostrarDetallesPago = (idPago) => {
    const pago = verPagos.find((p) => p.ID_PAGO === idPago);
    if (pago) {
      setPagoSeleccionado([pago]);
      setInfoPagos(true);
    }
  };

  const Item = ({ CLIENTE, FECHA_PAGO, ESTADO_VENTA, SELECCIONADO }) => (
    <View style={[styles.item, SELECCIONADO && styles.itemSeleccionado]}>
      <Text style={styles.nombreCliente}>{CLIENTE}</Text>
      <Text style={styles.defecto}>
        Fecha de Pago:{" "}
        <Text style={{ color: "#000" }}>{formatearFecha(FECHA_PAGO)}</Text>
      </Text>

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

      <Text style={styles.pagosText}>
        Historial de <Text style={{ color: "#fcd53f" }}>Pagos</Text>
      </Text>

      <View style={styles.boxInput}>
        <TextInput
          placeholder="Buscar por Codigo de Venta"
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

      {verPagos.length !== 0 && (
        <FlatList
          data={verPagos}
          keyExtractor={(item) => item.ID_PAGO}
          style={styles.tablePagos}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (modoSeleccion) {
                  seleccionarPago(item.ID_PAGO);
                } else {
                  mostrarDetallesPago(item.ID_PAGO);
                }
              }}
              onLongPress={() => seleccionarPago(item.ID_PAGO)}
            >
              <Item
                CLIENTE={item.CLIENTE}
                FECHA_PAGO={item.FECHA_PAGO}
                ESTADO_VENTA={item.ESTADO_VENTA}
                SELECCIONADO={pagosSeleccionados.includes(item.ID_PAGO)}
              />
            </TouchableOpacity>
          )}
        />
      )}
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

      <Modal visible={Infopagos} animationType="fade">
        <InformacionPagos
          setInfoPagos={setInfoPagos}
          pagoSeleccionado={pagoSeleccionado}
        />
      </Modal>
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
    shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
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
  pagosText: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 20,
    textTransform: "uppercase",
  },
});
