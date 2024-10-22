import React, { useState } from "react";
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
}) => {
  //DATOS DEL PRODUCTO A LA BASE DE DATOS
  const [categoria, setCategoria] = useState(0);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [cantidad, setCantidad] = useState(0);
  const [image, setImage] = useState(null);

  //CARGA
  const [isLoading, setIsLoading] = useState(false);

  // Función para seleccionar la imagen
  const pickImage = async () => {
    // Pedir permiso de acceso a la galería
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

    // Abrir la galería para seleccionar una imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Si no se canceló la selección, actualiza la imagen
    if (!result.canceled) {
      setImage(result.assets[0].uri); // Asegurarse de que se usa la nueva estructura de `result`
    } else {
      console.log("Selección cancelada");
    }
  };

  const sendProduct = async () => {
    const adminId = await AsyncStorage.getItem("adminId");
    try {
      setIsLoading(true);

      // Crear un objeto FormData
      const formData = new FormData();
      formData.append("categoria", categoria);
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("cantidad", cantidad);
      formData.append("adminId", adminId);

      // Asegúrate de que 'image' contenga un URI válido
      if (image) {
        formData.append("imagen", {
          uri: image, // URI de la imagen seleccionada
          name: "imagen.jpg", // O el nombre del archivo
          type: "image/jpeg", // O el tipo de archivo correcto
        });
      } else {
        Alert.alert("Error", "No se ha seleccionado ninguna imagen.");
        return; // Salir si no hay imagen
      }

      // Esperar a que se registre el producto
      const response = await axios.post(`${url}/registerProduct`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Importante para enviar archivos
        },
      });

      // Mostrar los datos que se están enviando al backend
      console.log(categoria);
      console.log(nombre);
      console.log(descripcion);
      console.log(precio);
      console.log(cantidad);
      console.log(image);

      // Si la respuesta es exitosa
      if (response.status === 200) {
        // Llamar a la función para recargar los productos
        await cargarProductos();

        // Mostrar alerta de éxito
        Alert.alert("Éxito", "Producto registrado correctamente", [
          {
            text: "OK",
            onPress: () => {
              setFormProducto(false); // Cerrar el modal si todo está bien
            },
          },
        ]);
      } else {
        // Si no se registra correctamente
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

  const cleaningInputs = () => {
    setCategoria(0);
    setNombre("");
    setDescripcion("");
    setPrecio(0);
    setCantidad(0);
    setImage(null);

    setCategoriaSeleccionada("Seleccione Categoria");
    setFormProducto(false);
  };

  const handleProducto = () => {
    if (
      !categoria ||
      !nombre ||
      !descripcion ||
      !precio ||
      !cantidad ||
      !image
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (!validateEntero(cantidad)) {
      Alert.alert("Error", "La Cantidad debe ser un Numero Entero");
      return;
    }

    sendProduct();
    cleaningInputs();
  };

  return (
    <View style={styles.container}>
      <View></View>
      <ScrollView>
        <View style={styles.contenido}>
          <TouchableOpacity
            style={styles.btnCerrar}
            onPress={() => {
              setFormProducto(false);
            }}
          >
            <Ionicons name="close-sharp" size={30} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.titulo}>
            Agregar Productos al{" "}
            <Text style={styles.tituloBold}>Inventario</Text>
          </Text>
          <View style={styles.campo}>
            <Text style={styles.label}>Categoria</Text>

            <Picker
              style={styles.picker}
              selectedValue={categoriaSeleccionada}
              value={"Seleccione Categoria"}
              onValueChange={(itemValue) => {
                setCategoriaSeleccionada(itemValue);
                setCategoria(itemValue);
              }}
            >
              <Picker.Item label="Seleccione Categoria" value="" color="#ccc" />

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
          </View>
          <View style={styles.campo}>
            <Text style={styles.label}>Marca</Text>
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
                value={parseFloat(precio)}
                onChangeText={(precio) => setPrecio(precio)}
              />
              <Text style={[styles.label, styles.labelNumeric]}>Cantidad</Text>
              <TextInput
                style={[styles.Input, styles.InputNumeric]}
                placeholder=""
                placeholderTextColor={"#ccc"}
                keyboardType="numeric"
                value={parseInt(cantidad)}
                onChangeText={(cantidad) => setCantidad(cantidad)}
              />
            </View>
          </View>
          <View style={styles.campo}>
            <View style={styles.containerFoto}>
              {!image && <Text style={styles.label}>Seleccionar Imagen</Text>}

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
          <View style={styles.campo}>
            <TouchableOpacity
              style={styles.btnRegistrar}
              onPress={handleProducto}
            >
              <Text style={styles.btnRegistrarText}>Registrar Producto</Text>
            </TouchableOpacity>
          </View>
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
});
