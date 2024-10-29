import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Image
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import FormularioCliente from "./sub-components/FormularioCliente";
import InformacionCliente from "./sub-components/InformacionCliente";

//PETICIONES AL SERVIDOR
import axios from "axios";

//URLS
import {url} from './../helpers/url'

//ALMACENAMIENTO LOCAL
import AsyncStorage from "@react-native-async-storage/async-storage";

import SkeletonLoaderClientes from "../helpers/skeletonAnimatedClientes";

const Clientes = () => {

  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState({});

  const [formClientes, setFormClientes] = useState(false);
  const [modalInformacionCliente, setModalInformacionCliente] = useState(false);


  useEffect(() => {
    cargarClientes()
  }, [])

  const cargarClientes = async () => {
    try{
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

      const response = await axios.get(`${url}/cargarClientes/${adminId}`);
      const resultadoClientes = response.data.result;
      setClientes(resultadoClientes);
    } catch (error) {
      console.error("Ha ocurrido un error al cargar Clientes", error)
    }
  };

  const closeFormCliente = () => {
    setFormClientes(false);
  }

  const closeInfoCliente = () => {
    setModalInformacionCliente(false);
  }

  const  clientIndex = (id) => {
    const clienteSeleccionado = clientes.find(
      (client) => client.ID_CLIENTE === id
    );
    if (clienteSeleccionado) {
      setCliente(clienteSeleccionado);
      setModalInformacionCliente(true);
      
    } else {
      console.log("Cliente no Encontrado");
    }
  };

  const Item = ({ nombre }) => (
    <View style={styles.item}>
        <Image source={require('../../assets/resources/perfil.webp')} style={styles.boxImage}/>
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>
          {nombre}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Clientes</Text>
      <View style={styles.boxInput}>
        <TextInput
          placeholder="BUSCAR CLIENTES"
          placeholderTextColor="#ccc"
          style={{ textAlign: "center", letterSpacing: 6 }}
        />
      </View>

      <TouchableOpacity
        style={styles.btnCliente}
        onPress={() => {
          setFormClientes(!formClientes);
        }}
      >
        <AntDesign name="caretup" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={styles.tableClientes}>
        {clientes && clientes.length > 0 ? (
          <FlatList
          data={clientes}
          keyExtractor={(item) => item.ID_CLIENTE}
          renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => {  
              clientIndex(item.ID_CLIENTE);
            }}
            >
              <Item nombre={item.NOMBRE} />
            </TouchableOpacity>
          )}
        />
        ) : (<SkeletonLoaderClientes/>)}
      </View>

      <Modal visible={formClientes} animationType="slide">
        <FormularioCliente 
        setFormClientes={setFormClientes}
        cargarClientes={cargarClientes}/>
      </Modal>

      <Modal visible={modalInformacionCliente} animationType='fade'>
          <InformacionCliente 
          setModalInformacionCliente={setModalInformacionCliente}
          cliente={cliente}
          setCliente={setCliente}
          setFormClientes={setFormClientes}
          formClientes={formClientes}
          modalInformacionCliente={modalInformacionCliente}
          closeFormCliente={closeFormCliente}
          closeInfoCliente={closeInfoCliente}
          cargarClientes={cargarClientes}
          />
      </Modal>
    </View>
  );
};

export default Clientes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  titulo: {
    marginTop: 15,
    fontSize: 40,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 8,
  },
  boxInput: {
    backgroundColor: "#efefef",
    width: "75%",
    borderBottomColor: "#fcd53f",
    borderBottomWidth: 2,
    borderRadius: 10,
    padding: 8,
    marginTop: 15,
    textTransform: "uppercase",
  },
  btnCliente: {
    backgroundColor: "#439003",
    padding: 15,
    borderRadius: 50,
    position: "absolute",
    right: 0,
    bottom: 0,
    marginRight: 10,
    marginBottom: 10,
    zIndex: 20,
  },
  tableClientes: {
    marginTop: 20,
    width: "90%",
    borderRadius: 15,
    overflow: "hidden",
    flex: 1,
    maxHeight: 485,
    shadowColor: "#000",
  },
  item: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    padding: 10,
    borderBottomColor: "#000",
    borderBottomWidth: 0.2,
  },
  boxImage:{
    width: 50,
    height: 50,
    borderRadius: 50
  },
  itemText:{
    fontSize: 18,
    color:'#000',
    fontWeight:'900',
    letterSpacing: 3,
    marginLeft: 5
  },
  textContainer: {
    margin: 10,
  },
});
