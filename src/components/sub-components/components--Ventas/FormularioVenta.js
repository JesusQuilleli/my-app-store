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
  ActivityIndicator
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import ProcesarVenta from "../components--Productos/ProcesarVenta.js";
import VerClientes from "./VerClientes.js";

import axios from "axios";
import {url} from './../../../helpers/url.js'

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

//ALMACENAMIENTO LOCAL
import AsyncStorage from "@react-native-async-storage/async-storage";

const FormularioVenta = ({
  setFormVentas,
  cargarClientes,
  clientes,
  setClientes,
  cargarProductos,
  productos,
  setProductos,
  closeForm,
  cargarVentas,
  TasaBolivares,
  TasaPesos,
}) => {
  //USE-STATE PARA LOS MODALES
  const [modalVenta, setModalVenta] = useState(false);
  const [modalselectClient, setModalSelectClient] = useState(false);

  //ALMACEN DATOS VENTA
  const [clienteSeleccionado, setClienteSeleccionado] = useState({
    ID_CLIENTE: null,
    NOMBRE: "",
  });
  const [productosCarrito, setProductosCarrito] = useState([]);
  const [fecha, setFecha] = useState(new Date());

  //RENDER INFORMACION
  const [productoNoEncontrado, setProductoNoEncontrado] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  //FUNCION COMPROBAR CARRITO PARA PODER CAMBIAR CLIENTE
  const comprobarCarrito = () => {
    if (productosCarrito.length > 0) {
      Alert.alert(
        "Obligatorio",
        "Debe devolver los productos cargados en el carrito, para cambiar de cliente.",
        [{ text: "Vale" }]
      );
      return;
    } else {
      setModalSelectClient(true);
    }
  };

  //FUNCION PARA RECIBIR EL NOMBRE Y EL ID CLIENTE
  const handleClienteSeleccionado = (ID_CLIENTE, NOMBRE) => {
    setClienteSeleccionado({ ID_CLIENTE, NOMBRE });
    setModalSelectClient(false); // Cierra el modal después de seleccionar el cliente
  };

  //FUNCION PARA AGREGAR PRODUCTOS AL CARRITO
  const agregarProductoAlCarrito = (producto) => {
    if (clienteSeleccionado.NOMBRE === "") {
      Alert.alert(
        "Obligatorio",
        "Seleccione el cliente para poder cargar los productos al carrito.",
        [{ text: "Vale" }]
      );
      return;
    }
  
    if (producto.CANTIDAD === 0) {
      Alert.alert("Producto Agotado", "Este producto ya no está disponible.");
      return;
    }
  
    // Reducir la cantidad en la lista de productos
    const productosActualizados = productos.map((item) => {
      if (item.ID_PRODUCTO === producto.ID_PRODUCTO) {
        return { ...item, CANTIDAD: item.CANTIDAD - 1 };
      }
      return item;
    });
    setProductos(productosActualizados);
  
    // Agregar o actualizar el producto en el carrito
    const productoExistente = productosCarrito.find(
      (item) => item.ID_PRODUCTO === producto.ID_PRODUCTO
    );
  
    if (productoExistente) {
      const carritoActualizado = productosCarrito.map((item) => {
        if (item.ID_PRODUCTO === producto.ID_PRODUCTO) {
          return { ...item, CANTIDAD: item.CANTIDAD + 1 };
        }
        return item;
      });
      setProductosCarrito(carritoActualizado);
    } else {
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
  };

  //FUNCION BUSCAR PRODUCTOS
  const searchProducto = async (nombre) => {
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
      const response = await axios.get(`${url}/buscarProductos/${adminId}`, {
        params: { nombre: nombre },
      });

      if (response.data && response.data.response.length > 0) {
        setProductos(response.data.response);
        setProductoNoEncontrado(false);
      } else {
        setProductos([]);
        setProductoNoEncontrado(true);
      }
    } catch (error) {
      console.log("Error en la busqueda Front-End", error);
    }
  };

  //VER TODOS LOS PRODUCTOS
  async function verProductos() {
    setProductos([]);
    await cargarProductos();
  }

  //FUNCION SELECCIONAR FECHA
  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: fecha,
      onChange: (event, selectedDate) => {
        if (event.type === "set") {
          // Asegura que selectedDate esté en tu zona horaria local
          const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
  
          setFecha(localDate); // Actualiza la fecha ajustada
        }
      },
      mode: "date",
      is24Hour: true,
    });  
  };

  useEffect(() => {
    cargarProductos();    
  }, []);

  useEffect(() => {
    if(productos){
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [productos]); 
  
  const Item = ({ nombre,descripcion, cantidad, precio, agregar }) => (
    <View style={styles.item}>
      <View style={styles.textContainer}>
        <Text style={styles.nombreText}>{nombre}</Text>
        <Text style={styles.defectoDescripcion}>{descripcion}</Text>
        <Text style={styles.defecto}>
          <Text style={cantidad > 1 ? { color: "#0e6a00" } : { color: "#f00" }}>
            {cantidad}
          </Text>{" "}
          <Text style={{ fontSize: 14 }}>Disponibles</Text>
        </Text>
        <Text style={styles.defecto}>
          <Text style={{ color: "#000", fontSize: 14 }}>{precio}</Text>{" "}
          <Text style={{ fontSize: 12 }}>Dolares</Text>
        </Text>
        <Text style={styles.defecto}>
          <Text style={{ color: "#000", fontSize: 14 }}>
            {isNaN(TasaBolivares) || TasaBolivares === 0 ? (
              <Text>No disponible</Text>
            ) : (
              (precio * TasaBolivares).toFixed(2)
            )}
          </Text>{" "}
          <Text style={{ fontSize: 12 }}>Bolivares</Text>
        </Text>

        <Text style={styles.defecto}>
          <Text style={{ color: "#000", fontSize: 14 }}>
            {isNaN(TasaPesos) || TasaPesos === 0 ? (
              <Text>No disponible</Text>
            ) : (
              (precio * TasaPesos).toFixed(0)
            )}
          </Text>{" "}
          <Text style={{ fontSize: 12 }}>Pesos</Text>
        </Text>
      </View>
      <TouchableOpacity
        style={
          cantidad === 0
            ? styles.btnAgregarProductoDisable
            : styles.btnAgregarProducto
        }
        onPress={agregar}
        disabled={cantidad === 0}
      >
        <FontAwesome name="cart-plus" size={30} color="#FFF" />
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
          disabled={productosCarrito.length > 0}
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color={productosCarrito.length > 0 ? "#888" : "#fff"}
          />
        </TouchableOpacity>
        <Text style={styles.titulo}>Hacer Venta</Text>
      </View>
      <View style={styles.containerSelectClient}>
        <View style={styles.camposClientes}>
          <TextInput
            placeholder="Cliente"
            style={styles.input}
            value={clienteSeleccionado.NOMBRE}
            editable={false}
          />
          <TouchableOpacity
            onPress={() => {
              comprobarCarrito();
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
          <TouchableOpacity style={styles.BtnCalendar}>
            <Entypo
              name="calendar"
              size={30}
              color="#fff"
              style={{ textAlign: "center" }}
              onPress={showDatepicker}
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
            placeholderTextColor="#FFF"
            style={styles.inputBuscar}
            onChangeText={(value) => {
              if (value.length > 0) {
                searchProducto(value);
              } else {
                verProductos();
                setProductoNoEncontrado(false);
              }
            }}
          />
        </View>

        {productoNoEncontrado && productos.length === 0 &&(
          <View style={styles.noSearch}>
            <Text style={styles.noSearchText}>
              No se ha Encontrado el Producto
            </Text>
          </View>
        )}

        {productos.length === 0 && !productoNoEncontrado && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 24, color: "#FFF", fontWeight: "900" }}>
              No hay Productos Disponibles
            </Text>
          </View>
        )}

        {productos.length !== 0 && !isLoading && (<View style={styles.tableProductos}>
        
          <FlatList
            data={productos}
            keyExtractor={(item) => item.ID_PRODUCTO}
            renderItem={({ item }) => (
              <Item
                nombre={item.PRODUCTO}
                descripcion={item.DESCRIPCION}
                cantidad={item.CANTIDAD}
                precio={item.PRECIO}
                agregar={() => agregarProductoAlCarrito(item)}
              />
            )}
          />

        </View>)}

          {isLoading && productos.length === 0 && !productoNoEncontrado &&(<View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fee03e" />
          </View>)}
          
      </View>

      <View style={{ alignItems: "center", marginTop: 6 }}>
        <TouchableOpacity
          onPress={() => {
            setModalVenta(true);
          }}
          style={
            clienteSeleccionado.NOMBRE === "" ? styles.NoverCar : styles.verCar
          }
          disabled={clienteSeleccionado.NOMBRE === ""}
        >
          <Entypo name="shopping-cart" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVenta}>
        <ProcesarVenta
          setModalVenta={setModalVenta}
          productosCarrito={productosCarrito}
          fecha={fecha}
          setFecha={setFecha}
          setProductosCarrito={setProductosCarrito}
          productos={productos}
          setProductos={setProductos}
          clienteSeleccionado={clienteSeleccionado}
          closeForm={closeForm}
          cargarVentas={cargarVentas}
          cargarProductos={cargarProductos}
          TasaBolivares={TasaBolivares}
          TasaPesos={TasaPesos}
        />
      </Modal>

      <Modal
        animationType="fade"
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
    borderRadius: 12,
    width: "50%",
    alignItems: "center",
  },
  NoverCar: {
    backgroundColor: "#888",
    padding: 8,
    borderRadius: 12,
    width: "50%",
    alignItems: "center",
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
    width: "20%",
  },
  BtnCalendar: {
    backgroundColor: "#1b72b5",
    padding: 5,
    borderRadius: 10,
    width: "20%",
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
    color: "#FFF",
  },
  noSearch: {
    marginTop: 25,
  },
  noSearchText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FFF",
    textTransform: "uppercase",
  },
  tableProductos: {
    width: "90%",
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 20,
    maxHeight: 445,
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
    fontSize: 20,
    textTransform: "capitalize",
    color: "#000",
    fontStyle: "italic",
  },
  defecto: {
    fontSize: 15,
    color: "#888",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  defectoDescripcion:{
    fontSize: 16,
    color: "#000",
    fontWeight: "800",
    
  },
  btnAgregarProducto: {
    backgroundColor: "#0e6a00",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnAgregarProductoDisable: {
    backgroundColor: "#888",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    paddingVertical: 200
  },
});
