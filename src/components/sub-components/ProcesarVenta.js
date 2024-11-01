import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";

import Checkbox from "expo-checkbox";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";

const ProcesarVenta = ({ setModalVenta, productosCarrito }) => {

  const Item = ({ nombre, cantidad, monto }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.cantidad}>{cantidad}</Text>
        <Text style={styles.monto}>{monto}</Text>
      </View>
      <TouchableOpacity style={styles.BtnMenos}>
        <AntDesign name="minus" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  const totalPrecio = productosCarrito.reduce((total, item) => total + item.PRECIO * item.CANTIDAD, 0);
  const totalCantidadProductos = productosCarrito.reduce((total, item) => total + item.CANTIDAD, 0);

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Productos en el Carrito</Text>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => {
              setModalVenta(false);
            }}
          >
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.tableVentas}>
            <FlatList
              data={productosCarrito}
              renderItem={({ item }) => (
                <Item
                  nombre={item.NOMBRE}
                  cantidad={item.CANTIDAD}
                  monto={item.PRECIO}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={styles.contentFecha}>
            <Text style={styles.textFecha}>FECHA VENTA</Text>
            <Text style={styles.textFecha}>10/12/2024</Text>
          </View>
          <View
            style={{ borderTopColor: "#000", borderTopWidth: 1, marginTop: 5 }}
          >
            <Text style={styles.tituloPago}>Tipo de Pago</Text>
          </View>
          <View style={styles.contentOpcionesPago}>
            <View style={styles.hijoOpcionesPago}>
              <Text style={styles.hijoOpcionesPagoText}>CUOTAS</Text>
              <Checkbox />
            </View>
            <View style={styles.hijoOpcionesPago}>
              <Text style={styles.hijoOpcionesPagoText}>AL CONTADO</Text>
              <Checkbox />
            </View>
          </View>
          <View style={styles.contentTotal}>
            <Text style={styles.textTotal}>TOTAL</Text>
            <Text style={styles.textTotal}>{totalPrecio}</Text>
          </View>
          <View style={styles.contentTotal}>
            <Text style={styles.textTotal}>CANTIDAD</Text>
            <Text style={styles.textTotal}>{totalCantidadProductos}</Text>
          </View>
          <View style={styles.primerAbono}>
            <Text style={styles.textAbono}>PRIMER ABONO</Text>
            <TextInput
            placeholder="500"
            keyboardAppearance='default'
            keyboardType="numeric"
            style={styles.keyAbono}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.BtnProcesarVenta}>
          <Text style={styles.BtnProcesarVentaText}>Procesar Venta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProcesarVenta;

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
    borderBottomColor: "#000",
    borderBottomWidth: 2,
  },
  titulo: {
    fontSize: 18,
    textTransform: "uppercase",
    color: "#000",
    padding: 5,
    fontWeight: "bold",
  },
  btnClose: {
    position: "absolute",
    top: -20,
    right: -18,
  },
  content: {
    marginTop: 20,
    width: "100%",
  },
  tableVentas: {
    width: "100%",
    marginTop: 10,
    borderRadius: 25,
    overflow: "hidden",
    maxHeight: 250,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  contentTotal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: "#000",
    borderTopWidth: 1,
    marginTop: 5,
  },
  primerAbono: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: "#000",
    borderTopWidth: 1,
    marginTop: 5,
  },
  contentFecha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: "#000",
    borderTopWidth: 1,
    marginTop: 20,
  },
  textFecha: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "800",
  },
  textTotal: {
    fontSize: 20,
    fontWeight: "800",
  },
  tituloPago: {
    textAlign: "center",
    marginVertical: 5,
    fontWeight: "900",
    fontSize: 12,
    textTransform: "uppercase",
  },
  contentOpcionesPago: {
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "space-between",
  },
  hijoOpcionesPago: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  hijoOpcionesPagoText: {
    fontSize: 12,
    fontWeight: "900",
  },
  textAbono:{
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2
  },
  keyAbono:{
    fontSize: 20,
    fontWeight: '900',
    width:'25%'
  },
  BtnMenos: {
    backgroundColor: "#F00",
    padding: 3,
    borderRadius: 50,
  },
  BtnProcesarVenta: {
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#fee03e",
    borderRadius: 5,
    padding: 8,
  },
  BtnProcesarVentaText: {
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "bold",
  },
});
