import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import Entypo from "@expo/vector-icons/Entypo";

const Pagos = ({ setModalPagos }) => {
  const DATA = [
    { id: "1", title: "Jesus Argenis", fecha: "00/00/2000", monto: "$100" },
    { id: "2", title: "Cliente 2", fecha: "01/01/2001", monto: "$200" },
    { id: "3", title: "Cliente 3", fecha: "02/02/2002", monto: "$300" },
    { id: "4", title: "Cliente 4", fecha: "03/03/2003", monto: "$400" },
    { id: "5", title: "Cliente 5", fecha: "04/04/2004", monto: "$500" },
    { id: "6", title: "Cliente 6", fecha: "05/05/2005", monto: "$600" },
    { id: "7", title: "Cliente 7", fecha: "06/06/2006", monto: "$700" },
    { id: "8", title: "Cliente 4", fecha: "03/03/2003", monto: "$400" },
    { id: "9", title: "Cliente 5", fecha: "04/04/2004", monto: "$500" },
    { id: "10", title: "Cliente 6", fecha: "05/05/2005", monto: "$600" },
    { id: "11", title: "Cliente 7", fecha: "06/06/2006", monto: "$700" },
  ];

  const Item = ({ title, fecha, monto }) => (
    <View style={styles.item}>
      <Text style={styles.nombreCliente}>
        {title}
      </Text>
      <Text style={styles.defecto}>Fecha de Pago {fecha}</Text>
      <Text style={styles.defecto}>Monto Pagado {monto}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => {
              setModalPagos(false);
            }}
            style={styles.btnAtras}
          >
            <Entypo name="arrow-long-left" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Pagos</Text>
        </View>
      </View>

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        style={styles.tablePagos}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              clientIndex(item.ID_CLIENTE);
            }}
          >
            <Item 
            title={item.title}
            fecha={item.fecha}
            monto={item.monto}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Pagos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    backgroundColor: "#fee03e",
    width: "100%",
    padding: 15,
  },
  titulo: {
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 90,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnAtras: {
    padding: 5,
  },
  tablePagos: {
    borderRadius: 15,
    overflow: "hidden",
    flex: 1,
    shadowColor: "#000",
    width: '100%'
  },
  nombreCliente:{
    fontSize: 18,
    fontWeight: '800'
  },
  defecto:{
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight:'700',
    color:'#888'
  },
  item: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomColor: "#000",
    borderBottomWidth: 0.2,
    alignItems:'center'
  },
});
