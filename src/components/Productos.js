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
} from "react-native";
import { Picker } from "@react-native-picker/picker";

//STYLES
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

//PETICIONES AL SERVIDOR
import axios from "axios";

//URL
import { url, urlBase } from "../helpers/url";

//COMPONENTE MODAL
import InformacionProductos from "./sub-components/InformacionProductos";
import FormularioProductos from "./sub-components/FormularioProductos";

//ALMACENAMIENTO LOCAL
import AsyncStorage from "@react-native-async-storage/async-storage";

const Productos = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({});
  const [modalproducto, setModalProducto] = useState(false);

  const [renderBusqueda, setRenderBusqueda] = useState(false);

  //FORMULARIO PARA AGREGAR PRODUCTOS
  const [formProducto, setFormProducto] = useState(false);

  //USE CARGAR CATEGORIAS
  useEffect(() => {
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
    cargarCategorias();
  }, []);

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
    } catch (error) {
      console.log("Error al cargar Productos", error);
    }
  };

  //USE CARGAR PRODUCTOS
  useEffect(() => {
    cargarProductos();
  }, []);

  //FUNCION PARA SELECCIONAR PRODUCTO
  const productIndex = (id) => {
    const productoSeleccionado = productos.find(
      (producto) => producto.ID_PRODUCTO === id
    );
    if (productoSeleccionado) {
      setProducto({
        ...productoSeleccionado,
        IMAGEN: `${urlBase}${productoSeleccionado.IMAGEN}`
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
        <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fcd53f" }}>
          {categoria}
        </Text>
        <Text style={{ fontWeight: "bold" }}>Marca: {nombre}</Text>
        <Text style={styles.defecto}>Precio: {precio} $</Text>
        <Text style={styles.defecto}>Cantidad: {cantidad} Unidades</Text>
      </View>
      <View style={styles.boxImagen}>
      <Text></Text>
      {!imagen.includes('null') ? (
        <Image source={{ uri: imagen }} style={styles.image} />
      ) : (
        <View><MaterialCommunityIcons name="image-remove" size={80} color="#fcd53f" /></View>
      )}
    </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Inventario <Text style={styles.tituloBold}>Productos</Text>
      </Text>

      <View style={styles.boxCategoria}>
        <Text style={styles.categoriasText}>Categorias</Text>
        <Picker
          style={styles.picker}
          selectedValue={categoriaSeleccionada}
          onValueChange={(itemValue) => setCategoriaSeleccionada(itemValue)}
        >
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
          style={styles.btnBusqueda}
          onPress={() => {
            setRenderBusqueda(!renderBusqueda);
          }}
        >
          <Text>
            <FontAwesome name="search" size={24} color="black" />
          </Text>
        </TouchableOpacity>
      </View>

      {renderBusqueda && (
        <View style={styles.boxInput}>
          <TextInput placeholder="Buscar Productos" style={styles.textInput} />
        </View>
      )}

      <View style={styles.tableProductos}>
        {productos && productos.length > 0 ? (
          <FlatList
            data={productos}
            keyExtractor={(item) => item.ID_PRODUCTO}
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
        ) : (
          <View style={styles.cNoProductos}>
            <Text style={styles.tNoProductos}>
              No hay productos registrados.
            </Text>
          </View>
        )}
      </View>

      <Modal visible={formProducto} animationType="slide">
        <FormularioProductos
          setFormProducto={setFormProducto}
          categorias={categorias}
          setCategoriaSeleccionada={setCategoriaSeleccionada}
          categoriaSeleccionada={categoriaSeleccionada}
          cargarProductos={cargarProductos}
        />
      </Modal>

      <Modal visible={modalproducto} animationType="slide">
        <InformacionProductos
          producto={producto}
          setProducto={setProducto}
          setModalProducto={setModalProducto}
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
    marginBottom: 5,
    width: "90%",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 15
  },
  textInput: {
    padding: 8,
  },
  picker: {
    width: 200,
  },
  tableProductos: {
    width: "90%",
    borderRadius: 25,
    overflow: "hidden",
    flex: 1,
  },
  categoria: {
    fontSize: 18,
    color: "#e2bf00",
    fontWeight: "600",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  textContainer: {
    flex: 1,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 25,
  },
  defecto: {
    color: "#666",
    fontSize: 16,
  },
  cNoProductos: {
    justifyContent: "center",
    alignItems: "center",
  },
  tNoProductos: {
    fontSize: 22,
    fontWeight: "bold",
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
});

export default Productos;
