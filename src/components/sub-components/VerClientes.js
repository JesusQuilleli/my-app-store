import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import Checkbox from "expo-checkbox";

const VerClientes = ({
  setModalSelectClient,
  cargarClientes,
  clientes,
  setClientes,
  handleClienteSeleccionado,
}) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const toggleSelection = (ID_CLIENTE, NOMBRE) => {
    const nuevoSeleccionado =
      clienteSeleccionado === ID_CLIENTE ? null : ID_CLIENTE;
    setClienteSeleccionado(nuevoSeleccionado);

    if (nuevoSeleccionado) {
      handleClienteSeleccionado(ID_CLIENTE, NOMBRE);

      setModalSelectClient(false);
    }
  };

  // Componente Item que representa cada cliente
  const Item = ({ ID_CLIENTE, NOMBRE }) => {
    const isSelected = ID_CLIENTE === clienteSeleccionado;

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => toggleSelection(ID_CLIENTE, NOMBRE)}
      >
        <Text style={styles.nombre}>{NOMBRE}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Clientes</Text>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => setModalSelectClient(false)}
          >
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.tableVentas}>
          <FlatList
            data={clientes}
            renderItem={({ item }) => (
              <Item ID_CLIENTE={item.ID_CLIENTE} NOMBRE={item.NOMBRE} />
            )}
            keyExtractor={(item) => item.ID_CLIENTE.toString()}
          />
        </View>
      </View>
    </View>
  );
};

export default VerClientes;

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
    flexDirection: "row",
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
  tableVentas: {
    width: "100%",
    marginTop: 10,
    borderRadius: 25,
    overflow: "hidden",
    maxHeight: 250,
    marginTop: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
