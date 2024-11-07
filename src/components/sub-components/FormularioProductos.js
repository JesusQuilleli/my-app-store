import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";

import { Picker } from "@react-native-picker/picker";

//import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import axios from "axios";
import { url } from "../../helpers/url";

//VALIDACIONES
import { validateEntero } from "../../helpers/validaciones";

//ALMACENAMIENTO LOCAL
import AsyncStorage from "@react-native-async-storage/async-storage";

const FormularioProductos = ({
  setFormProducto,
  categorias,
  setCategoriaSeleccionada,
  categoriaSeleccionada,
  cargarProductos,
  formProductoAcciones,
  productos,
  producto, // SE GUARDA EL PRODUCTO SELECCIONADO
  setOptions,
  closeInformacion,
}) => {
  //ALMACENAMIENTO DE DATOS DEL PRODUCTO A LA BASE DE DATOS
  const [categoria, setCategoria] = useState(
    producto ? producto.CATEGORIA_ID : 0
  );
  const [nombre, setNombre] = useState(producto ? producto.PRODUCTO : "");
  const [descripcion, setDescripcion] = useState(
    producto ? producto.DESCRIPCION : ""
  );
  const [precio, setPrecio] = useState(producto ? producto.PRECIO : 0);
  const [cantidad, setCantidad] = useState(producto ? producto.CANTIDAD : 0);
  const [image, setImage] = useState(null);

  //CARGA
  const [isLoading, setIsLoading] = useState(false);

  // FUNCION PARA SELECCIONAR LA IMAGEN
  const pickImage = async () => {
    // PERDIR PERMISO A LA GALERIA
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (galleryStatus !== "granted" || cameraStatus !== "granted") {
      Alert.alert(
        "Permisos requeridos",
        "Se necesita acceso a la galería y cámara para seleccionar imágenes."
      );
      return;
    }

    //ABRIR LA GALERIA
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      console.log("Selección cancelada");
    }
  };

  const sendProduct = async () => {
    const adminId = await AsyncStorage.getItem("adminId");
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("categoria", categoria);
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("cantidad", cantidad);
      formData.append("adminId", adminId);

      if (image) {
        formData.append("imagen", {
          uri: image,
          name: "imagen.jpg",
          type: "image/jpeg",
        });
      }

      const response = await axios.post(`${url}/registerProduct`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        await cargarProductos();

        Alert.alert("Éxito", "Producto registrado correctamente", [
          {
            text: "OK",
            onPress: () => {
              setFormProducto(false);
            },
          },
        ]);
      } else {
        Alert.alert("Error", "No se pudo registrar el producto");
      }
    } catch (error) {
      console.log("Error al registrar el producto:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al intentar registrar el producto"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id_producto) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("categoria", categoria);
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("cantidad", cantidad);

      if (image) {
        formData.append("imagen", {
          uri: image,
          name: "imagen.jpg",
          type: "image/jpeg",
        });
      }

      const response = await axios.put(
        `${url}/updateProduct/${id_producto}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        await cargarProductos();

        Alert.alert("Éxito", "Producto modificado correctamente", [
          {
            text: "OK",
            onPress: () => {
              setFormProducto(false);
              closeInformacion();
            },
          },
        ]);
      } else {
        Alert.alert("Error", "No se pudo modificar el producto");
      }
    } catch (error) {
      console.log("Error al modificar el producto:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al intentar modificar el producto"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cleaningInputs = () => {
    setCategoria(0);
    setNombre("");
    setDescripcion("");
    setPrecio(0);
    setCantidad(0);
    setImage(null);

    setCategoriaSeleccionada("Seleccione Categoria");
  };

  const handleProducto = () => {
    if (!categoria) {
      Alert.alert("Obligatorio", "La categoria es Requerida", [
        { text: "Vale" },
      ]);
      return;
    }

    if (!nombre) {
      Alert.alert("Obligatorio", "El nombre es Requerido", [{ text: "Vale" }]);
      return;
    }

    if (!precio) {
      Alert.alert("Obligatorio", "El precio es Requerido", [{ text: "Vale" }]);
      return;
    }

    if (precio < 0) {
      Alert.alert("Obligatorio", "Precio invalido.", [{ text: "Vale" }]);
      return;
    }

    if (!cantidad) {
      Alert.alert("Obligatorio", "La cantidad es Requerida", [
        { text: "Vale" },
      ]);
      return;
    }

    if (cantidad < 0) {
      Alert.alert("Obligatorio", "Cantidad Invalida. invalido.", [
        { text: "Vale" },
      ]);
      return;
    }

    if (
      cantidad.includes(",") ||
      cantidad.includes(" ") ||
      cantidad.includes("-")
    ) {
      Alert.alert(
        "Obligatorio",
        "No puede dejar espacios ni colocar una [ , ] ni colocar valores -"
      );
      return;
    }

    if (
      precio.includes(",") ||
      precio.includes(" ") ||
      precio.includes("-")
    ) {
      Alert.alert(
        "Obligatorio",
        "No puede dejar espacios ni colocar una [ , ] ni colocar valores -"
      );
      return;
    }

    if (!validateEntero(cantidad)) {
      Alert.alert("Error", "Cantidad Invalidad, procure usar numeros enteros.");
      return;
    }

    sendProduct();
    cleaningInputs();
  };

  const handleModificar = async () => {
    const productInteger = parseInt(producto.ID_PRODUCTO);

    if (!categoria) {
      Alert.alert("Obligatorio", "La categoria es Requerida", [
        { text: "Vale" },
      ]);
      return;
    }

    if (!nombre) {
      Alert.alert("Obligatorio", "El nombre es Requerido", [{ text: "Vale" }]);
      return;
    }

    if (!precio) {
      Alert.alert("Obligatorio", "El precio es Requerido", [{ text: "Vale" }]);
      return;
    }

    if (precio < 0) {
      Alert.alert("Obligatorio", "Precio invalido.", [{ text: "Vale" }]);
      return;
    }

    if (!cantidad) {
      Alert.alert("Obligatorio", "La cantidad es Requerida", [
        { text: "Vale" },
      ]);
      return;
    }

    if (cantidad < 0) {
      Alert.alert("Obligatorio", "Cantidad Invalida. invalido.", [
        { text: "Vale" },
      ]);
      return;
    }

    if (!validateEntero(cantidad)) {
      Alert.alert("Error", "Cantidad Invalidad, procure usar numeros enteros.");
      return;
    }

    if (!validateEntero(cantidad)) {
      Alert.alert("Error", "La Cantidad debe ser un Numero Entero");
      return;
    }

    try {
      await updateProduct(productInteger);
      cargarProductos();
    } catch (error) {
      console.error("Error al modificar el producto:", error);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(242, 243, 244, 0.8)",
            zIndex: 1000,
          }}
        >
          <ActivityIndicator
            size="large"
            color="#fee03e"
            style={{ transform: [{ scale: 2 }] }}
          />
        </View>
      )}
      <ScrollView>
        <View style={styles.contenido}>
          {producto ? (
            <TouchableOpacity
              style={styles.btnCerrar}
              onPress={() => {
                setFormProducto(false);
                setCategoriaSeleccionada("");
                setOptions(false);
              }}
            >
              <Ionicons name="close-sharp" size={30} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnCerrar}
              onPress={() => {
                setFormProducto(false);
                setCategoriaSeleccionada("");
              }}
            >
              <Ionicons name="close-sharp" size={30} color="#FFF" />
            </TouchableOpacity>
          )}

          {formProductoAcciones ? (
            <Text style={styles.titulo}>
              Modificar Producto del{" "}
              <Text style={styles.tituloBold}>Inventario</Text>
            </Text>
          ) : (
            <Text style={styles.titulo}>
              Agregar Producto al{" "}
              <Text style={styles.tituloBold}>Inventario</Text>
            </Text>
          )}

          <View style={styles.campo}>
            <Text style={styles.label}>Categoria</Text>

            {producto ? (
              <Picker
                style={styles.picker}
                selectedValue={
                  categoriaSeleccionada ? categoriaSeleccionada : null
                }
                onValueChange={(itemValue) => {
                  setCategoriaSeleccionada(itemValue);
                  setCategoria(itemValue);
                }}
              >
                <Picker.Item
                  label="Solo seleccione si desea cambiar"
                  value={producto.ID_CATEGORIA}
                  color="#888"
                  enabled={false}
                />

                {categorias && categorias.length > 0 ? (
                  categorias.map((categoria) => (
                    <Picker.Item
                      key={categoria.ID_CATEGORIA}
                      label={categoria.NOMBRE}
                      value={categoria.ID_CATEGORIA}
                      style={styles.pickerItem}
                      color="#433a3f"
                    />
                  ))
                ) : (
                  <Picker.Item label="Cargando categorías..." value="" />
                )}
              </Picker>
            ) : (
              <Picker
                style={styles.picker}
                selectedValue={categoriaSeleccionada}
                value={"Seleccione Categoria"}
                onValueChange={(itemValue) => {
                  setCategoriaSeleccionada(itemValue);
                  setCategoria(itemValue);
                }}
              >
                {productos.length > 0 && (
                  <Picker.Item
                    label="Seleccione Categoria"
                    value=""
                    color="#ccc"
                  />
                )}

                {categorias && categorias.length > 0 ? (
                  categorias.map((categoria) => (
                    <Picker.Item
                      key={categoria.ID_CATEGORIA}
                      label={categoria.NOMBRE}
                      value={categoria.ID_CATEGORIA}
                      style={styles.pickerItem}
                      color="#433a3f"
                    />
                  ))
                ) : (
                  <Picker.Item
                    label="Cargando... o no hay Categorias"
                    value=""
                  />
                )}
              </Picker>
            )}
          </View>
          <View style={styles.campo}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.Input}
              placeholder=""
              placeholderTextColor={"#ccc"}
              value={nombre}
              onChangeText={(marca) => setNombre(marca)}
            />
          </View>
          <View style={styles.campo}>
            <Text style={styles.label}>Descripción</Text>

            <TextInput
              style={[styles.Input, { height: 120, textAlignVertical: "top" }]}
              placeholder=""
              placeholderTextColor={"#ccc"}
              multiline={true}
              value={descripcion}
              onChangeText={(descrip) => setDescripcion(descrip)}
            />
          </View>
          <View style={styles.campo}>
            <View style={styles.campoNumeric}>
              <Text style={[styles.label, styles.labelNumeric]}>Precio</Text>

              <TextInput
                style={[styles.Input, styles.InputNumeric]}
                placeholder=""
                placeholderTextColor={"#ccc"}
                keyboardType="numeric"
                value={precio}
                onChangeText={(precio) => {
                  if (
                    precio.includes(",") ||
                    precio.includes(" ") ||
                    precio.includes("-")
                  ) {
                    Alert.alert(
                      "Obligatorio",
                      "No puede dejar espacios ni colocar una [ , ] ni colocar valores -"
                    );
                    return;
                  }
                  setPrecio(precio);
                }}
              />

              <Text style={[styles.label, styles.labelNumeric]}>Cantidad</Text>
              {producto ? (
                <TextInput
                  style={[styles.Input, styles.InputNumeric]}
                  placeholder=""
                  placeholderTextColor={"#ccc"}
                  keyboardType="numeric"
                  value={cantidad.toString()}
                  onChangeText={(cantidad) => {
                    if (
                      cantidad.includes(",") ||
                      cantidad.includes(" ") ||
                      cantidad.includes("-")
                    ) {
                      Alert.alert(
                        "Obligatorio",
                        "No puede dejar espacios ni colocar una [ , ] ni colocar valores -"
                      );
                      return;
                    }
                    setCantidad(cantidad);
                  }}
                />
              ) : (
                <TextInput
                  style={[styles.Input, styles.InputNumeric]}
                  placeholder=""
                  placeholderTextColor={"#ccc"}
                  keyboardType="numeric"
                  value={parseInt(cantidad)}
                  onChangeText={(cantidad) => {
                    if (
                      cantidad.includes(",") ||
                      cantidad.includes(" ") ||
                      cantidad.includes("-")
                    ) {
                      Alert.alert(
                        "Obligatorio",
                        "No puede dejar espacios ni colocar una [ , ] ni colocar valores -"
                      );
                      return;
                    }
                    setCantidad(cantidad);
                  }}
                />
              )}
            </View>
          </View>
          <View style={styles.campo}>
            <View style={styles.containerFoto}>
              {producto
                ? !image && (
                    <Text style={styles.label}>Seleccionar Nueva Imagen</Text>
                  )
                : !image && (
                    <Text style={styles.label}>Seleccionar Imagen</Text>
                  )}

              {image && <Text style={styles.label}>Seleccionada: </Text>}

              {!image && (
                <TouchableOpacity
                  style={styles.btnSeleccionarImagen}
                  onPress={pickImage}
                >
                  <Text style={styles.btnSeleccionarImagenText}>
                    <Entypo name="folder-images" size={24} color="black" />
                  </Text>
                </TouchableOpacity>
              )}

              {image && (
                <>
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 25,
                      borderColor: "#FFF",
                      borderWidth: 1,
                      marginVertical: 20,
                    }}
                  />

                  <TouchableOpacity
                    style={styles.btnLimpiar}
                    onPress={() => setImage(null)}
                  >
                    <Text style={styles.btnLimpiarText}>
                      <FontAwesome name="close" size={24} color="black" />
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          {formProductoAcciones ? (
            <View style={styles.campo}>
              <TouchableOpacity
                style={styles.btnModificar}
                onPress={handleModificar}
              >
                <Text style={styles.btnModificarText}>Modificar Producto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.campo}>
              <TouchableOpacity
                style={styles.btnRegistrar}
                onPress={handleProducto}
              >
                <Text style={styles.btnRegistrarText}>Registrar Producto</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default FormularioProductos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#433a3f",
  },
  titulo: {
    fontSize: 28,
    textAlign: "center",
    color: "#fee03a",
    fontWeight: "600",
    padding: 5,
    letterSpacing: 2,
  },
  tituloBold: {
    fontSize: 26,
    color: "#FFF",
    fontWeight: "bold",
  },
  contenido: {
    backgroundColor: "#433a3f",
    marginTop: 25,
    padding: 20,
  },
  label: {
    marginTop: 15,
    marginBottom: 10,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  labelNumeric: {
    marginHorizontal: 10,
  },
  campoNumeric: {
    flexDirection: "row",
    marginTop: 25,
  },
  Input: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
  },
  InputNumeric: {
    width: "25%",
  },
  btnCerrar: {
    position: "absolute",
    top: -15,
    right: 0,
    marginRight: 10,
    padding: 2,
    backgroundColor: "#fee03a",
    borderRadius: 50,
  },
  picker: {
    backgroundColor: "#FFF",
    borderRadius: 25,
  },
  pickerItem: {
    fontSize: 15,
    color: "#433a3f",
  },
  containerFoto: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnLimpiar: {
    backgroundColor: "#b40000",
    padding: 5,
    height: 50,
    width: 50,
    justifyContent: "center",
    borderRadius: 50,
    marginLeft: 25,
  },
  btnLimpiarText: {
    textAlign: "center",
  },
  btnSeleccionarImagen: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 25,
  },
  btnSeleccionarImagenText: {
    color: "#000",
    textAlign: "center",
  },
  btnRegistrar: {
    backgroundColor: "#fee03a",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 25,
  },
  btnRegistrarText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 18,
    color: "#FFF",
  },
  btnModificar: {
    backgroundColor: "#fee03a",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 25,
  },
  btnModificarText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 18,
    color: "#FFF",
  },
});
