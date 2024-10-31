import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

const FormularioPedidos = ({ setFormPedidos }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setFormPedidos(false);
          }}
        >
          <Ionicons name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Pedido <Text style={{color: '#fee03e'}}>Manual</Text></Text>
        <TouchableOpacity style={styles.verCar}>
          <Entypo name="shopping-cart" size={32} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.containerSelectClient}>
        <TouchableOpacity style={styles.BtnCliente}>
          <Ionicons name="person" size={40} color="#000" />
        </TouchableOpacity>
        <View style={styles.camposClientes}>
          <View style={styles.containerInputsClient}>
            <View style={styles.inputCampo}>
              <TextInput
                placeholder="Nombre"
                style={styles.input}
                editable={false}
              />
            </View>
            <View style={styles.inputCampo}>
              <TextInput
                placeholder="Correo"
                style={styles.input}
                editable={false}
              />
            </View>
            <View style={styles.inputCampo}>
              <TextInput
                placeholder="Telefono"
                style={styles.input}
                editable={false}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.padreProductos}>
        <Text style={styles.tituloProductos}>Productos Disponibles</Text>
        <View style={styles.containerProductos}>
          <Text>PRUEBA</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.BtnProcesarPedido}>
         <Text style={styles.BtnProcesarPedidoText}>Procesar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FormularioPedidos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#358cd0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10
  },
  verCar: {
    backgroundColor: "#fee03e",
    padding: 8,
    borderRadius: 50,
  },
  titulo: {
    textAlign: "center",
    marginVertical: 25,
    fontSize: 35,
    color: "#fff",
    fontWeight: "bold",
  },
  containerSelectClient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  BtnCliente: {
    backgroundColor: "#fee03e",
    padding: 10,
    borderRadius: 50,
  },
  camposClientes: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 25,
    width: "60%",
  },
  containerInputsClient: {
    flexDirection: "column",
    alignItems: "center",
  },
  inputCampo: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    marginVertical: 5,
    width: "90%",
  },
  input: {
    textAlign: "center",
  },
  padreProductos: {
    alignItems: "center",
  },
  tituloProductos: {
    textAlign: "center",
    marginVertical: 25,
    fontSize: 25,
    color: "#FFF",
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  containerProductos: {
    backgroundColor: "#f2f2f2",
    width: "90%",
    borderRadius: 25,
  },
  BtnProcesarPedido:{
   alignItems:'center',
   marginTop: 25,
   backgroundColor:'#fee03e',
   marginHorizontal: 60,
   borderRadius: 5,
   padding: 15
  },
  BtnProcesarPedidoText:{
   fontSize: 22,
   textTransform: 'uppercase',
   letterSpacing: 1,
   fontWeight: 'bold'
  }
});
