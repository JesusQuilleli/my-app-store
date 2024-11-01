import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import ProcesarPedido from "./ProcesarVenta";
import VerClientes from "./VerClientes";

import axios from "axios";
import { url } from "../../helpers/url.js";
//import AsyncStorage from "@react-native-async-storage/async-storage";

const FormularioVenta = ({
  setFormVentas,
  cargarClientes,
  clientes,
  setClientes,
  cargarProductos,
  productos,
  setProductos,
}) => {
  const [modalVenta, setModalVenta] = useState(false);
  const [modalselectClient, setModalSelectClient] = useState(false);

  const [clienteSeleccionado, setClienteSeleccionado] = useState({
    ID_CLIENTE: null,
    NOMBRE: "",
  });

  const [productosCarrito, setProductosCarrito] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  //FUNCION PARA RECIBIR EL NOMBRE Y EL ID CLIENTE
  const handleClienteSeleccionado = (ID_CLIENTE, NOMBRE) => {
    setClienteSeleccionado({ ID_CLIENTE, NOMBRE });
    setModalSelectClient(false); // Cierra el modal después de seleccionar el cliente
  };

  //FUNCION PARA LIMPIAR EL CLIENTE
  const handlerLimpiar = () => {
    setClienteSeleccionado({ ID_CLIENTE: null, NOMBRE: "" });
  };

  const agregarProductoAlCarrito = async (producto) => {
    // Verifica si el producto está agotado
    if (producto.CANTIDAD === 0) {
      Alert.alert("Producto Agotado", "Este producto ya no está disponible.");
      return;
    }

    // Restar uno de la cantidad del producto en la lista de productos si está disponible
    const productosActualizados = productos.map((item) => {
      if (item.ID_PRODUCTO === producto.ID_PRODUCTO) {
        return { ...item, CANTIDAD: item.CANTIDAD - 1 }; // Resta uno
      }
      return item;
    });

    // Actualiza el estado de productos
    setProductos(productosActualizados);

    // Verifica si el producto ya está en el carrito
    const productoExistente = productosCarrito.find(
      (item) => item.ID_PRODUCTO === producto.ID_PRODUCTO
    );

    if (productoExistente) {
      // Si el producto ya está en el carrito, solo aumenta la cantidad en el carrito
      const carritoActualizado = productosCarrito.map((item) => {
        if (item.ID_PRODUCTO === producto.ID_PRODUCTO) {
          return { ...item, CANTIDAD: item.CANTIDAD + 1 };
        }
        return item;
      });
      setProductosCarrito(carritoActualizado);
    } else {
      // Si no está, lo añade al carrito con cantidad 1
      setProductosCarrito([
        ...productosCarrito,
        {
          ID_PRODUCTO: producto.ID_PRODUCTO,
          NOMBRE: producto.PRODUCTO,
          PRECIO: producto.PRECIO,
          CANTIDAD: 1,
        },
      ]);
    }

    // Actualizar la cantidad en la base de datos usando Axios
    try {
      await axios.put(`${url}/updateProductoStock/${producto.ID_PRODUCTO}`, {
        cantidad: -1, // Resta uno en la base de datos
      });
      console.log("Cantidad actualizada en la base de datos");
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad en la base de datos",
        error
      );
    }
  };

  const Item = ({ nombre, cantidad, precio, agregar }) => (
    <View style={styles.item}>
      <View style={styles.textContainer}>
        <Text style={styles.nombreText}>{nombre}</Text>
        <Text style={styles.defecto}>
          Disponibles{" "}
          <Text style={cantidad > 1 ? { color: "#0e6a00" } : { color: "#f00" }}>
            {cantidad}
          </Text>{" "}
          Unidades
        </Text>
        <Text style={styles.defecto}>
          Precio <Text style={{ color: "#000" }}>{precio}</Text>
        </Text>
      </View>
      <TouchableOpacity style={styles.btnAgregarProducto} onPress={agregar}>
        <FontAwesome name="cart-plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setFormVentas(false);
          }}
        >
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Hacer Venta</Text>
        <TouchableOpacity
          onPress={() => {
            setModalVenta(true);
          }}
          style={styles.verCar}
        >
          <Entypo name="shopping-cart" size={32} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.containerSelectClient}>
        <View style={styles.camposClientes}>
          <TextInput
            placeholder="Nombre Cliente"
            style={styles.input}
            value={clienteSeleccionado.NOMBRE}
            editable={false}
          />
          {clienteSeleccionado.ID_CLIENTE ? (
            <TouchableOpacity
              style={styles.BtnLimpiar}
              onPress={handlerLimpiar}
            >
              <MaterialIcons
                name="cleaning-services"
                size={30}
                color="black"
                style={{ textAlign: "center" }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setModalSelectClient(true);
              }}
              style={styles.BtnCliente}
            >
              <Ionicons
                name="person"
                size={30}
                color="#000"
                style={{ textAlign: "center" }}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.BtnCalendar} onPress={handlerLimpiar}>
            <Entypo
              name="calendar"
              size={30}
              color="black"
              style={{ textAlign: "center" }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.padreProductos}>
        <Text style={styles.tituloProductos}>
          Productos <Text style={{ color: "#fcd53f" }}>Disponibles</Text>
        </Text>
        <View style={styles.containerBuscar}>
          <FontAwesome5 name="search" size={24} color="black" />
          <TextInput
            placeholder=""
            placeholderTextColor={"#FFF"}
            style={styles.inputBuscar}
          />
        </View>

        <View style={styles.tableProductos}>
          <FlatList
            data={productos}
            keyExtractor={(item) => item.ID_PRODUCTO}
            renderItem={({ item }) => (
              <Item
                nombre={item.PRODUCTO}
                cantidad={item.CANTIDAD}
                precio={item.PRECIO}
                agregar={() => agregarProductoAlCarrito(item)}
              />
            )}
          />
        </View>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVenta}>
        <ProcesarPedido setModalVenta={setModalVenta} productosCarrito={productosCarrito} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalselectClient}
      >
        <VerClientes
          setModalSelectClient={setModalSelectClient}
          cargarClientes={cargarClientes}
          clientes={clientes}
          setClientes={setClientes}
          handleClienteSeleccionado={handleClienteSeleccionado}
        />
      </Modal>
    </View>
  );
};

