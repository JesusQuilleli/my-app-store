import React, { useState, useEffect, useContext } from "react";
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
import FormularioCliente from "./sub-components/components--Clientes/FormularioCliente";
import InformacionCliente from "./sub-components/components--Clientes/InformacionCliente";

//PETICIONES AL SERVIDOR
import axios from "axios";

//URLS
import {url} from './../helpers/url'

//ALMACENAMIENTO LOCAL
import AsyncStorage from "@react-native-async-storage/async-storage";

import SkeletonLoaderClientes from "./components--/skeletonAnimatedClientes.js";

//CONTEXTO
import { PagosContext } from "./Context/pagosContext.js";

const Clientes = () => {

  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState({});

  const {cargarVentas, cargarPagos} = useContext(PagosContext);

  const [formClientes, setFormClientes] = useState(false);
  const [modalInformacionCliente, setModalInformacionCliente] = useState(false);

  const [clienteNoEncontrado, setClienteNoEncontrado] = useState(false);


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

  const verClientes = async () => {
    setClientes([]);
    await cargarClientes();
  };

  //FUNCION BUSCAR CLIENTE
  const searchCliente = async (nombre) => {
    try {
      const response = await axios.get(`${url}/buscarCliente`, {
        params: { nombre: nombre },
      });

      if (response.data && response.data.response.length > 0) {
        setClientes(response.data.response);
        setClienteNoEncontrado(false);
      } else {
        setClientes([]);
        setClienteNoEncontrado(true);
      }
    } catch (error) {
      console.log("Error en la busqueda Front-End", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Clientes</Text>
      <View style={styles.boxInput}>
        <TextInput
          placeholder="B U S C A R   C L I E N T E S"
          placeholderTextColor="#ccc"
          style={{textAlign:'center'}}
          onChangeText={(value) => {
            if (value.length > 0) {
              searchCliente(value);
            } else {
              verClientes();
              setClienteNoEncontrado(false);
            }
          }}
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

      {clienteNoEncontrado && (
          <View style={styles.noSearch}>
            <Text style={styles.noSearchText}>
              No se ha Encontrado el Cliente
            </Text>
          </View>
        )}

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
        ) : (!clienteNoEncontrado && <SkeletonLoaderClientes/>)}
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
          cargarVentas={cargarVentas}
          cargarPagos={cargarPagos}
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
    textTransform:'uppercase'
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
    marginLeft: 5
  },
  textContainer: {
    margin: 10,
  },
  noSearch: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  noSearchText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
