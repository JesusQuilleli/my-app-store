import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

import FormularioVenta from "./sub-components/FormularioVenta.js";
import InformacionVenta from "./sub-components/InformacionVenta.js";

import axios from "axios";
import { url } from "../helpers/url.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { formatearFecha } from "../helpers/validaciones.js";

const Ventas = () => {
  const [formVentas, setFormVentas] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [ventasResumidas, setVentasResumidas] = useState([]);

  const [ventasDetalladas, setVentasDetalladas] = useState([]);

  const [modalVentasDetalladas, setModalVentasDetalladas] = useState(false);

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

  //FUNCION CARGAR PRODUCTOS EN VENTAS
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

  //FUNCION CARGAR VENTAS
  const cargarVentas = async () => {
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
      const respuesta = await axios.get(`${url}/infoResum/${adminId}`);
      const resultadoVentasResumidas = respuesta.data.response;
      setVentasResumidas(resultadoVentasResumidas);
      
    } catch (error) {
      console.log("Error al cargar Ventas", error);
    }
  };

  const cargarVentasDetalladas = async (ID_VENTA) => {
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
      
      // Agregar adminId e ID_VENTA en la URL
      const respuesta = await axios.get(`${url}/infoDetalle/${adminId}/${ID_VENTA}`);
      const resultadoVentasDetalladas = respuesta.data.response;
      setVentasDetalladas(resultadoVentasDetalladas[0]);

      console.log(ventasDetalladas);
      
      
    } catch (error) {
      console.log("Error al cargar Ventas", error);
    }
  };
  
  const closeForm = () => {
    setFormVentas(false);
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const Item = ({ cliente, fecha, estado }) => (
    <View style={styles.item}>
      <Text style={styles.nombreCliente}>{cliente}</Text>
      <Text style={styles.fechaPedido}>{formatearFecha(fecha)}</Text>
      <Text
        style={
          estado === "PAGADO" ? styles.estadoPagado : styles.estadoNoPagado
        }
      >
        {estado}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.ventasText}>
        Ventas <Text style={{ color: "#fcd53f" }}>Realizadas</Text>
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.BtnVenta}
          onPress={() => {
            setFormVentas(true);
          }}
        >
          <Text style={styles.BtnVentaText}>Realizar Venta</Text>
        </TouchableOpacity>
      </View>

      {ventasResumidas.length === 0 && (
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <Text style={{ fontSize: 24, fontWeight: "900" }}>
            No Hay Ventas Realizadas
          </Text>
        </View>
      )}

      <View style={styles.tableVentas}>
        <FlatList
          data={ventasResumidas}
          keyExtractor={(item) => item.ID_VENTA}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              setModalVentasDetalladas(true);
              cargarVentasDetalladas(item.ID_VENTA);
            }}>
              <Item
              cliente={item.CLIENTE}
              fecha={item.FECHA}
              estado={item.ESTADO_PAGO}
            />
            </TouchableOpacity>
          )}
        />
      </View>

      <Modal visible={formVentas} animationType="fade">
        <FormularioVenta
          setFormVentas={setFormVentas}
          cargarClientes={cargarClientes}
          clientes={clientes}
          setClientes={setClientes}
          cargarProductos={cargarProductos}
          productos={productos}
          setProductos={setProductos}
          closeForm={closeForm}
          cargarVentas={cargarVentas}
        />
      </Modal>

      <Modal visible={modalVentasDetalladas} animationType='fade'>
          <InformacionVenta setModalVentasDetalladas={setModalVentasDetalladas} ventasDetalladas={ventasDetalladas} setVentasDetalladas={setVentasDetalladas}/>
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
  buttonContainer: {
    padding: 10,
  },
  BtnVenta: {
    backgroundColor: "#433a3f",
    padding: 5,
    marginHorizontal: 40,
    borderRadius: 5,
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
    marginTop: 20,
    textTransform: "uppercase",
  },
  tableVentas:{
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    flex: 1,
    maxHeight: 470,
  },
  item: {
    alignItems:'center',
    backgroundColor: "#f2f2f2",
    padding: 12,
  },
  nombreCliente: {
    fontSize: 15,
    fontWeight: "700",
  },
  fechaPedido: {
    fontSize: 13,
    fontWeight: "500",
  },
  estadoPagado: {
    fontSize: 13,
    fontWeight: "500",
    color: "green",
  },
  estadoNoPagado: {
    fontSize: 13,
    fontWeight: "500",
    color: "red",
  },
});
