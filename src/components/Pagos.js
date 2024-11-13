import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import Entypo from "@expo/vector-icons/Entypo";

import { formatearFecha } from "../helpers/validaciones";

const Pagos = ({ setModalPagos, verPagos }) => {
  const Item = ({
    CLIENTE,
    FECHA_PAGO,
    MONTO_ABONADO,
    MONTO_PENDIENTE,
    ESTADO_VENTA,
    VENTA_ID,
  }) => (
    <View style={styles.item}>
      <Text style={styles.nombreCliente}>{CLIENTE}</Text>
      <Text style={styles.defecto}>
        Fecha de Pago:{" "}
        <Text style={{ color: "#000" }}>{formatearFecha(FECHA_PAGO)}</Text>
      </Text>

      <Text style={styles.defecto}>
        Monto Abonado: <Text style={{ color: "#000" }}>{MONTO_ABONADO}</Text>{" "}
        <Text style={{ fontSize: 12 }}>Dolares</Text>
      </Text>
      {ESTADO_VENTA === "PENDIENTE" && (
        <Text style={styles.defecto}>
          Monto Restante:{" "}
          <Text style={{ color: "#000" }}>
            {(MONTO_PENDIENTE - MONTO_ABONADO).toFixed(2)}
          </Text>{" "}
          <Text style={{ fontSize: 12 }}>Dolares</Text>
        </Text>
      )}
      <Text style={styles.defecto}>
        Estado de Venta:{" "}
        <Text
          style={
            ESTADO_VENTA === "PENDIENTE" ? { color: "red" } : { color: "green" }
          }
        >
          {ESTADO_VENTA}
        </Text>{" "}
      </Text>
      <Text style={styles.defecto}>
        Codigo Venta: <Text style={{ color: "#000" }}>{VENTA_ID}</Text>{" "}
      </Text>
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

      {verPagos.length === 0 && (
        <Text style={{ fontSize: 24, marginTop: 20, fontWeight: "900" }}>
          Sin Historial de Pagos
        </Text>
      )}

      <FlatList
        data={verPagos}
        keyExtractor={(item) => item.ID_PAGO}
        style={styles.tablePagos}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {}}>
            <Item
              CLIENTE={item.CLIENTE}
              FECHA_PAGO={item.FECHA_PAGO}
              MONTO_ABONADO={item.MONTO_ABONADO}
              MONTO_PENDIENTE={item.MONTO_PENDIENTE}
              ESTADO_VENTA={item.ESTADO_VENTA}
              VENTA_ID={item.VENTA_ID}
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
    width: "100%",
  },
  nombreCliente: {
    fontSize: 18,
    fontWeight: "800",
  },
  defecto: {
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: "700",
    color: "#888",
  },
  item: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomColor: "#000",
    borderBottomWidth: 0.2,
    alignItems: "center",
  },
});
