import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

import axios from "axios";
import { url } from "../../../helpers/url.js";

//ALMACENAMIENTO LOCAL
import AsyncStorage from "@react-native-async-storage/async-storage";

import FontAwesome from "@expo/vector-icons/FontAwesome";

const FormularioCategoria = ({
  setModalCategoria,
  categorias,
  setCategorias,
  cargarCategorias,
}) => {

  const [nombreCategoria, setNombreCategoria] = useState("");

  const agregarCategoria = async () => {
    try {
      const adminId = await AsyncStorage.getItem("adminId");
      if (!nombreCategoria) {
        Alert.alert(
          "Campo Obligatorio",
          "Ingresa El Nombre de la Categoria que deseas Agregar."
        );
        return;
      }

      const response = await axios.post(`${url}/agregarCategoria`, {
        NOMBRE: nombreCategoria,
        ADMINISTRADOR_ID: adminId,
      });

      if (response.status === 200) {
        await cargarCategorias();
        Alert.alert("Vale", "Categoria registrada", [
          {
            text: "OK",
            onPress: () => {
              setNombreCategoria("");
            },
          },
        ]);
      } else {
        console.error("Error en el Front - end al Registrar Categoria");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const eliminarCategoria = async (ID_CATEGORIA) => {
    // Mostrar alerta de confirmación

    console.log(ID_CATEGORIA);
    

    Alert.alert(
      "Eliminar Categoria",
      "¿Estás seguro de que deseas eliminar esta categoria?",
      [
        {
          text: "Cancelar", // Opción para cancelar la eliminación
          style: "cancel",
        },
        {
          text: "Eliminar", // Opción para confirmar la eliminación
          onPress: async () => {
            try {
              const response = await axios.delete(
                `${url}/eliminarCategoria/${ID_CATEGORIA}`
              );
              if (response.status === 200) {
                Alert.alert("Éxito", "Categoria Eliminada correctamente", [
                  {
                    text: "OK",
                    onPress: async () => {
                      await cargarCategorias();
                    },
                  },
                ]);
              } else {
                console.log("No se pudo eliminar la Categoria");
              }
            } catch (error) {
              console.error("Error al eliminar la categoria:", error);
            }
          },
          style: "destructive", // Cambia el estilo para dar un aspecto más serio
        },
      ],
      { cancelable: true } // Permite cancelar tocando fuera de la alerta
    );
  };

  const Item = ({ NOMBRE, ELIMINAR }) => (
    <View style={styles.item}>
      <View style={styles.containerItem}>
        <Text style={styles.nombre}>{NOMBRE}</Text>
        <TouchableOpacity style={styles.btnEliminar} onPress={ELIMINAR}>
          <Text style={styles.btnEliminarText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Categorias</Text>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => setModalCategoria(false)}
          >
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.ContainerAgregarCategoria}>
          <TextInput
            placeholder="Ingrese el nombre"
            style={styles.inputAgregar}
            maxLength={20}
            value={nombreCategoria}
            onChangeText={(value) => {
              setNombreCategoria(value);
            }}
          />
          <TouchableOpacity
            onPress={agregarCategoria}
            style={styles.btnAgregarCategoria}
          >
            <Text style={styles.btnAgregarCategoriaText}>Agregar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tableCategorias}>
          <FlatList
            data={categorias}
            renderItem={({ item }) => (
              <Item
                ID_CATEGORIA={item.ID_CATEGORIA}
                NOMBRE={item.NOMBRE}
                ELIMINAR={() => eliminarCategoria(item.ID_CATEGORIA)}
              />
            )}
            keyExtractor={(item) => item.ID_CATEGORIA.toString()}
          />
        </View>
      </View>
    </View>
  );
};

export default FormularioCategoria;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 0.5,
    width: "100%",
  },
  titulo: {
    fontSize: 18,
    textTransform: "uppercase",
    color: "#888",
    padding: 5,
    fontWeight: "bold",
  },
  btnClose: {
    position: "absolute",
    top: -20,
    right: -18,
  },
  inputBuscar: {
    width: "40%",
    textAlign: "center",
    letterSpacing: 1,
  },
  tableCategorias: {
    width: "100%",
    marginTop: 10,
    borderRadius: 25,
    overflow: "hidden",
    maxHeight: 250,
    marginTop: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 10,
  },
  containerItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
  },
  btnEliminar: {
    backgroundColor: "#f00",
    padding: 8,
    borderRadius: 12,
  },
  btnEliminarText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFF",
  },
  ContainerAgregarCategoria: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 0.5,
    width: "100%",
    marginVertical: 5,
  },
  inputAgregar: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
    width: '60%'
  },
  btnAgregarCategoria: {
    backgroundColor: "#0eca00",
    padding: 8,
    borderRadius: 24,
    marginVertical: 8,
  },
  btnAgregarCategoriaText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
  },
});
