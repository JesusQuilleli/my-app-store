import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";

import FormularioVenta from "./sub-components/FormularioVenta.js";

import axios from "axios";
import { url } from "../helpers/url.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Ventas = () => {
  const [formVentas, setFormVentas] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const cargarClientes = async () => {
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

      const response = await axios.get(`${url}/cargarClientes/${adminId}`);
      const resultadoClientes = response.data.result;
      setClientes(resultadoClientes);
    } catch (error) {
      console.error("Ha ocurrido un error al cargar Clientes", error);
    }
  };

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
      //setProductoNoEncontrado(false);
    } catch (error) {
      console.log("Error al cargar Productos", error);
    }
  };

  const DATA = [
    {
      id: "1",
      cliente: "Jesus Argenis",
      FechaPedido: "01-10-2024",
      EstadoPedido: "Pendiente",
    },
    {
      id: "2",
      cliente: "Claudia Sanz",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "3",
      cliente: "Ivan Cardozo",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "4",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "5",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "6",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "7",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "8",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "9",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "10",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
  ];

  const Item = ({ cliente, FechaPedido, EstadoPedido }) => (
    <View style={styles.item}>
      <Text style={styles.nombreCliente}>{cliente}</Text>
      <Text style={styles.fechaPedido}>{FechaPedido}</Text>
      <Text style={styles.estadoPedido}>{EstadoPedido}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.ventasText}>Ultimas Ventas Realizadas</Text>
      </View>

      <View style={styles.tableVentas}>
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item
              cliente={item.cliente}
              FechaPedido={item.FechaPedido}
              EstadoPedido={item.EstadoPedido}
            />
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.BtnVenta}
        onPress={() => {
          setFormVentas(true);
        }}
      >
        <Text style={styles.BtnVentaText}>Realizar Venta</Text>
      </TouchableOpacity>

      <Modal visible={formVentas} animationType="fade">
        <FormularioVenta
          setFormVentas={setFormVentas}
          cargarClientes={cargarClientes}
          clientes={clientes}
          setClientes={setClientes}
          cargarProductos={cargarProductos}
          productos={productos}
          setProductos={setProductos}
        />
      </Modal>
    </View>
  );
};

export default Ventas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {},
  BtnVenta: {
    backgroundColor: "#433a3f",
    padding: 5,
    marginHorizontal: 40,
    borderRadius: 5,
    marginTop: 5,
  },
  BtnVentaText: {
    textAlign: "center",
    fontSize: 24,
    color: "#FFF",
    fontWeight: "900",
    textTransform: "uppercase",
  },
  ventasText: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 6,
    textAlign: "center",
    marginVertical: 20,
    textTransform: "uppercase",
  },
  tableVentas: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    borderTopColor: "#000",
    borderTopWidth: 1,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    maxHeight: 480,
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderBottomColor: "#000",
    borderBottomWidth: 0.2,
    alignItems: "center",
  },
  nombreCliente: {
    fontSize: 22,
    fontWeight: "700",
  },
  fechaPedido: {
    fontSize: 16,
    fontWeight: "500",
  },
  estadoPedido: {
    fontSize: 16,
    fontWeight: "500",
    color: "red",
  },
});
