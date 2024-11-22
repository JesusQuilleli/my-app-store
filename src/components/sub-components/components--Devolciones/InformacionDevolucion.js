import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { formatearFechaOtroFormato } from "../../../helpers/validaciones";

const InformacionDevolucion = ({
  setModalInformacionDevolucion,
  devolucionSeleccionada,
}) => {

  const Item = ({
    CLIENTE,
    FECHA_DEVOLUCION,
    NOMBRE,
    CANTIDAD,
    MOTIVO,
    VENTA_ID,
  }) => (
    <View style={styles.item}>
      <Text style={styles.defecto}>CLIENTE </Text>
      <Text style={styles.nombreProducto}>{CLIENTE}</Text>
      <Text style={styles.defecto}>Fecha de Devolucion</Text>
      <Text
        style={{ fontSize: 16, color: "#000", fontWeight: "900", fontSize: 22 }}
      >
        {formatearFechaOtroFormato(FECHA_DEVOLUCION)}
      </Text>
      <Text style={styles.defecto}>Productos</Text>
      <Text
        style={{ fontSize: 16, color: "#000", fontWeight: "900", fontSize: 22 }}
      >
        {NOMBRE} {CANTIDAD} <Text style={{ fontSize: 15 }}>Unidades</Text>
      </Text>
      <Text style={styles.defecto}>Motivo</Text>
      <Text
        style={{ fontSize: 16, color: "#000", fontWeight: "900", fontSize: 22 }}
      >
        {MOTIVO}
      </Text>
      <Text style={[styles.defecto, { textAlign: "center" }]}>
        Referencia de Venta Eliminada
      </Text>
      <Text
        style={{ fontSize: 16, color: "#000", fontWeight: "900", fontSize: 22 }}
      >
        {VENTA_ID}
      </Text>
    </View>
  );

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>DETALLES DE LA DEVOLUCION</Text>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => setModalInformacionDevolucion(false)}
          >
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={devolucionSeleccionada}
          keyExtractor={(item) => item.ID_DEVOLUCION}
          style={styles.tablePagos}
          renderItem={({ item }) => (
            <Item
              CLIENTE={item.CLIENTE}
              FECHA_DEVOLUCION={item.FECHA_DEVOLUCION}
              NOMBRE={item.NOMBRE}
              CANTIDAD={item.CANTIDAD}
              MOTIVO={item.MOTIVO}
              VENTA_ID={item.VENTA_ID}
            />
          )}
        />
      </View>
    </View>
  );
};

export default InformacionDevolucion;

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
    textAlign: "center",
  },
  btnClose: {
    position: "absolute",
    top: -20,
    right: -18,
  },
  motivoText: {
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: "900",
    paddingVertical: 10,
  },
  tablePagos: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    width: "100%",
  },
  nombreProducto: {
    fontSize: 20,
    fontWeight: "800",
  },
  defecto: {
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "700",
    color: "#888",
  },
  item: {
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 0.5,
  },
});
