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
  Linking,
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
import InformacionProductos from "./sub-components/components--Productos/InformacionProductos";
import FormularioProductos from "./sub-components/components--Productos/FormularioProductos";
import FormularioCategoria from "./sub-components/components--Productos/FormularioCategoria";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

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
  //PRODUCTOS SELECCIONADOS PARA COMPARTIR
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [todosSeleccionados, setTodosSeleccionados] = useState(false);

  //ESTADO PARA CONOCER SI HAY PRODUCTOS
  const [productoNoEncontrado, setProductoNoEncontrado] = useState(false);
  const [modoSeleccion, setModoSeleccion] = useState(false);

  //MODA DE INFO PRODUCTOS
  const [modalproducto, setModalProducto] = useState(false);

  //BOTON DE BUSQUEDA
  const [renderBusqueda, setRenderBusqueda] = useState(false);

  //FORMULARIO PARA AGREGAR PRODUCTOS
  const [formProducto, setFormProducto] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //TASAS
  const [verTasas, setVerTasas] = useState([]);

  const TasaBolivares = verTasas.find((tasa) => tasa.MONEDA === "BOLIVARES")
    ? parseFloat(
        verTasas.find((tasa) => tasa.MONEDA === "BOLIVARES").TASA
      ).toFixed(2)
    : "No disponible";

  const TasaPesos = verTasas.find((tasa) => tasa.MONEDA === "PESOS")
    ? parseFloat(verTasas.find((tasa) => tasa.MONEDA === "PESOS").TASA).toFixed(
        0
      )
    : "No disponible";

  //NOTIFICACIONES

  

  //FUNCION CARGAR TASAS
  const cargarTasaUnica = async () => {
    const adminId = await AsyncStorage.getItem("adminId");
    try {
      const response = await axios.get(`${url}/verTasa/${adminId}`);
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

  //FUNCIONES COMPARTIR PRODUCTOS

  // Función para manejar la selección de todos los productos
  const toggleSeleccionTodos = () => {
    if (todosSeleccionados) {
      // Si ya están todos seleccionados, desmarcamos todos
      setProductosSeleccionados([]); // Vaciamos la lista de seleccionados
    } else {
      // Si no están seleccionados, los marcamos todos
      const todosLosProductos = productos.map(
        (producto) => producto.ID_PRODUCTO
      );
      setProductosSeleccionados(todosLosProductos); // Seleccionamos todos los productos
    }
    setTodosSeleccionados(!todosSeleccionados); // Invertir el estado de "todos seleccionados"
  };

  //SELECCIONAR PRODUCTO DINAMICAMENTE
  const toggleSeleccionProducto = (productoID) => {
    if (productosSeleccionados.includes(productoID)) {
      // Si el producto ya está seleccionado, lo desmarcamos
      setProductosSeleccionados((prev) =>
        prev.filter((id) => id !== productoID)
      );
    } else {
      // Si el producto no está seleccionado, lo seleccionamos
      setProductosSeleccionados((prev) => [...prev, productoID]);
    }
  };

  //COMPARTIR PRODUCTOS SELECCIONADOS WHATSAPP
  const compartirProductosSeleccionados = async () => {
    // Filtramos los productos seleccionados
    const productosParaCompartir = productos.filter((producto) =>
      productosSeleccionados.includes(producto.ID_PRODUCTO)
    );

    // Agrupamos los productos por categoría
    const productosPorCategoria = productosParaCompartir.reduce(
      (acc, producto) => {
        const categoria = producto.CATEGORIA || "Sin categoría"; // Si no tiene categoría, ponemos "Sin categoría"
        if (!acc[categoria]) {
          acc[categoria] = []; // Si no existe la categoría, la creamos
        }
        acc[categoria].push(producto); // Agregamos el producto a la categoría correspondiente
        return acc;
      },
      {}
    );

    // Creamos el mensaje
    const mensaje = Object.keys(productosPorCategoria)
      .map((categoria) => {
        // Para cada categoría, primero agregamos el nombre de la categoría
        const productosEnCategoria = productosPorCategoria[categoria]
          .map((producto) => {
            // Para cada producto dentro de la categoría, lo mostramos con su nombre, precio, etc.
            const nombre = String(producto.PRODUCTO || "Producto sin nombre");
            const descripcion = String(
              producto.DESCRIPCION || "Sin descripción"
            );
            const precioDolares = producto.PRECIO || "Precio no disponible";

            // Convertimos el precio a Bolívares y Pesos
            const precioBolivares =
              TasaBolivares !== "No disponible"
                ? (
                    parseFloat(precioDolares) * parseFloat(TasaBolivares)
                  ).toFixed(2)
                : "No disponible";
            const precioPesos =
              TasaPesos !== "No disponible"
                ? (parseFloat(precioDolares) * parseFloat(TasaPesos)).toFixed(0)
                : "No disponible";

            const cantidad =
              producto.CANTIDAD !== undefined
                ? String(producto.CANTIDAD)
                : "Cantidad desconocida";
            const imagen = producto.IMAGEN
              ? `${urlBase}${producto.IMAGEN}`
              : "Imagen no disponible";

            // Formato del producto con precio en diferentes monedas
            return `🛍️ *${nombre}*\n📝 *Descripción:* ${descripcion}\n💵 *Precio en Dólares:* ${precioDolares}$\n💰 *Precio en Bolívares:* ${precioBolivares} Bs\n💸 *Precio en Pesos:* ${precioPesos} MXN\n📦 *Disponible:* ${cantidad}\n📸 *Imagen:* ${imagen}\n`;
          })
          .join("\n");

        // Formato de la categoría y sus productos, con separador
        return `\n--------------------------------------------\n🌟 *${categoria}* 🌟\n--------------------------------------------\n${productosEnCategoria}`;
      })
      .join("\n"); // Separar las categorías con dos saltos de línea

    // Agregar una bienvenida
    const bienvenida = `🎉 *Shop-Mg* ¡Hola! Estos son mis Productos Disponibles. ¡Echa un vistazo!, ¡Estamos a la orden! 🛍️\n\n`;

    // Combine la bienvenida con el mensaje
    const mensajeCompleto = bienvenida + mensaje;

    try {
      // Compartir el mensaje con WhatsApp
      await Linking.openURL(
        `https://wa.me/?text=${encodeURIComponent(mensajeCompleto)}`
      );
    } catch (error) {
      console.log("Error al compartir:", error);
    }
  };

  //COMPARTIR PRODUCTOS SELECCIONADOS PDF
  const compartirProductosSeleccionadosPDF = async () => {
    // Filtramos los productos seleccionados
    const productosParaCompartir = productos.filter((producto) =>
      productosSeleccionados.includes(producto.ID_PRODUCTO)
    );

    // Agrupamos los productos por categoría
    const productosPorCategoria = productosParaCompartir.reduce(
      (acc, producto) => {
        const categoria = producto.CATEGORIA || "Sin categoría"; // Si no tiene categoría, ponemos "Sin categoría"
        if (!acc[categoria]) {
          acc[categoria] = []; // Si no existe la categoría, la creamos
        }
        acc[categoria].push(producto); // Agregamos el producto a la categoría correspondiente
        return acc;
      },
      {}
    );

    // Creamos el contenido HTML para el PDF
    const mensajeHTML = Object.keys(productosPorCategoria)
      .map((categoria, index) => {
        const productosEnCategoria = productosPorCategoria[categoria]
          .map((producto) => {
            const nombre = producto.PRODUCTO || "Producto sin nombre";
            const descripcion = producto.DESCRIPCION || "Sin descripción";
            const precioDolares = producto.PRECIO || "Precio no disponible";
            const precioBolivares =
              TasaBolivares !== "No disponible"
                ? (
                    parseFloat(precioDolares) * parseFloat(TasaBolivares)
                  ).toFixed(2)
                : "No disponible";
            const precioPesos =
              TasaPesos !== "No disponible"
                ? (parseFloat(precioDolares) * parseFloat(TasaPesos)).toFixed(0)
                : "No disponible";
            const cantidad = producto.CANTIDAD || "Cantidad desconocida";

            return `
              <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
                <h3 style="margin-bottom: 10px;">🛍️ ${nombre}</h3>
                <p>📝 <strong>Descripción:</strong> ${descripcion}</p>
                <p>💵 <strong>Precio en Dólares:</strong> ${precioDolares}$</p>
                <p>💰 <strong>Precio en Bolívares:</strong> ${precioBolivares} Bs</p>
                <p>💸 <strong>Precio en Pesos:</strong> ${precioPesos} MXN</p>
                <p>📦 <strong>Disponible:</strong> ${cantidad}</p>
              </div>
              <hr style="border: 1px dashed #ccc; margin: 20px 0;" />
            `;
          })
          .join("");

        return `
          <hr />
          <h2 style="color: #ff6600; text-align: center;">🌟 ${categoria} 🌟</h2>
          ${productosEnCategoria}
          ${
            index < Object.keys(productosPorCategoria).length - 1
              ? '<div style="page-break-before: always;"></div>'
              : ""
          }
        `;
      })
      .join("");

    const bienvenida = `<h1 style="text-align: center;">🎉 Shop-Mg</h1><p style="text-align: center;">¡Hola! Estos son mis Productos Disponibles. ¡Echa un vistazo!, ¡Estamos a la orden! 🛍️</p>`;
    const contenidoHTML = `<html><body style="font-family: Arial, sans-serif; padding: 20px;">${bienvenida}${mensajeHTML}</body></html>`;

    try {
      // Generar el PDF y definir el nombre del archivo
      const { uri } = await Print.printToFileAsync({
        html: contenidoHTML,
        fileName: "productos_disponibles", // Nombre del archivo PDF
      });

      // Compartir el PDF
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log("Error al generar o compartir el PDF:", error);
    }
  };


  // Item individual para cada producto
  const Item = ({
    categoria,
    nombre,
    precio,
    cantidad,
    imagen,
    productoID,
  }) => (
    <View
      style={[
        styles.item,
        productosSeleccionados.includes(productoID) && {
          backgroundColor: "#ccc",
        },
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.categoriaText}>{categoria}</Text>
        <Text style={styles.nombreText}>{nombre}</Text>
        <Text style={styles.defecto}>Disponible: <Text style={cantidad <= 5 ? ({color: 'red'}) : ({color: 'green'})}>{cantidad}</Text></Text>
        <Text style={styles.defecto}>{precio} $</Text>
      </View>
      <View style={styles.boxImagen}>
        {!imagen.includes("null") ? (
          <Image source={{ uri: imagen }} style={styles.image} />
        ) : (
          <MaterialCommunityIcons
            name="image-remove"
            color="#888"
            size={120}
            style={{ height: 120, width: 120 }}
          />
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
            <>
              <FlatList
                data={productos}
                keyExtractor={(item) => item.ID_PRODUCTO}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (!modoSeleccion) {
                        // Solo se ejecuta si no estamos en modo de selección
                        productIndex(item.ID_PRODUCTO);
                      } else if (productosSeleccionados.length === 0) {
                        setModoSeleccion(false);
                      } else {
                        toggleSeleccionProducto(item.ID_PRODUCTO);
                      }
                    }}
                    onLongPress={() => {
                      setModoSeleccion(true);
                      toggleSeleccionProducto(item.ID_PRODUCTO);
                    }}
                    delayLongPress={200}
                  >
                    <Item
                      categoria={item.CATEGORIA}
                      nombre={item.PRODUCTO}
                      precio={item.PRECIO}
                      cantidad={item.CANTIDAD}
                      imagen={`${urlBase}${item.IMAGEN}`}
                      productoID={item.ID_PRODUCTO}
                    />
                  </TouchableOpacity>
                )}
              />
            </>
          )}

          {modoSeleccion && productosSeleccionados.length > 0 && (
            <View style={styles.contentOpcionesP}>
              <TouchableOpacity
                onPress={async () => {
                  await compartirProductosSeleccionadosPDF();
                  setModoSeleccion(false);
                  setProductosSeleccionados([]);
                }}
                style={styles.botonPDF}
              >
                <FontAwesome6 name="file-pdf" size={24} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await compartirProductosSeleccionados();
                  setModoSeleccion(false);
                  setProductosSeleccionados([]);
                }}
                style={styles.botonCompartir}
              >
                <FontAwesome name="whatsapp" size={24} color="#FFF" />
              </TouchableOpacity>

              {modoSeleccion && productosSeleccionados.length > 0 && (
                <TouchableOpacity
                  onPress={toggleSeleccionTodos}
                  style={styles.botonSelectAll}
                >
                  {todosSeleccionados ? (
                    <MaterialCommunityIcons
                      name="close-thick"
                      size={24}
                      color="#000"
                    />
                  ) : (
                    <MaterialIcons
                      name="density-small"
                      size={24}
                      color="#FFF"
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
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
  contentOpcionesP: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginHorizontal: 40,
    borderTopWidth: 0.2,
    borderTopColor: "#000",
  },
  botonPDF: {
    backgroundColor: "#f00",
    padding: 15,
    margin: 10,
    borderRadius: 50,
    alignItems: "center",
  },
  botonCompartir: {
    backgroundColor: "#25D366",
    padding: 15,
    margin: 10,
    borderRadius: 50,
    alignItems: "center",
  },
  botonSelectAll: {
    alignItems: "center",
    backgroundColor: "#fcca28",
    padding: 15,
    margin: 10,
    borderRadius: 50,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textoBotonAll: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default Productos;
