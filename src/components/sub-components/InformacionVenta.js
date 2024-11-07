import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import { formatearFecha } from "../../helpers/validaciones";

import Checkbox from "expo-checkbox";

const InformacionVenta = ({
  setModalVentasDetalladas,
  ventasDetalladas,
  setVentasDetalladas,
}) => {
  const DEUDA_RESTANTE = (
    parseFloat(ventasDetalladas.MONTO_TOTAL) -
    parseFloat(ventasDetalladas.MONTO_PENDIENTE)
  ).toFixed(2);

  const [montoAbonado, setMontoAbonado] = useState(0);
  const [esDeudaRestante, setEsDeudaRestante] = useState(true);

  const [opcionesPago, setOpcionesPago] = useState(false);

  // Función que se llama al seleccionar una opción
  const manejarSeleccion = (opcion) => {
    if (opcion === "deudaRestante") {
      setEsDeudaRestante(true);
      setMontoAbonado(0); // Limpiar el campo de abono
    } else {
      setEsDeudaRestante(false);
      setMontoAbonado(""); // Permitir ingreso de nuevo monto de abono
    }
  };

  // Función para procesar el abono
  const procesarPago = () => {
    if (!esDeudaRestante && montoAbonado > 0) {
      const nuevoSaldo = (parseFloat(DEUDA_RESTANTE) - montoAbonado).toFixed(2); // Calcula el nuevo saldo
      setMontoAbonado(0); // Limpiar el campo después de procesar el abono
      setEsDeudaRestante(true); // Volver a seleccionar "Deuda Restante" después de procesar
    }
  };

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
            <Text style={styles.valor}>{DEUDA_RESTANTE}</Text>
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

        {ventasDetalladas.ESTADO_PAGO === "PENDIENTE" && (
          <View>
            <View style={styles.ContanerBtn}>
              <TouchableOpacity
                onPress={() => {
                  setOpcionesPago(!opcionesPago);
                }}
                style={styles.BtnPagar}
              >
                <Text style={styles.BtnPagarText}>Formas de Pago</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.BtnPagos}>
                <Text style={styles.BtnPagoText}>Pagos Realizados</Text>
              </TouchableOpacity>
            </View>
            {opcionesPago && (
              <View>
                <View style={styles.containerPago}>
                  <View style={styles.ItemPago}>
                    <Text style={styles.defecto}>Abono</Text>
                    <Checkbox
                      value={!esDeudaRestante}
                      onValueChange={() => manejarSeleccion("abono")}
                    />
                  </View>
                  <View style={styles.ItemPago}>
                    <Text style={styles.defecto}>Deuda Restante</Text>
                    <Checkbox
                      value={esDeudaRestante}
                      onValueChange={() => manejarSeleccion("deudaRestante")}
                    />
                  </View>
                </View>
                <View style={styles.inputContent}>
                  <View style={styles.inputContentItem}>
                    <TextInput
                      placeholder="Aqui"
                      style={styles.input}
                      keyboardType="numeric"
                      value={
                        esDeudaRestante
                          ? DEUDA_RESTANTE
                          : montoAbonado.toString()
                      }
                      editable={!esDeudaRestante}
                      onChangeText={(valor) =>
                        setMontoAbonado(parseFloat(valor) || 0)
                      }
                    />
                    <TouchableOpacity style={styles.btnProcesar}>
                      <Text style={styles.btnProcesarText}>Procesar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
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
  ContanerBtn: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  BtnPagos: {
    backgroundColor: "gray",
    padding: 7.5,
    borderRadius: 50,
  },
  BtnPagoText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "900",
  },
  BtnPagar: {
    backgroundColor: "green",
    padding: 7.5,
    borderRadius: 50,
  },
  BtnPagarText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "900",
  },
  containerPago: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ItemPago: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  defecto: {
    textTransform: "uppercase",
    color: "#374145",
    fontWeight: "600",
    fontSize: 12,
  },
  inputContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContentItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  input: {
    fontSize: 18,
    fontWeight: "900",
    color: "#888",
  },
  btnProcesar: {
    backgroundColor: "green",
    padding: 7.5,
    borderRadius: 50,
  },
  btnProcesarText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "900",
  },
});
