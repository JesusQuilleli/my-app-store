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

const HistorialPagosVenta = ({
  setModalHistorialPagos,
  historialPagos,
  TasaBolivares,
  TasaPesos,
}) => {
  const Item = ({
    CLIENTE,
    ESTADO_VENTA,
    FECHA_PAGO,
    MANERA_PAGO,
    MONTO_ABONADO,
    MONTO_PENDIENTE,
    NUMERO_REFERENCIA,
  }) => (
    <View style={styles.item}>
      <Text style={styles.nombreCliente}>{CLIENTE}</Text>
      <Text style={styles.defecto}>
        Fecha del Pago{" "}
        <Text style={{ color: "#000" }}>{formatearFechaOtroFormato(FECHA_PAGO)}</Text>
      </Text>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Text style={styles.defecto}>
          ABONO DE {" "}<Text style={{ color: "#000" }}>{MONTO_ABONADO}</Text>
          <Text style={{ fontSize: 10 }}>$</Text>
        </Text>
        <Text style={[styles.defecto, { color: "#000" }]}>
          {isNaN(TasaBolivares) || TasaBolivares === 0 ? (
            <Text>No disponible</Text>
          ) : (
            (MONTO_ABONADO * TasaBolivares).toFixed(2)
          )}
          <Text style={[styles.defecto, { fontSize: 10 }]}>
            {isNaN(TasaPesos) ? <Text></Text> : <Text>Bs</Text>}{" "}
          </Text>
        </Text>
        <Text style={[styles.defecto, { color: "#000" }]}>
          {isNaN(TasaPesos) || TasaPesos === 0 ? (
            <Text>No disponible</Text>
          ) : (
            (MONTO_ABONADO * TasaPesos).toFixed(0)
          )}
          <Text style={[styles.defecto, { fontSize: 10 }]}>
            {isNaN(TasaPesos) ? <Text></Text> : <Text>Cop</Text>}{" "}
          </Text>
        </Text>
      </View>

      {ESTADO_VENTA === "PENDIENTE" && (<View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Text style={styles.defecto}>
          RESTANTE DE {" "}<Text style={{ color: "#000" }}>{(MONTO_PENDIENTE - MONTO_ABONADO).toFixed(2)}</Text>
          <Text style={{ fontSize: 10 }}>$</Text>
        </Text>
        <Text style={[styles.defecto, { color: "#000" }]}>
          {isNaN(TasaBolivares) || TasaBolivares === 0 ? (
            <Text>No disponible</Text>
          ) : (
            ((MONTO_PENDIENTE - MONTO_ABONADO) * TasaBolivares).toFixed(2)
          )}
          <Text style={[styles.defecto, { fontSize: 10 }]}>
            {isNaN(TasaPesos) ? <Text></Text> : <Text>Bs</Text>}{" "}
          </Text>
        </Text>
        <Text style={[styles.defecto, { color: "#000" }]}>
          {isNaN(TasaPesos) || TasaPesos === 0 ? (
            <Text>No disponible</Text>
          ) : (
            ((MONTO_PENDIENTE - MONTO_ABONADO) * TasaPesos).toFixed(0)
          )}
          <Text style={[styles.defecto, { fontSize: 10 }]}>
            {isNaN(TasaPesos) ? <Text></Text> : <Text>Cop</Text>}{" "}
          </Text>
        </Text>
      </View>)}

      <Text style={styles.defecto}>
        Estado de Venta{" "}
        <Text
          style={
            ESTADO_VENTA === "PENDIENTE" ? { color: "red" } : { color: "green" }
          }
        >
          {ESTADO_VENTA}
        </Text>{" "}
      </Text>
      <Text style={styles.defecto}>
        Tipo de pago{" "}
        <Text style={{ color: "#000" }}>
          {MANERA_PAGO === "PAGO_MOVIL/TRANSFERENCIA"
            ? "TRANSFERENCIA"
            : MANERA_PAGO}
        </Text>{" "}
      </Text>
      {MANERA_PAGO !== "EFECTIVO" && (
        <Text style={styles.defecto}>
          Nro Operación{" "}
          <Text style={{ color: "#000" }}>{NUMERO_REFERENCIA}</Text>{" "}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>HISTORIAL DE PAGOS</Text>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => setModalHistorialPagos(false)}
          >
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {historialPagos.length === 0 && (
          <Text
            style={{
              fontSize: 24,
              marginTop: 20,
              fontWeight: "900",
              textAlign: "center",
            }}
          >
            Aún no hay seguimiento de los pagos.
          </Text>
        )}

        <FlatList
          data={historialPagos}
          keyExtractor={(item) => item.ID_PAGO}
          style={styles.tablePagos}
          renderItem={({ item }) => (
            <Item
              CLIENTE={item.CLIENTE}
              FECHA_PAGO={item.FECHA_PAGO}
              MONTO_ABONADO={item.MONTO_ABONADO}
              MONTO_PENDIENTE={item.MONTO_PENDIENTE}
              ESTADO_VENTA={item.ESTADO_VENTA}
              MANERA_PAGO={item.MANERA_PAGO}
              NUMERO_REFERENCIA={item.NUMERO_REFERENCIA}
            />
          )}
        />
      </View>
    </View>
  );
};

export default HistorialPagosVenta;

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
    fontSize: 18,
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
  tablePagos: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    width: "100%",
  },
  nombreCliente: {
    fontSize: 16,
    fontWeight: "800",
  },
  defecto: {
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "700",
    color: "#888",
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    alignItems: "center",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 0.5,
  },
});
