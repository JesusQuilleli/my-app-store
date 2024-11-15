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
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

import { formatearFecha } from "../../../helpers/validaciones";

import FormularioCliente from "./FormularioCliente.js";

import * as Clipboard from "expo-clipboard";

//AXIOS
import axios from "axios";

//URL
import { url } from "../../../helpers/url";

const InformacionCliente = ({
  setModalInformacionCliente,
  cliente,
  setCliente,
  setFormClientes,
  formClientes,
  modalInformacionCliente,
  closeFormCliente,
  closeInfoCliente,
  cargarClientes,
}) => {
  const [options, setOptions] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  //FUNCIONES ELIMINAR CLIENTES
  const eliminarCliente = async (id_cliente) => {
    try {
      const response = await axios.delete(
        `${url}/eliminarCliente/${id_cliente}`
      );
      if (response) {
        console.log("Cliente Eliminado Correctamente", id_cliente);
      } else {
        console.log("No se pudo eliminar el cliente");
      }
    } catch (error) {}
  };

  const handleEliminar = async () => {
    const clienteID = parseInt(cliente.ID_CLIENTE);

    // Mostrar alerta de confirmación
    Alert.alert(
      "Eliminar Producto",
      "¿Estás seguro de que deseas eliminar este cliente?",
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
              await eliminarCliente(clienteID); // Eliminar el producto
              cargarClientes();
              setModalInformacionCliente(false);
            } catch (error) {}
          },
          style: "destructive", // Cambia el estilo para dar un aspecto más serio
        },
      ],
      { cancelable: true } // Permite cancelar tocando fuera de la alerta
    );
  };

  // FUNCION PARA COPIAR TEXTO A PORTAPAPELES
  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    setCopiedText(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setModalInformacionCliente(false);
            setCliente({});
          }}
        >
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.buttonsContainer}>
          {options && (
            <TouchableOpacity
              style={[styles.Btn, styles.edit]}
              onPress={() => {
                setFormClientes(true);
              }}
            >
              <Foundation name="page-edit" size={30} color="#FFF" />
            </TouchableOpacity>
          )}

          {options && (
            <TouchableOpacity
              onPress={handleEliminar}
              style={[styles.Btn, styles.delete]}
            >
              <MaterialCommunityIcons
                name="delete-forever"
                size={30}
                color="black"
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.Btn, styles.option]}
            onPress={() => {
              setOptions(!options);
            }}
          >
            <SimpleLineIcons name="options-vertical" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View style={styles.campoNombre}>
          <Image
            source={require("./../../../../assets/resources/perfil.webp")}
            style={styles.boxImage}
          />
          <View style={styles.copyContent}>
            <Text style={styles.nombreCliente}>{cliente.NOMBRE}</Text>
          </View>
        </View>

        <View style={styles.campos}>
          <Entypo name="v-card" size={24} color="#000" />
          <Text style={styles.textCampos}>{cliente.CEDULA}</Text>

          <TouchableOpacity onPress={() => copyToClipboard(cliente.CEDULA)}>
            <MaterialIcons
              name="content-copy"
              size={20}
              color="black"
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.campos}>
          <FontAwesome5 name="phone-alt" size={24} color="black" />
          <Text style={styles.textCampos}>{cliente.TELEFONO}</Text>
          <TouchableOpacity onPress={() => copyToClipboard(cliente.TELEFONO)}>
            <MaterialIcons name="content-copy" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.campos}>
          <MaterialCommunityIcons name="email" size={26} color="black" />
          <Text style={styles.textCampos}>{cliente.EMAIL}</Text>
          <TouchableOpacity onPress={() => copyToClipboard(cliente.EMAIL)}>
            <MaterialIcons name="content-copy" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.campos}>
          <FontAwesome5 name="directions" size={24} color="black" />
          <Text style={styles.textCampos}>{cliente.DIRECCION}</Text>
        </View>

        <View style={styles.campos}>
          <MaterialIcons name="date-range" size={24} color="black" />
          <Text style={styles.textCampos}>
            {formatearFecha(cliente.FECHA_REGISTRO)}
          </Text>
        </View>
      </ScrollView>

      <Modal animationType="fade" visible={formClientes}>
        <FormularioCliente
          modalInformacionCliente={modalInformacionCliente}
          closeFormCliente={closeFormCliente}
          cliente={cliente}
          closeInfoCliente={closeInfoCliente}
          cargarClientes={cargarClientes}
          setFormClientes={setFormClientes}
          setOptions={setOptions}
        />
      </Modal>
    </View>
  );
};

export default InformacionCliente;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fee03e",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  Btn: {
    paddingHorizontal: 12,
    borderRadius: 50,
    marginHorizontal: 2,
  },
  edit: {
    backgroundColor: "#05b7eb",
    padding: 5,
  },
  delete: {
    backgroundColor: "#e71b03",
    padding: 5,
  },
  option: {
    padding: 5,
  },
  boxImage: {
    width: 120,
    height: 120,
    borderRadius: 50,
    marginVertical: 5,
  },
  nombreCliente: {
    marginVertical: 25,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  campoNombre: {
    alignItems: "center",
    marginTop: 20,
  },
  copyContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  campos: {
    margin: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  textCampos: {
    fontSize: 18,
  },
  copiedText: {
    //AGREGAR ESTILOS
  },
});
