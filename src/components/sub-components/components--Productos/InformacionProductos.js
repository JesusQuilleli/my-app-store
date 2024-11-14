import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ScrollView,
} from "react-native";

//STYLES
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

//IMPORTS BACKEND
import axios from "axios";
import { url } from "../../../helpers/url";

//COMPONENTE FORMULARIO
import FormularioProductos from "./FormularioProductos";

const InformacionProductos = ({
  setModalProducto,
  producto,
  setProducto,
  categorias,
  setCategoriaSeleccionada,
  categoriaSeleccionada,
  cargarProductos,
  closeInformacion,
  verTasas,
}) => {
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

  const handleClose = () => {
    setModalProducto(false);
    setOptions(false);
    setProducto({});
  };

  //FUNCIONES ELIMINAR PRODUCTOS
  const deleteProduct = async (id_producto) => {
    try {
      const response = await axios.delete(
        `${url}/deleteProduct/${id_producto}`
      );
      if (response) {
        console.log("Producto Eliminado Correctamente", id_producto);
      } else {
        console.log("No se pudo eliminar el producto");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  };

  const handleEliminar = async () => {
    const productInteger = parseInt(producto.ID_PRODUCTO);

    // Mostrar alerta de confirmación
    Alert.alert(
      "Eliminar Producto",
      "¿Estás seguro de que deseas eliminar este producto?",
      [
        {
          text: "Cancelar", // Opción para cancelar la eliminación
          onPress: () => console.log("Eliminación cancelada"),
          style: "cancel",
        },
        {
          text: "Eliminar", // Opción para confirmar la eliminación
          onPress: async () => {
            try {
              await deleteProduct(productInteger); // Eliminar el producto
              cargarProductos();
              setModalProducto(false);
            } catch (error) {
              console.error("Error al eliminar el producto:", error);
            }
          },
          style: "destructive", // Cambia el estilo para dar un aspecto más serio
        },
      ],
      { cancelable: true } // Permite cancelar tocando fuera de la alerta
    );
  };

  const [options, setOptions] = useState(false);

  const [formProductoAcciones, setFormProducto] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>
        Informacion <Text style={styles.tituloBold}>Producto</Text>
      </Text>

      <View style={styles.contenido}>
        <View style={styles.campo}>
          <Text style={styles.label}>Categoria</Text>
          <Text style={styles.valor}>{producto.CATEGORIA}</Text>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.valor}>{producto.PRODUCTO}</Text>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Descripcion</Text>
          <Text style={styles.valor}>
            {producto.DESCRIPCION === "" || producto.DESCRIPCION === " " ? (
              <Text style={{ color: "#f00" }}>SIN DESCRIPCION</Text>
            ) : (
              producto.DESCRIPCION
            )}
          </Text>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Precio Compra</Text>
          <Text style={styles.valor}>{producto.PRECIO_COMPRA} $</Text>
        </View>
        <Text style={styles.label}>Conversión</Text>
        <View
          style={[
            styles.campo,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            },
          ]}
        >
          <Text style={styles.valor}>
            {isNaN(TasaBolivares) || TasaBolivares === 0 ? (
              <Text style={{ fontSize: 12 }}>No hay Tasas Cargadas</Text>
            ) : (
              (producto.PRECIO_COMPRA * TasaBolivares).toFixed(2)
            )}
            <Text style={{ fontSize: 12 }}>
                  {isNaN(TasaPesos) ? <Text></Text> : <Text> Bolivares</Text>}{" "}
                </Text>
          </Text>
          <Text style={styles.valor}>
            {isNaN(TasaPesos) || TasaPesos === 0 ? (
              <Text style={{ fontSize: 12 }}>Cargue las Tasas</Text>
            ) : (
              (producto.PRECIO_COMPRA * TasaPesos).toFixed(0)
            )}
            <Text style={{ fontSize: 12 }}>
                  {isNaN(TasaPesos) ? <Text></Text> : <Text> Pesos</Text>}{" "}
                </Text>
          </Text>
        </View>


        <View style={styles.campo}>
          <Text style={styles.label}>Precio Venta</Text>
          <Text style={styles.valor}>{producto.PRECIO} $</Text>
        </View>
        <Text style={styles.label}>Conversión</Text>
        <View
          style={[
            styles.campo,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            },
          ]}
        >
          <Text style={styles.valor}>
            {isNaN(TasaBolivares) || TasaBolivares === 0 ? (
              <Text style={{ fontSize: 12 }}>No hay Tasas Cargadas</Text>
            ) : (
              (producto.PRECIO * TasaBolivares).toFixed(2)
            )}
            <Text style={{ fontSize: 12 }}>
                  {isNaN(TasaPesos) ? <Text></Text> : <Text> Bolivares</Text>}{" "}
                </Text>
          </Text>
          <Text style={styles.valor}>
            {isNaN(TasaPesos) || TasaPesos === 0 ? (
              <Text style={{ fontSize: 12 }}>Cargue las Tasas</Text>
            ) : (
              (producto.PRECIO * TasaPesos).toFixed(0)
            )}
            <Text style={{ fontSize: 12 }}>
                  {isNaN(TasaPesos) ? <Text></Text> : <Text> Pesos</Text>}{" "}
                </Text>
          </Text>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Cantidad</Text>
          <Text style={styles.valor}>{producto.CANTIDAD}</Text>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Imagen</Text>
          {producto.IMAGEN.includes("null") ? (
            <View style={{ margin: "auto" }}>
              <MaterialCommunityIcons
                name="image-remove"
                size={200}
                color="#888"
              />
            </View>
          ) : (
            <Image source={{ uri: producto.IMAGEN }} style={styles.image} />
          )}
        </View>

        <View style={styles.boxAcciones}>
          <TouchableOpacity
            onPress={() => {
              setOptions(!options);
            }}
          >
            <Text
              style={[
                styles.label,
                {
                  textAlign: "center",
                  marginTop: 5,
                  padding: 10,
                  backgroundColor: "#2e252a",
                  borderRadius: 25,
                  color: "#FFF",
                },
              ]}
            >
              <SimpleLineIcons name="options" size={24} color="#FFF" />
            </Text>
          </TouchableOpacity>
          {options && (
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={styles.btnEditar}
                onPress={() => {
                  setFormProducto(!formProductoAcciones);
                }}
              >
                <Text style={{ textAlign: "center" }}>
                  <Feather name="edit" size={24} color="#fff" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnEliminar}
                onPress={handleEliminar}
              >
                <Text style={{ textAlign: "center" }}>
                  <AntDesign name="delete" size={24} color="black" />
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {formProductoAcciones && (
        <Modal animationType="slide">
          <FormularioProductos
            setFormProducto={setFormProducto}
            formProductoAcciones={formProductoAcciones}
            producto={producto}
            setProducto={setProducto}
            categorias={categorias}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
            categoriaSeleccionada={categoriaSeleccionada}
            setOptions={setOptions}
            cargarProductos={cargarProductos}
            setModalProducto={setModalProducto}
            closeInformacion={closeInformacion}
          />
        </Modal>
      )}

      <View>
        <TouchableOpacity style={styles.btnCerrar} onPress={handleClose}>
          <Text style={styles.btnCerrarTexto}>
            <Ionicons name="return-down-back" size={24} color="#FFF" />
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default InformacionProductos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fee03e",
  },
  titulo: {
    fontSize: 24,
    textAlign: "center",
    color: "#2e252a",
    marginTop: 30,
    fontWeight: "600",
    backgroundColor: "#FFF",
    padding: 5,
    borderRadius: 50,
    marginHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tituloBold: {
    fontSize: 26,
    color: "#fcd53f",
    fontWeight: "bold",
  },
  btnCerrar: {
    marginTop: 10,
    backgroundColor: "#2e252a",
    marginHorizontal: 60,
    padding: 20,
    borderRadius: 10,
  },
  btnCerrarTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
    textTransform: "uppercase",
  },
  contenido: {
    backgroundColor: "#fff",
    marginHorizontal: 30,
    marginTop: 25,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  campo: {
    marginBottom: 10,
  },
  label: {
    textTransform: "uppercase",
    color: "#374145",
    fontWeight: "600",
    fontSize: 12,
  },
  valor: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#334155",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 50,
    marginTop: 10,
    borderColor: "#fcd53f",
    borderWidth: 1,
  },
  boxAcciones: {
    position: "absolute",
    top: 0,
    right: 0,
    marginRight: 15,
    marginTop: 10,
  },
  btnEditar: {
    padding: 10,
    backgroundColor: "#80d7fb",
    borderRadius: 50,
    marginTop: 4,
  },
  btnEliminar: {
    padding: 10,
    backgroundColor: "#f10808",
    borderRadius: 50,
    marginTop: 4,
  },
});
