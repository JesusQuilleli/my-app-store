import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";

import axios from "axios";
import {url} from './../../../helpers/url.js'

import FontAwesome from "@expo/vector-icons/FontAwesome";

import Checkbox from "expo-checkbox";

import { PagosContext } from "../../Context/pagosContext.js";

const FormasPagoVenta = ({
  ventasDetalladas,
  setModalProcesarPago,
  TasaBolivares,
  TasaPesos,
  closeForm,
  cargarVentas,
}) => {

  const { cargarPagos } = useContext(PagosContext); //CONTEXTO PARA CARGAR LOS PAGOS EN EL HISTORIAL DE PAGOS, UNA VEZ REALIZADO UN NUEVO PAGO

  const [esDeudaRestante, setEsDeudaRestante] = useState(true);
  const [esEfectivo, setEsEfectivo] = useState(true);
  const [montoAbonado, setMontoAbonado] = useState(0);
  const fechaActual = new Date();
  const [nroReferencia, setNroReferencia] = useState("");

  //CARGA
  const [isLoading, setIsLoading] = useState(false);

  const cleanDatos = async () => {
    setEsDeudaRestante(true);
    setEsEfectivo(true);
    setMontoAbonado(0);
    setNroReferencia("");
    setModalProcesarPago(false);
    closeForm();

    await cargarVentas();
    await cargarPagos();
  };

  // Función que se llama al seleccionar una opción
  const manejarSeleccion = (opcion) => {
    if (opcion === "deudaRestante") {
      setEsDeudaRestante(true);
      setMontoAbonado(0);
    } else {
      setEsDeudaRestante(false);
      setMontoAbonado("");
    }
  };

  // Función que se llama al seleccionar una opción
  const manejarSeleccionPago = (opcion) => {
    if (opcion === "efectivo") {
      setEsEfectivo(true);
    } else {
      setEsEfectivo(false);
    }
  };

  // Función para procesar el abono
  const procesarPago = async () => {
    setIsLoading(true);
    try {
      let abono;

      if (!montoAbonado && !esDeudaRestante) {
        Alert.alert("Obligatorio", "El Monto ha Abonar es Requerido.", [
          { text: "Vale" },
        ]);

        return;
      }

      // Convertir montoAbonado a cadena temporalmente para realizar las validaciones
      const montoAbonadoStr = montoAbonado.toString();

      if (
        montoAbonadoStr.includes(",") ||
        montoAbonadoStr.includes(" ") ||
        montoAbonadoStr.includes("-")
      ) {
        Alert.alert(
          "Obligatorio",
          "No puede dejar espacios ni colocar una [ , ] ni colocar valores -"
        );
        setMontoAbonado(0);
        return;
      }

      // Asigna el valor de abono dependiendo de si es deuda restante o no
      if (esDeudaRestante) {
        abono = parseFloat(ventasDetalladas.MONTO_PENDIENTE).toFixed(2);
      } else {
        if (parseFloat(montoAbonado) > ventasDetalladas.MONTO_PENDIENTE) {
          Alert.alert(
            "Hey",
            "El Monto abonado no puede ser mayor al Monto Pendiente",
            [{ text: "Vale" }]
          );
          setMontoAbonado(0);
          return;
        }
        abono = parseFloat(montoAbonado).toFixed(2);
      }

      const fechaPago = fechaActual.toISOString().split("T")[0];
      const maneraPago = esEfectivo ? "EFECTIVO" : "PAGO_MOVIL/TRANSFERENCIA";
      const numeroReferencia = nroReferencia || "---EFECTIVO---";

      // Enviar la solicitud al backend
      const response = await axios.post(`${url}/pagoVenta`, {
        ventaId: ventasDetalladas.ID_VENTA,
        montoAbonado: abono,
        fechaPago: fechaPago,
        maneraPago: maneraPago,
        numeroReferencia: numeroReferencia,
      });

      Alert.alert("Éxito", "El pago ha sido procesado", [
        {
          text: "Vale",
          onPress: () => {
            cleanDatos();
          },
        },
      ]);
    } catch (error) {
      console.error("Error procesando el pago:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al procesar el pago. Inténtalo nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  }; 

  return (
    <View style={styles.modalOverlay}>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(242, 243, 244, 0.8)",
            zIndex: 1000,
          }}
        >
          <ActivityIndicator
            size="large"
            color="#fee03e"
            style={{ transform: [{ scale: 2 }] }}
          />
        </View>
      )}
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>FORMAS DE PAGO</Text>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => setModalProcesarPago(false)}
          >
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 15, alignItems: "center" }}>
          <Text
            style={{
              color: "#888",
              fontSize: 16,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Monto Pendiente
          </Text>
          <Text style={{ color: "#000", fontSize: 20, fontWeight: "900" }}>
            {ventasDetalladas.MONTO_PENDIENTE}{" "}
            <Text style={{ fontSize: 12 }}>Dolares</Text>
          </Text>
          <Text
            style={{
              color: "#888",
              fontSize: 14,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Conversión
          </Text>
          <Text style={{ color: "#000", fontSize: 20, fontWeight: "900" }}>
            {isNaN(TasaBolivares) || TasaBolivares === 0 ? (
              <Text>No disponible</Text>
            ) : (
              (ventasDetalladas.MONTO_PENDIENTE * TasaBolivares).toFixed(2)
            )}
            <Text style={{ fontSize: 12 }}>
                  {isNaN(TasaPesos) ? <Text></Text> : <Text> Bolivares</Text>}{" "}
                </Text>
          </Text>

          <Text style={{ color: "#000", fontSize: 20, fontWeight: "900" }}>
            {isNaN(TasaPesos) || TasaPesos === 0 ? (
              <Text>No disponible</Text>
            ) : (
              (ventasDetalladas.MONTO_PENDIENTE * TasaPesos).toFixed(0)
            )}
            <Text style={{ fontSize: 12 }}>
                  {isNaN(TasaPesos) ? <Text></Text> : <Text> Pesos</Text>}{" "}
                </Text>
          </Text>
        </View>

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
              <Text style={styles.defecto}>Deuda Total</Text>
              <Checkbox
                value={esDeudaRestante}
                onValueChange={() => manejarSeleccion("deudaRestante")}
              />
            </View>
          </View>
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              fontWeight: "bold",
              fontSize: 20,
              color: "#888",
              textTransform: "uppercase",
            }}
          >
            Manera a Pagar
          </Text>
          <View style={styles.containerPago}>
            <View style={styles.ItemPago}>
              <Text style={styles.defecto}>EFECTIVO</Text>
              <Checkbox
                value={esEfectivo}
                onValueChange={() => manejarSeleccionPago("efectivo")}
              />
            </View>
            <View style={styles.ItemPago}>
              <Text style={styles.defecto}>
                PAGO MOVIL O{"\n"}TRANSFERENCIA
              </Text>
              <Checkbox
                value={!esEfectivo}
                onValueChange={() => manejarSeleccionPago("otro")}
              />
            </View>
          </View>

          {!esEfectivo && (
            <TextInput
              style={[styles.input, { textAlign: "center" }]}
              placeholder="Nro de Operación"
              keyboardType="numeric"
              value={nroReferencia}
              onChangeText={(value) => setNroReferencia(value)}
            />
          )}

          <View
            style={[
              styles.inputContent,
              { borderTopWidth: 0.5, borderTopColor: "#000", marginTop: 5 },
            ]}
          >
            <View style={styles.inputContentItem}>
              <TextInput
                placeholder="Monto"
                style={esDeudaRestante ? ([styles.input, {textAlign:'center'}]) : (styles.input)}
                keyboardType="numeric"
                value={
                  esDeudaRestante
                    ? ventasDetalladas.MONTO_PENDIENTE.toString()
                    : montoAbonado.toString()
                }
                editable={!esDeudaRestante}
                onChangeText={(valor) => {
                  if (!esDeudaRestante) {
                    // Permitir que el valor sea una cadena para conservar el punto decimal
                    setMontoAbonado(valor);
                  }
                }}
              />
              <TouchableOpacity
                onPress={procesarPago}
                style={styles.btnProcesar}
              >
                <Text style={styles.btnProcesarText}>Procesar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FormasPagoVenta;

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
  containerPago: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
  },
  ItemPago: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
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
    padding: 10,
    borderRadius: 50,
  },
  btnProcesarText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 15,
    textTransform: "uppercase",
    fontWeight: "900",
  },
});
