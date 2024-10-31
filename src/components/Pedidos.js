import React, { useState} from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal} from "react-native";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import FormularioPedidos from "./sub-components/FormularioPedidos";

const Pedidos = () => {

  const [formPedidos, setFormPedidos] = useState(false);
  
  const DATA = [
    {
      id: "1",
      cliente: "Jesus Argenis",
      FechaPedido: "01-10-2024",
      EstadoPedido: "Pendiente",
    },
    {
      id: "2",
      cliente: "Claudia Sanz",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "3",
      cliente: "Ivan Cardozo",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "4",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "5",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "6",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "7",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "8",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "9",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
    {
      id: "10",
      cliente: "Pedro Perez",
      FechaPedido: "00-00-0000",
      EstadoPedido: "Pendiente",
    },
  ];

  const Item = ({ cliente, FechaPedido, EstadoPedido }) => (
    <View style={styles.item}>
      <Text style={styles.nombreCliente}>{cliente}</Text>
      <Text style={styles.fechaPedido}>{FechaPedido}</Text>
      <Text style={styles.estadoPedido}>{EstadoPedido}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pedidosText}>
          Pedidos <Text style={styles.pedidosTextBold}>Pendientes</Text>
        </Text>
        <TouchableOpacity 
        style={styles.BtnPedido}
        onPress={() => {
          setFormPedidos(true);
        }}
        >
          <MaterialIcons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tablePedidosPendientes}>
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item
              cliente={item.cliente}
              FechaPedido={item.FechaPedido}
              EstadoPedido={item.EstadoPedido}
            />
          )}
        />
      </View>

      <Modal
      visible={formPedidos}
      animationType="fade"
      >
        <FormularioPedidos
        setFormPedidos={setFormPedidos}
        />
      </Modal>

      
    </View>
  );
};

export default Pedidos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-evenly'
  },
  BtnPedido:{
    backgroundColor:'#358cd0',
    padding: 10,
    borderRadius: 50
  },
  pedidosText: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
    marginVertical: 20,
  },
  pedidosTextBold: {
    color: "#fcd53f",
  },
  tablePedidosPendientes: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    borderTopColor: "#000",
    borderTopWidth: 1,
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderBottomColor: "#000",
    borderBottomWidth: 0.2,
    alignItems: "center",
  },
  nombreCliente: {
    fontSize: 22,
    fontWeight: "700",
  },
  fechaPedido: {
    fontSize: 16,
    fontWeight: "500",
  },
  estadoPedido: {
    fontSize: 16,
    fontWeight: "500",
    color: "red",
  },
});
