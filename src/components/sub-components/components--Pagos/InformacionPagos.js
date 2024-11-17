import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { formatearFechaOtroFormato } from "../../../helpers/validaciones";

import FontAwesome from "@expo/vector-icons/FontAwesome";

const InformacionPagos = ({ setInfoPagos, pagoSeleccionado }) => {
  //CARGA
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar si el array tiene elementos y que el primer elemento tenga las propiedades necesarias
    if (
      pagoSeleccionado.length > 0 &&
      (parseFloat(pagoSeleccionado[0].MONTO_PENDIENTE) !== undefined ||
        parseFloat(pagoSeleccionado[0].MONTO_TOTAL) !== undefined)
    ) {
      setLoading(false);
    }
  }, [pagoSeleccionado]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fee03e" />
      </View>
    );
  }

  const Item = ({
    CLIENTE,
    VENTA_ID,
    MONTO_ABONADO,
    MONTO_PENDIENTE,
    ESTADO_VENTA,
    FECHA_PAGO,
    NUMERO_REFERENCIA,
    MANERA_PAGO,
  }) => (
    <View style={styles.item}>
      <Text style={styles.defecto}>Codigo Venta</Text>
      <Text
        style={{ fontSize: 16, color: "#000", fontWeight: "900", fontSize: 22 }}
      >
        {VENTA_ID}
      </Text>
      <Text style={styles.defecto}>CLIENTE </Text>
      <Text style={styles.nombreProducto}>{CLIENTE}</Text>
      <Text style={styles.defecto}>Fecha de Pago</Text>
      <Text
        style={{ fontSize: 16, color: "#000", fontWeight: "900", fontSize: 22 }}
      >
        {formatearFechaOtroFormato(FECHA_PAGO)}
      </Text>
      <Text style={styles.defecto}>DEUDA TOTAL </Text>
      <Text style={{ color: "#000", fontSize: 22, fontWeight: "900" }}>
        {MONTO_PENDIENTE}{" "}
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Dolares</Text>
      </Text>
      <Text style={styles.defecto}>ABONADO </Text>
      <Text style={{ color: "#000", fontSize: 22, fontWeight: "900" }}>
        {MONTO_ABONADO}{" "}
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Dolares</Text>
      </Text>
      <Text style={styles.defecto}>DEUDA RESTANTE </Text>
      <Text style={{ color: "#000", fontSize: 22, fontWeight: "900" }}>
        {parseFloat(MONTO_PENDIENTE - MONTO_ABONADO) === 0.0 ? (
          <Text style={{ color: "black" }}>PAGADA</Text>
        ) : (
          <Text>
            {(MONTO_PENDIENTE - MONTO_ABONADO).toFixed(2)}
            <Text style={{ fontSize: 18, fontWeight: "bold" }}> Dolares</Text>
          </Text>
        )}{" "}
      </Text>

      <Text style={styles.defecto}>ESTADO DE VENTA</Text>
      <Text
        style={
          ESTADO_VENTA === "PENDIENTE"
            ? { fontSize: 16, color: "red", fontWeight: "900", fontSize: 22 }
            : { fontSize: 16, color: "green", fontWeight: "900", fontSize: 22 }
        }
      >
        {ESTADO_VENTA}
      </Text>
      <Text style={styles.defecto}>MANERA DE PAGO</Text>
      <Text
        style={{ fontSize: 16, color: "#000", fontWeight: "900", fontSize: 22 }}
      >
        {MANERA_PAGO === "PAGO_MOVIL/TRANSFERENCIA" ? (
          <Text style={{ textAlign: "center" }}>TRANSFERENCIA</Text>
        ) : (
          <Text>EFECTIVO</Text>
        )}
      </Text>
      {NUMERO_REFERENCIA !== "---EFECTIVO---" && (
        <Text style={styles.defecto}>NRO OPERACIÓN</Text>
      )}
      <Text
        style={{ fontSize: 16, color: "#000", fontWeight: "900", fontSize: 22 }}
      >
        {NUMERO_REFERENCIA !== "---EFECTIVO---" && (
          <Text>{NUMERO_REFERENCIA}</Text>
        )}
      </Text>
    </View>
  );

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>DETALLES DEL PAGO</Text>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => setInfoPagos(false)}
          >
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={pagoSeleccionado}
          keyExtractor={(item) => item.ID_PAGO}
          style={styles.tablePagos}
          renderItem={({ item }) => (
            <Item
              CLIENTE={item.CLIENTE}
              VENTA_ID={item.VENTA_ID}
              MONTO_ABONADO={item.MONTO_ABONADO}
              MONTO_PENDIENTE={item.MONTO_PENDIENTE}
              ESTADO_VENTA={item.ESTADO_VENTA}
              FECHA_PAGO={item.FECHA_PAGO}
              MANERA_PAGO={item.MANERA_PAGO}
              NUMERO_REFERENCIA={item.NUMERO_REFERENCIA}
            />
          )}
        />
      </View>
    </View>
  );
};

export default InformacionPagos;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 0.5,
    width: "100%",
  },
  titulo: {
    fontSize: 24,
    textTransform: "uppercase",
    color: "#888",
    padding: 5,
    fontWeight: "bold",
  },
  btnClose: {
    position: "absolute",
    top: -20,
    right: -18,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
