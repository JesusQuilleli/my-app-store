import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import axios from "axios";
import {url} from './../../helpers/url.js'

const VerClientes = ({
  setModalSelectClient,
  cargarClientes,
  clientes,
  setClientes,
  handleClienteSeleccionado,
}) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [clienteNoEncontrado, setClienteNoEncontrado] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  //SELECCIONAR CLIENTE
  const toggleSelection = (ID_CLIENTE, NOMBRE) => {
    const nuevoSeleccionado =
      clienteSeleccionado === ID_CLIENTE ? null : ID_CLIENTE;
    setClienteSeleccionado(nuevoSeleccionado);

    if (nuevoSeleccionado) {
      handleClienteSeleccionado(ID_CLIENTE, NOMBRE);

      setModalSelectClient(false);
    }
  };

  //PROCESAR DOS FUNCIONES
  const verAllClientes = async () => {
    setClientes([]);
    await cargarClientes();
  };

  //FUNCION BUSCAR CLIENTE
  const searchCliente = async (nombre) => {
    try {
      const response = await axios.get(`${url}/buscarCliente`, {
        params: { nombre: nombre },
      });

      if (response.data && response.data.response.length > 0) {
        setClientes(response.data.response);
        setClienteNoEncontrado(false);
      } else {
        setClientes([]);
        setClienteNoEncontrado(true);
      }
    } catch (error) {
      console.log("Error en la busqueda Front-End", error);
    }
  };

  //RENDER DE LOS CLIENTES EN LA FLAT-LIST
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
          <TextInput 
          placeholder="Buscar..."
          style={styles.inputBuscar}
          onChangeText={(value) => {
            if (value.length > 0) {
              searchCliente(value);
            } else {
              verAllClientes();
              setClienteNoEncontrado(false);
            }
          }}
          />
          <FontAwesome5 name="search" size={18} color="#888" />
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => setModalSelectClient(false)}
          >
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {clienteNoEncontrado && (
          <View style={styles.noSearch}>
            <Text style={styles.noSearchText}>
              No se ha Encontrado el Cliente
            </Text>
          </View>
        )}

        {!clienteNoEncontrado && clientes.length === 0 && (
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18, fontWeight: '900'}}>No hay Clientes Registrados</Text>
          </View>
        )}

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
    alignItems:'center',
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
  inputBuscar:{
    width:'50%',
    textAlign:'center',
    letterSpacing: 1
  },
  noSearch:{
    marginTop: 25
  },
  noSearchText:{
    fontWeight: 'bold',
    fontSize: 18
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
