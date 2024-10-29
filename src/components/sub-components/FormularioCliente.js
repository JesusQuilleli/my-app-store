import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Foundation from "@expo/vector-icons/Foundation";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

//ALMACENAMIENTO LOCAL
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//URL
import { url } from "./../../helpers/url";

const FormularioCliente = ({
  setFormClientes,
  cargarClientes,
  modalInformacionCliente,
  closeFormCliente,
  cliente,
  closeInfoCliente,
  setOptions
}) => {
  //CARGA
  const [isLoading, setIsLoading] = useState(false);

  //ALMACEN DE DATOS CLIENTE
  const [nombre, setNombre] = useState(cliente ? cliente.NOMBRE : "");
  const [telefono, setTelefono] = useState(cliente ? cliente.TELEFONO : "");
  const [correo, setCorreo] = useState(cliente ? cliente.EMAIL : "");
  const [direccion, setDireccion] = useState(cliente ? cliente.DIRECCION : "");

  const sendClient = async () => {
    const adminId = await AsyncStorage.getItem("adminId");
    try {
      setIsLoading(true);

      //FECHA EN FORMATO PARA SER ACEPTADA POR MYSQL DATE
      const formattedFecha = new Date().toISOString().split("T")[0];

      const response = await axios.post(`${url}/insertarCliente`, {
        nombre,
        telefono,
        correo,
        direccion,
        fecha: formattedFecha,
        adminId,
      });

      if (response.status === 200) {
        await cargarClientes();

        Alert.alert("Éxito", "Cliente registrado correctamente", [
          {
            text: "OK",
            onPress: () => {
              setFormClientes(false);
            },
          },
        ]);
      } else {
        Alert.alert("Error", "No se pudo registrar el cliente");
      }
    } catch (err) {
      console.log("Error al registrar el cliente:", err);
      Alert.alert(
        "Error",
        "Ocurrió un error al intentar registrar el producto"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (id_cliente) => {
    try {
      setIsLoading(true);

      const response = await axios.put(`${url}/updateCliente/${id_cliente}`, {
        nombre,
        telefono,
        correo,
        direccion,
      });

      if (response.status === 200) {
        await cargarClientes();

        Alert.alert("Éxito", "Cliente modificado correctamente", [
          {
            text: "OK",
            onPress: () => {
              closeInfoCliente();
              setFormClientes(false);
            },
          },
        ]);
      } else {
        Alert.alert("Error", "No se pudo modificar el cliente");
      }
    } catch (err) {
      console.log('Error al Modificar', err)
    } finally {
      setIsLoading(false);
    }
  };

  const clean = () => {
    setNombre("");
    setTelefono("");
    setCorreo("");
    setDireccion("");
  };

  const handleCliente = () => {
    if (!nombre || !telefono || !correo || !direccion) {
      Alert.alert("Error", "Los campos Son Obligatorios");
      return;
    }

    if (telefono < 0) {
      Alert.alert("Error", "El Telefono no puede ser Negativo");
      return;
    }

    sendClient();
    clean();
  };

  const handleEditarCliente = async () => {
    const clientInteger = parseInt(cliente.ID_CLIENTE);
    
      
    if (!nombre || !telefono || !correo || !direccion) {
      Alert.alert(
        "Error al Modificar",
        "Los campos Nombre, Telefono, Correo, Direccion, Son Obligatorios"
      );
      return;
    }

    try {
      await updateClient(clientInteger);
    } catch (error) {
      console.error("Error al modificar el cliente:", error);
    }
  };

  return (
    <ScrollView>
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
        <View style={styles.header}>
          {modalInformacionCliente ? (
            <Text style={styles.titulo}>Editar Cliente</Text>
          ) : (
            <Text style={styles.titulo}>Agregar Cliente</Text>
          )}
        </View>
        <View style={styles.containerImage}>
          <Image
            source={require("../../../assets/resources/perfil.webp")}
            style={styles.boxImage}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.icon}>
            <MaterialIcons
              name="drive-file-rename-outline"
              size={28}
              color="#888"
            />
          </Text>
          <TextInput
            placeholder="Nombre"
            style={styles.input}
            value={nombre}
            onChangeText={(nombre) => {
              setNombre(nombre);
            }}
            keyboardType="default"
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.icon}>
            <Foundation name="telephone" size={28} color="#888" />
          </Text>
          <TextInput
            placeholder="Telefono"
            style={styles.input}
            value={telefono}
            onChangeText={(telefono) => {
              setTelefono(telefono);
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.icon}>
            <MaterialIcons name="email" size={28} color="#888" />
          </Text>
          <TextInput
            placeholder="Correo"
            value={correo}
            onChangeText={(correo) => {
              setCorreo(correo);
            }}
            style={styles.input}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.icon}>
            <MaterialIcons name="directions-bike" size={30} color="#888" />
          </Text>

          <TextInput
            placeholder="Direccion"
            value={direccion}
            onChangeText={(direccion) => {
              setDireccion(direccion);
            }}
            style={styles.input}
          />
        </View>

        {modalInformacionCliente ? (
          <TouchableOpacity
            style={styles.btnAgregarCliente}
            onPress={handleEditarCliente}
          >
            <Text style={styles.btnAgregarClienteText}>
              <FontAwesome5 name="user-edit" size={40} color="black" />
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.btnAgregarCliente}
            onPress={handleCliente}
          >
            <Text style={styles.btnAgregarClienteText}>
              <FontAwesome6 name="person-circle-plus" size={40} color="black" />
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.containerButton}>
          {modalInformacionCliente ? (
            <TouchableOpacity
              style={styles.btnAtras}
              onPress={() => {
                closeFormCliente();
                setOptions(false);
              }}
            >
              <AntDesign name="caretdown" size={35} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnAtras}
              onPress={() => {
                setFormClientes(false);
              }}
            >
              <AntDesign name="caretdown" size={35} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default FormularioCliente;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    backgroundColor: "#fee03e",
    height: 80,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titulo: {
    textAlign: "left",
    marginTop: 20,
    marginLeft: 25,
    fontSize: 30,
    color: "#000",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  containerImage: {
    marginTop: 30,
  },
  boxImage: {
    margin: "auto",
    width: 120,
    height: 120,
    borderRadius: 50,
    marginBottom: 8,
  },
  campo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginHorizontal: 20,
    marginVertical: 25,
  },
  input: {
    width: "70%",
    height: 40,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    letterSpacing: 2,
  },
  icon: {
    color: "#888",
    marginTop: 10,
  },
  btnAtras: {
    alignItems: "center",
    marginTop: 25,
    marginRight: 10,
    borderRadius: 25,
    padding: 8,
    backgroundColor: "#888",
  },
  containerButton: {
    position: "absolute",
    right: 10,
    top: -10,
  },
  btnAgregarCliente: {
    backgroundColor: "#fee03a",
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 90,
    marginVertical: 50,
    borderColor: "#000",
    borderWidth: 1,
  },
  btnAgregarClienteText: {
    textAlign: "center",
  },
});
