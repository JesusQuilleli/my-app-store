import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import { formatearFecha } from "../../../helpers/validaciones.js";

import { url } from "../../../helpers/url.js";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import FormasPagoVenta from "./FormasPagoVenta";
import HistorialPagosVenta from "./HistorialPagosVenta.js";
import HistorialProductosVenta from "./HistorialProductosVenta.js";

const InformacionVenta = ({
  setModalVentasDetalladas,
  ventasDetalladas,
  setVentasDetalladas,
  TasaBolivares,
  TasaPesos,
  cargarVentas,
}) => {
  const ABONO = (
    parseFloat(ventasDetalladas.MONTO_TOTAL) -
    parseFloat(ventasDetalladas.MONTO_PENDIENTE)
  ).toFixed(2);

  //CARGA
  const [loading, setLoading] = useState(true);

  //MODAL
  const [modalProcesarPago, setModalProcesarPago] = useState(false);
  const [modalHistorialPagos, setModalHistorialPagos] = useState(false);
  const [modalProductosVendidos, setModalProductosVendidos] = useState(false);

  //ALMACENAR HISTORIAL DE PAGOS
  const [historialPagos, setHistorialPagos] = useState([]);
  const [historialVentas, setHistorialVentas] = useState([]);

  useEffect(() => {
    if (
      ventasDetalladas.MONTO_TOTAL !== undefined ||
      ventasDetalladas.MONTO_PENDIENTE
    ) {
      setLoading(false);
      
    }
  }, [ventasDetalladas]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fee03e" />
      </View>
    );
  };

  const closeForm = () => {
    setModalVentasDetalladas(false);
  };

  const cargarHistorialPagos = async (Venta_ID) => {
    try {
      const adminIdString = await AsyncStorage.getItem("adminId");
      if (adminIdString === null) {
        console.log("ID de administrador no encontrado.");
        return;
      }
      const adminId = parseInt(adminIdString, 10);
      if (isNaN(adminId)) {
        console.log("ID de administrador no es un número válido.");
        return;
      }

      // Corregir concatenación en la URL: separar adminId y Venta_ID con '/'
      const respuesta = await axios.get(
        `${url}/verPagosVenta/${adminId}/${Venta_ID}`
      );

      const response = respuesta.data.data;
      setHistorialPagos(response);
    } catch (error) {
      console.log("Error al cargar Ventas", error);
    }
  };

  const cargarHistorialVentas = async (Venta_ID) => {
    try {
      const adminIdString = await AsyncStorage.getItem("adminId");
      if (adminIdString === null) {
        console.log("ID de administrador no encontrado.");
        return;
      }
      const adminId = parseInt(adminIdString, 10);
      if (isNaN(adminId)) {
        console.log("ID de administrador no es un número válido.");
        return;
      }

      // Corregir concatenación en la URL: separar adminId y Venta_ID con '/'
      const respuesta = await axios.get(
        `${url}/verProductosPorVenta/${adminId}/${Venta_ID}`
      );

      const response = respuesta.data.data;
      setHistorialVentas(response);
    } catch (error) {
      console.log("Error al cargar Ventas", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
      style={{ flex: 1 }}
    >
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
          <View style={styles.botonesContenedor}>
            {ventasDetalladas.TIPO_PAGO === "POR ABONO" && (
              <TouchableOpacity
                onPress={async () => {
                  setModalHistorialPagos(true);
                  await cargarHistorialPagos(ventasDetalladas.ID_VENTA);
                }}
                style={styles.BtnPagos}
              >
                <Text style={styles.BtnPagoText}>Historial de Pagos</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={async () => {
              setModalProductosVendidos(true);
              await cargarHistorialVentas(ventasDetalladas.ID_VENTA);
            }} style={styles.BtnProductos}>
              <Text style={styles.BtnProductosText}>Productos Vendidos</Text>
            </TouchableOpacity>
          </View>

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
            <Text style={styles.label}>Tipo de Pago</Text>
            <Text style={styles.valor}>{ventasDetalladas.TIPO_PAGO}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.content}>
              <Text style={styles.label}>Monto Total</Text>
              <Text style={styles.valor}>
                {ventasDetalladas.MONTO_TOTAL}{" "}
                <Text style={{ fontSize: 12 }}>Dolares</Text>
              </Text>
              <Text style={styles.label}>Otros Precios</Text>
              <Text style={styles.valor}>
                {isNaN(TasaBolivares) || TasaBolivares === 0 ? (
                  <Text>No disponible</Text>
                ) : (
                  (ventasDetalladas.MONTO_TOTAL * TasaBolivares).toFixed(2)
                )}
                <Text style={{ fontSize: 12 }}>
                  {isNaN(TasaPesos) ? <Text></Text> : <Text> Bolivares</Text>}{" "}
                </Text>
              </Text>
              <Text style={styles.valor}>
                {isNaN(TasaPesos) || TasaPesos === 0 ? (
                  <Text>No disponible</Text>
                ) : (
                  (ventasDetalladas.MONTO_TOTAL * TasaPesos).toFixed(0)
                )}
                <Text style={{ fontSize: 12 }}>
                  {isNaN(TasaPesos) ? <Text></Text> : <Text> Pesos</Text>}{" "}
                </Text>
              </Text>
            </View>

            {parseFloat(ventasDetalladas.MONTO_PENDIENTE) !== 0.0 && (
              <View style={styles.content}>
                <Text style={styles.label}>MONTO PAGADO</Text>
                <Text style={styles.valor}>
                  {parseFloat(ABONO) === 0.0 ? (
                    <Text style={{ fontSize: 18 }}>
                      No se realizó ningún abono inicial
                    </Text>
                  ) : (
                    <Text>
                      {ABONO} <Text style={{ fontSize: 12 }}>Dólares</Text>
                    </Text>
                  )}
                </Text>
              </View>
            )}

            <Text style={styles.label}>Monto Pendiente</Text>

            {parseFloat(ventasDetalladas.MONTO_PENDIENTE) === 0.0 ? (
              <Text style={[styles.valor, { textTransform: "uppercase" }]}>
                No hay Deuda
              </Text>
            ) : (
              <>
                <View style={styles.montoContainer}>
                  <Text style={styles.valor}>
                    {parseFloat(ventasDetalladas.MONTO_PENDIENTE).toFixed(2)}{" "}
                    <Text style={{ fontSize: 12 }}>Dolares</Text>
                  </Text>
                </View>
                <Text style={styles.label}>Otros Precios</Text>
                <View style={styles.montoContainer}>
                  <Text style={styles.valor}>
                    {isNaN(TasaBolivares) || TasaBolivares === 0 ? (
                      <Text>No disponible</Text>
                    ) : (
                      parseFloat(
                        ventasDetalladas.MONTO_PENDIENTE * TasaBolivares
                      ).toFixed(2)
                    )}
                    <Text style={{ fontSize: 12 }}>
                      {isNaN(TasaPesos) ? (
                        <Text></Text>
                      ) : (
                        <Text> Bolivares</Text>
                      )}{" "}
                    </Text>
                  </Text>
                </View>

                <View style={styles.montoContainer}>
                  <Text style={styles.valor}>
                    {isNaN(TasaPesos) || TasaPesos === 0 ? (
                      <Text>No disponible</Text>
                    ) : (
                      parseFloat(
                        ventasDetalladas.MONTO_PENDIENTE * TasaPesos
                      ).toFixed(0)
                    )}
                    <Text style={{ fontSize: 12 }}>
                      {isNaN(TasaPesos) ? <Text></Text> : <Text> Pesos</Text>}{" "}
                    </Text>
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Estado de Venta</Text>
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

          {ventasDetalladas.ESTADO_PAGO === "PENDIENTE" && (
            <View>
              <View style={styles.ContanerBtn}>
                <TouchableOpacity
                  onPress={() => {
                    setModalProcesarPago(true);
                  }}
                  style={styles.BtnPagar}
                >
                  <Text style={styles.BtnPagarText}>Adjuntar Pago</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <Modal visible={modalProcesarPago} animationType="slide">
          <FormasPagoVenta
            setModalProcesarPago={setModalProcesarPago}
            ventasDetalladas={ventasDetalladas}
            TasaBolivares={TasaBolivares}
            TasaPesos={TasaPesos}
            closeForm={closeForm}
            cargarVentas={cargarVentas}
          />
        </Modal>

        <Modal visible={modalHistorialPagos} animationType="fade">
          <HistorialPagosVenta
            setModalHistorialPagos={setModalHistorialPagos}
            historialPagos={historialPagos}
          />
        </Modal>

        <Modal visible={modalProductosVendidos} animationType="fade">
          <HistorialProductosVenta 
          setModalProductosVendidos={setModalProductosVendidos}
          historialVentas={historialVentas}
          />
        </Modal>
      </View>
    </ScrollView>
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
    marginTop: 20,
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
    alignItems: "center",
  },
  content: {
    marginBottom: 15,
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
  botonesContenedor:{
    width: '100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-around'
  },
  BtnProductos: {
    backgroundColor: "green",
    padding: 7.5,
    borderRadius: 50,
    marginBottom: 13.5,
  },
  BtnProductosText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "900",
  },
  BtnPagos: {
    backgroundColor: "#fee03e",
    padding: 7.5,
    borderRadius: 50,
    marginBottom: 13.5,
  },
  BtnPagoText: {
    color: "#000",
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
  montoContainer: {
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});