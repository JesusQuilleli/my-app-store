import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import { formatearFecha } from "../../helpers/validaciones";

const InformacionVenta = ({
  setModalVentasDetalladas,
  ventasDetalladas,
  setVentasDetalladas,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => {
              setVentasDetalladas([]);
              setModalVentasDetalladas(false);
            }}
            style={styles.btnAtras}
          >
            <Entypo name="arrow-long-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.titulo}>INFORMACIÓN - Venta</Text>
        </View>
      </View>
      <View style={styles.padreContent}>
        <View style={styles.content}>
          <Text style={styles.label}>Cliente</Text>
          <Text style={styles.valor}>{ventasDetalladas.CLIENTE}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Fecha de Venta</Text>
          <Text style={styles.valor}>
            {formatearFecha(ventasDetalladas.FECHA)}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Monto Pendiente</Text>
          <Text style={styles.valor}>
            {parseFloat(ventasDetalladas.MONTO_PENDIENTE) === 0.0 ? (
              <Text style={{ textTransform: "uppercase" }}>No hay Deuda</Text>
            ) : (
              ventasDetalladas.MONTO_PENDIENTE
            )}
          </Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Monto Total</Text>
          <Text style={styles.valor}>{ventasDetalladas.MONTO_TOTAL}</Text>
        </View>
        {parseFloat(ventasDetalladas.MONTO_PENDIENTE) !== 0.0 && (
          <View style={styles.content}>
            <Text style={styles.label}>Monto Restante</Text>
            <Text style={styles.valor}>
              {(
                parseFloat(ventasDetalladas.MONTO_TOTAL) -
                parseFloat(ventasDetalladas.MONTO_PENDIENTE)
              ).toFixed(2)}
            </Text>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.label}>Estado de Pago</Text>
          <Text
            style={
              ventasDetalladas.ESTADO_PAGO === "PAGADO"
                ? styles.valorEstado
                : styles.valorEstadoNo
            }
          >
            {ventasDetalladas.ESTADO_PAGO}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Lista de Productos</Text>
          <Text style={styles.valor}>{ventasDetalladas.LISTA_PRODUCTOS}</Text>
        </View>
      </View>
    </View>
  );
};

export default InformacionVenta;

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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  btnAtras: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 30,
  },
  titulo: {
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center",
  },
  padreContent: {
    width: "90%",
    backgroundColor: "#fff",
    marginHorizontal: 30,
    marginTop: 25,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    marginBottom: 25,
    alignItems: "center",
  },
  label: {
    textTransform: "uppercase",
    color: "#374145",
    fontWeight: "600",
    fontSize: 12,
  },
  valor: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#334155",
  },
  valorEstado: {
    fontWeight: "bold",
    fontSize: 20,
    color: "green",
  },
  valorEstadoNo: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#f00",
  },
});
