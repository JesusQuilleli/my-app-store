import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

//STYLES
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

//PETICIONES AL SERVIDOR
import axios from "axios";

//URL
import { url, urlBase } from "../helpers/url";

//COMPONENTE MODAL
import InformacionProductos from "./sub-components/InformacionProductos";
import FormularioProductos from "./sub-components/FormularioProductos";
import FormularioCategoria from "./sub-components/FormularioCategoria";

//ALMACENAMIENTO LOCAL
import AsyncStorage from "@react-native-async-storage/async-storage";

import SkeletonLoader from "./components--/skeletonAnimation";

const Productos = () => {
  //CATEGORIAS
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [modalCategoria, setModalCategoria] = useState(false);

  //PRODUCTOS
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({});

  const [productoNoEncontrado, setProductoNoEncontrado] = useState(false);

  const [modalproducto, setModalProducto] = useState(false);

  const [renderBusqueda, setRenderBusqueda] = useState(false);

  //FORMULARIO PARA AGREGAR PRODUCTOS
  const [formProducto, setFormProducto] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //TASAS
  const [verTasas, setVerTasas] = useState([]);


  //FUNCION CARGAR TASAS
  const cargarTasaUnica = async () => {
    const adminId = await AsyncStorage.getItem("adminId");
    try {
      const response = await axios.get(`${url}/verTasa/${adminId}`);
      console.log("Tasa de cambio:", response.data.data);
      setVerTasas(response.data.data); // Guarda la tasa única en el estado
    } catch (error) {
      console.error("Error al cargar la tasa de cambio:", error);
    }
  };

  //FUNCION CARGAR CATEGORIAS
  const cargarCategorias = async () => {
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
      const respuesta = await axios.get(`${url}/cargarCategorias/${adminId}`);
      const categoriasPlanas = respuesta.data.resultado
        ? respuesta.data.resultado[0]
        : [];
      setCategorias(categoriasPlanas);
    } catch (error) {
      console.log("Error al cargar categorías", error);
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
      setProductoNoEncontrado(false);
    } catch (error) {
      console.log("Error al cargar Productos", error);
    }
  };

  //FUNCION PARA FILTRAR CATEGORIAS
  const categoryFilter = async (categoria_id) => {
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
      const response = await axios.get(`${url}/filtrarCategorias/${adminId}`, {
        params: { categoria_id: categoria_id },
      });
      if (response) {
        setProductos(response.data.response);
      } else {
        console.error("Error al Filtrar Correctamente");
      }
    } catch (error) {
      console.error("Error al Filtrar Correctamente", error);
    }
  };

  //FUNCION BUSCAR PRODUCTOS
  const searchProducto = async (nombre) => {
    try {
      const response = await axios.get(`${url}/buscarProductos`, {
        params: { nombre: nombre },
      });

      if (response.data && response.data.response.length > 0) {
        setProductos(response.data.response);
        setProductoNoEncontrado(false);
      } else {
        console.log("No se encontraron productos.");
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

  //USE CARGAR PRODUCTOS
  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarTasaUnica();
  }, []);

  //USE PARA COMPONENTE DE CARGA SKELETON
  useEffect(() => {
    if (productos && productos.length > 0) {
      setIsLoading(false); // Cuando los productos se cargan, termina la animación
    }
  }, [productos]);

  //CALLBACK DE CERRAR EL MODAL DE INFORMACION AL ELIMINAR EL PRODUCTO
  const closeInformacion = () => {
    setModalProducto(false);
  };

  //FUNCION PARA SELECCIONAR PRODUCTO
  const productIndex = async (id) => {
    await cargarTasaUnica();
    const productoSeleccionado = productos.find(
      (producto) => producto.ID_PRODUCTO === id
    );
    if (productoSeleccionado) {
      setProducto({
        ...productoSeleccionado,
        IMAGEN: `${urlBase}${productoSeleccionado.IMAGEN}`,
      });
      setModalProducto(true);
    } else {
      console.log("Producto no encontrado");
    }
  };

  // CARGAR DATOS EN LA FLATLIST
  const Item = ({ categoria, nombre, precio, cantidad, imagen }) => (
    <View style={styles.item}>
      <View style={styles.textContainer}>
        <Text style={styles.categoriaText}>{categoria}</Text>
        <Text style={styles.nombreText}>{nombre}</Text>
        <Text style={styles.defecto}>Disponible: {cantidad}</Text>
        <Text style={styles.defecto}>{precio} $</Text>
      </View>
      <View style={styles.boxImagen}>
        {!imagen.includes("null") ? (
          <Image source={{ uri: imagen }} style={styles.image} />
        ) : (
          <View>
            <MaterialCommunityIcons
              name="image-remove"
              color="#888"
              size={120}
              style={{ height: 120, width: 120 }}
            />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <Text style={styles.titulo}>
          Inventario <Text style={styles.tituloBold}>Productos</Text>
        </Text>

        <View style={styles.boxCategoria}>
          <Text style={styles.categoriasText}>
            <Text style={{ color: "#000" }}>Filtrar por {"\n"}</Text>Categorias
          </Text>
          <Picker
            style={styles.picker}
            selectedValue={categoriaSeleccionada}
            onValueChange={(itemValue) => {
              if (itemValue === "all") {
                verProductos();
                setCategoriaSeleccionada(itemValue);
              } else {
                setCategoriaSeleccionada(itemValue);
                categoryFilter(itemValue);
              }
            }}
          >
            {categorias.length > 0 && (
              <Picker.Item label="Ver Todas" value="all" />
            )}

            {categorias && categorias.length > 0 ? (
              categorias.map((categoria) => (
                <Picker.Item
                  key={categoria.ID_CATEGORIA}
                  label={categoria.NOMBRE}
                  value={categoria.ID_CATEGORIA}
                />
              ))
            ) : (
              <Picker.Item label="No hay Categorias Registradas" value="" />
            )}
          </Picker>

          <TouchableOpacity
            style={styles.BtnCategoria}
            onPress={() => {
              setModalCategoria(true);
            }}
          >
            <MaterialIcons name="category" size={24} color="#FFF" />
          </TouchableOpacity>

          {productos.length > 0 && (
            <TouchableOpacity
              style={styles.btnBusqueda}
              onPress={() => {
                setRenderBusqueda(!renderBusqueda);
              }}
            >
              <Text>
                <FontAwesome name="search" size={24} color="black" />
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {productos && renderBusqueda && (
          <View style={styles.boxInput}>
            <TextInput
              placeholder="Buscar Productos"
              style={styles.textInput}
              onChangeText={(value) => {
                if (value.length > 0) {
                  searchProducto(value);
                } else {
                  verProductos();
                }
              }}
            />
          </View>
        )}

        {productoNoEncontrado && (
          <View style={styles.noSearch}>
            <Text style={styles.noSearchText}>
              No se ha Encontrado el Producto
            </Text>
          </View>
        )}

        <View style={styles.tableProductos}>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <FlatList
              data={productos}
              keyExtractor={(item) => item.ID_PRODUCTO}
              numColumns={2}
              columnWrapperStyle={styles.row}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onLongPress={() => productIndex(item.ID_PRODUCTO)}
                >
                  <Item
                    categoria={item.CATEGORIA}
                    nombre={item.PRODUCTO}
                    precio={item.PRECIO}
                    cantidad={item.CANTIDAD}
                    imagen={`${urlBase}${item.IMAGEN}`}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <Modal visible={modalCategoria} animationType="fade">
          <FormularioCategoria
            setModalCategoria={setModalCategoria}
            categorias={categorias}
            setCategorias={setCategorias}
            cargarCategorias={cargarCategorias}
          />
        </Modal>

        <Modal visible={formProducto} animationType="slide">
          <FormularioProductos
            setFormProducto={setFormProducto}
            categorias={categorias}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
            categoriaSeleccionada={categoriaSeleccionada}
            cargarProductos={cargarProductos}
            cargarCategorias={cargarCategorias}
            productos={productos}
          />
        </Modal>

        <Modal visible={modalproducto} animationType="fade">
          <InformacionProductos
            producto={producto}
            setProducto={setProducto}
            setModalProducto={setModalProducto}
            cargarProductos={cargarProductos}
            cargarCategorias={cargarCategorias}
            categorias={categorias}
            categoriaSeleccionada={categoriaSeleccionada}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
            closeInformacion={closeInformacion}
            verTasas={verTasas}
          />
        </Modal>

        <TouchableOpacity
          style={styles.btnAgregar}
          onPress={() => setFormProducto(true)}
        >
          <Text>
            <FontAwesome6 name="add" size={30} color="#fff" />
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  titulo: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "900",
  },
  tituloBold: {
    color: "#fcd53f",
    fontSize: 26,
  },
  row: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  rowSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  boxCategoria: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderColor: "#ccc",
    borderRadius: 25,
  },
  categoriasText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fcd53f",
  },
  btnBusqueda: {
    backgroundColor: "#fcd53f",
    padding: 10,
    borderRadius: 50,
    marginLeft: 5,
  },
  boxInput: {
    backgroundColor: "#efefef",
    marginBottom: 25,
    width: "90%",
    borderColor: "#fcd53f",
    borderWidth: 0.5,
    borderRadius: 15,
  },
  textInput: {
    padding: 8,
    color: "#ccc",
  },
  picker: {
    width: 160,
  },
  BtnCategoria: {
    backgroundColor: "#fcd53f",
    padding: 10,
    borderRadius: 50,
    marginLeft: 5,
  },
  tableProductos: {
    width: "90%",
    borderRadius: 25,
    overflow: "hidden",
    flex: 1,
  },
  cNoProductos: {
    justifyContent: "center",
    alignItems: "center",
  },
  tNoProductos: {
    fontSize: 46,
    fontWeight: "bold",
    color: "#000",
  },
  btnAgregar: {
    backgroundColor: "#2e252a",
    padding: 15,
    borderRadius: 50,
    position: "absolute",
    right: 0,
    bottom: 0,
    marginRight: 10,
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#fff",
    padding: 10,
    flex: 1,
    marginHorizontal: 25,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
    minHeight: 200,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  categoriaText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fcd53f",
    textAlign: "center",
  },
  nombreText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  defecto: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    fontWeight: "800",
  },
  boxImagen: {
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  // Skeleton styles
  skeletonItem: {
    width: "48%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    padding: 10,
  },
  skeletonImage: {
    height: 100,
    backgroundColor: "#d0d0d0",
    borderRadius: 5,
    marginBottom: 10,
  },
  skeletonText: {
    height: 20,
    backgroundColor: "#d0d0d0",
    borderRadius: 5,
    marginBottom: 5,
  },
  noSearch: {
    alignItems: "center",
    justifyContent: "center",
  },
  noSearchText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Productos;