export default FormularioVenta;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#433a3f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  verCar: {
    backgroundColor: "#fcd53f",
    padding: 8,
    borderRadius: 50,
  },
  titulo: {
    textAlign: "center",
    marginVertical: 25,
    fontSize: 35,
    color: "#fff",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  containerSelectClient: {
    alignItems: "center",
  },
  BtnCliente: {
    backgroundColor: "#fcd53f",
    padding: 5,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    width: "20%",
  },
  BtnLimpiar: {
    backgroundColor: "#f00",
    padding: 5,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    width: "20%",
  },
  BtnCalendar: {
    backgroundColor: "#8c8c8c",
    padding: 5,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    width: "15%",
  },
  camposClientes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#f2f2f2",
    padding: 8,
    borderRadius: 25,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    textAlign: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 0.5,
    color: "#000",
    fontWeight: "900",
    width: "50%",
  },
  padreProductos: {
    alignItems: "center",
  },
  tituloProductos: {
    textAlign: "center",
    marginTop: 25,
    fontSize: 25,
    color: "#FFF",
    textTransform: "uppercase",
    fontWeight: "900",
    letterSpacing: 1,
  },
  containerBuscar: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  inputBuscar: {
    width: "80%",
    marginVertical: 4,
  },
  tableProductos: {
    width: "90%",
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 20,
    maxHeight: 460,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#FFF",
    padding: 10,
    borderBottomColor: "#888",
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
  nombreText: {
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase",
    textDecorationLine: "underline",
    color: "#000",
    letterSpacing: 5,
    fontStyle: "italic",
  },
  defecto: {
    fontSize: 15,
    color: "#888",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  btnAgregarProducto: {
    backgroundColor: "#0e6a00",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
