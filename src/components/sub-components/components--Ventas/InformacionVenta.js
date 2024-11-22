import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  Alert,
  Linking,
} from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { formatearFecha } from "../../../helpers/validaciones.js";

import { url } from "../../../helpers/url.js";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import FormasPagoVenta from "./FormasPagoVenta";
import HistorialPagosVenta from "./HistorialPagosVenta.js";
import HistorialProductosVenta from "./HistorialProductosVenta.js";
import DevolucionesProcesar from "./DevolucionesProcesar.js";

import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const InformacionVenta = ({
  setModalVentasDetalladas,
  ventasDetalladas,
  setVentasDetalladas,
  TasaBolivares,
  TasaPesos,
  cargarVentas,
  cargarProductos,
  closeInformacionVentas,
  cargarDevoluciones
}) => {
  const ABONO = (
    parseFloat(ventasDetalladas.MONTO_TOTAL) -
    parseFloat(ventasDetalladas.MONTO_PENDIENTE)
  ).toFixed(2);

  const VENTA_ID = ventasDetalladas.ID_VENTA;
  const CLIENTE = ventasDetalladas.CLIENTE;

  //CARGA
  const [loading, setLoading] = useState(true);

  //MODAL
  const [modalProcesarPago, setModalProcesarPago] = useState(false);
  const [modalHistorialPagos, setModalHistorialPagos] = useState(false);
  const [modalProductosVendidos, setModalProductosVendidos] = useState(false);
  const [modalDevolucion, setModalDevolucion] = useState(false);

  //ALMACENAR HISTORIAL DE PAGOS
  const [historialPagos, setHistorialPagos] = useState([]);
  const [historialVentas, setHistorialVentas] = useState([]);

  //PAGO MOVIL
  const [cedula, setCedula] = useState("");
  const [banco, setBanco] = useState("");
  const [telefonoPago, setTelefonoPago] = useState("");

  //PDF
  const [pdfRuta, setPdfRuta] = useState([]);

  //MOSTRAR BOTON DEVOLUCION
  const fechaVenta = new Date(ventasDetalladas.FECHA);
  const fechaActual = new Date();

  // Función para calcular la diferencia en días
  const calcularDiferenciaDias = (fecha1, fecha2) => {
    const diferencia = fecha2 - fecha1; // Diferencia en milisegundos
    const dias = diferencia / (1000 * 3600 * 24); // Convertir a días
    return dias;
  };

  // Calcular la diferencia en días desde la venta
  const diasDesdeVenta = calcularDiferenciaDias(fechaVenta, fechaActual);

  // Condición para mostrar u ocultar el botón
  const mostrarBotonDevolucion = diasDesdeVenta <= 3;

  const cargarPagoMovil = async () => {
    try {
      // Recuperar el ID del administrador
      const adminIdString = await AsyncStorage.getItem("adminId");
      if (adminIdString) {
        // Recuperar los datos del Pago Móvil
        const pagoMovil = await AsyncStorage.getItem(
          `adminPagoMovil_${adminIdString}`
        );
        if (pagoMovil) {
          const { cedula, banco, telefonoPago } = JSON.parse(pagoMovil);
          setCedula(cedula);
          setBanco(banco);
          setTelefonoPago(telefonoPago);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del Pago Móvil:", error);
    }
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

  useEffect(() => {
    if (
      ventasDetalladas.MONTO_TOTAL !== undefined ||
      ventasDetalladas.MONTO_PENDIENTE ||
      ventasDetalladas.ID_VENTA
    ) {
      setLoading(false);
      cargarHistorialVentas(ventasDetalladas.ID_VENTA);
      cargarPagoMovil();
    }
  }, [ventasDetalladas]);

  useEffect(() => {
    cargarPagoMovil();
    cargarHistorialVentas(VENTA_ID);
  }, []);

  const closeForm = () => {
    setModalVentasDetalladas(false);
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

  const enviarSMS = async (telefono, cliente, montoPendiente, montoPagado) => {
    try {
      if (!cedula || !banco || !telefonoPago) {
        Alert.alert("Error", "Los datos del Pago Móvil no están configurados.");
        return;
      }

      // Recuperar el nombre del administrador desde AsyncStorage
      const nombre = await AsyncStorage.getItem("adminNombre");

      // Saludo con el nombre del administrador
      const saludo = nombre ? `¡Soy ${nombre}! De Shop-Mg 👋` : "¡Hola! 👋";

      // Convertir el monto pendiente a bolívares y pesos
      const montoPendienteBolivares =
        (parseFloat(montoPendiente) * TasaBolivares).toFixed(2) || "N/D";
      const montoPendientePesos =
        (parseFloat(montoPendiente) * TasaPesos).toFixed(0) || "N/D";

      // Crear el texto del abono
      const montoPagadoTexto =
        montoPagado > 0
          ? `Último abono realizado: ${montoPagado} $.\n`
          : "Aún no has realizado ningún abono.\n";

      // Construir el mensaje para SMS
      const mensajeSMS = `${saludo}\nEstimad@ ${cliente}\n\n${montoPagadoTexto}Monto Pendiente de: ${montoPendiente} $.\n\nEquivalente a:\n- ${montoPendienteBolivares} Bs\n- ${montoPendientePesos} COP\n\nDatos del Pago Movil:\nCédula: ${cedula}\nBanco: ${banco}\nTeléfono: ${telefonoPago}\n\nGracias por tu atención. 😊`;

      // Construcción de la URL SMS
      const url = `sms:${telefono}?body=${encodeURIComponent(mensajeSMS)}`;

      // Abrir la aplicación de mensajes
      await Linking.openURL(url);
    } catch (error) {
      console.error("No se pudo abrir la aplicación de mensajes:", error);
    }
  };

  const enviarMensajeWhatsApp = async (
    telefono,
    cliente,
    montoPendiente,
    montoPagado
  ) => {
    try {
      if (!cedula || !banco || !telefonoPago) {
        Alert.alert("Error", "Los datos del Pago Móvil no están configurados.");
        return;
      }

      // Recuperar el nombre del administrador desde AsyncStorage
      const nombre = await AsyncStorage.getItem("adminNombre");

      // Si se encuentra el nombre, incluirlo en el saludo
      const saludo = nombre ? `¡Soy ${nombre}!👋` : "¡Hola! 👋";

      // Convertir el monto pendiente a bolívares y pesos
      const montoPendienteBolivares =
        (parseFloat(montoPendiente) * TasaBolivares).toFixed(2) ||
        "No disponible";
      const montoPendientePesos =
        (parseFloat(montoPendiente) * TasaPesos).toFixed(2) || "No disponible";

      // El mensaje que se enviará
      const mensaje = `Hola Querid@ *${cliente}*, ${saludo} \n\n`;

      const montoPagadoTexto =
        montoPagado > 0
          ? `💸 Tu ultimo abono realizado fue de *${montoPagado} $*.\n\n`
          : "Aún no has realizado ningún abono. 😕\n\n";

      const mensajeFinal =
        mensaje +
        `${montoPagadoTexto}💰 Tienes un monto pendiente de *${montoPendiente} $*\n\n📈 Este monto es equivalente a:\n\n💵 *${montoPendienteBolivares} Bs* \n💸 *${montoPendientePesos} Cop* \n\n💳 Para realizar tu pago, utiliza los siguientes datos:\n\n🛂 Cédula: ${cedula}\n🏦 Banco: ${banco}\n📱 Teléfono: ${telefonoPago}\n\n📲 ¡Realiza el pago o el abono deseado y confirma tu transacción! \n¡Gracias! 😊`;

      // Construcción de la URL con el mensaje
      const url = `whatsapp://send?phone=${telefono}&text=${encodeURIComponent(
        mensajeFinal
      )}`;

      // Intentar abrir WhatsApp con el mensaje formateado
      await Linking.openURL(url);
    } catch (err) {
      console.error("No se pudo abrir WhatsApp", err);
    }
  };

  const handleNotificar = (ventasDetalladas) => {
    Alert.alert(
      "Selecciona una opción",
      "¿Cómo deseas enviar el recordatorio?",
      [
        {
          text: "WhatsApp",
          onPress: () => {
            enviarMensajeWhatsApp(
              ventasDetalladas.TELEFONO,
              ventasDetalladas.CLIENTE,
              ventasDetalladas.MONTO_PENDIENTE,
              ABONO
            );
          },
        },
        {
          text: "Mensaje SMS",
          onPress: () => {
            enviarSMS(
              ventasDetalladas.TELEFONO,
              ventasDetalladas.CLIENTE,
              ventasDetalladas.MONTO_PENDIENTE,
              ABONO
            );
          },
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]
    );
  };

  //FACTURA //AGREGAR CONVERSION A BOLIVARES Y A DOLARES
  const generarFactura = async (venta, productos, TasaBolivares, TasaPesos) => {

    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual
      .getDate()
      .toString()
      .padStart(2, "0")}/${(fechaActual.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${fechaActual.getFullYear()}`;
  
    // Calcular las conversiones
    const montoEnBolivares = (venta.MONTO_TOTAL * TasaBolivares).toFixed(2);
    const montoEnPesos = (venta.MONTO_TOTAL * TasaPesos).toFixed(2);
  
    const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
          }
          .container {
            width: 100%;
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header img {
            width: 100px;
            height: auto;
          }
          .header h1 {
            font-size: 28px;
            color: #800000; /* Color maroon */
            margin: 10px 0;
          }
          .header p {
            font-size: 16px;
            color: #777;
          }
          .info {
            margin-bottom: 20px;
            font-size: 18px;
            line-height: 1.6;
          }
          .info strong {
            color: #333;
          }
          .productos {
            margin-top: 20px;
            border-collapse: collapse;
            width: 100%;
          }
          .productos th, .productos td {
            border: 1px solid #ddd;
            text-align: left;
            padding: 8px;
          }
          .productos th {
            background-color: #800000; /* Color maroon */
            color: white;
          }
          .total {
            text-align: right;
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
            color: #333;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 14px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://via.placeholder.com/100" alt="Logo Empresa">
            <h1>Factura #${venta.ID_VENTA}</h1>
          </div>
          <div class="info">
            <p><strong>Cliente:</strong> ${venta.CLIENTE}</p>
            <p><strong>Fecha:</strong> ${fechaFormateada}</p>
            <p><strong>Estado de pago:</strong> ${venta.ESTADO_PAGO}</p>
          </div>
          <table class="productos">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario ($)</th>
                <th>Precio Unitario (Bs.)</th>
                <th>Precio Unitario (Pesos)</th>
                <th>Subtotal ($)</th>
                <th>Subtotal (Bs.)</th>
                <th>Subtotal (Pesos)</th>
              </tr>
            </thead>
            <tbody>
              ${productos
                .map(
                  (producto) => {
                    const precioBolivares = (producto.PRECIO * TasaBolivares).toFixed(2);
                    const precioPesos = (producto.PRECIO * TasaPesos).toFixed(2);
                    const subtotal = (producto.CANTIDAD * producto.PRECIO).toFixed(2);
                    const subtotalBolivares = (producto.CANTIDAD * producto.PRECIO * TasaBolivares).toFixed(2);
                    const subtotalPesos = (producto.CANTIDAD * producto.PRECIO * TasaPesos).toFixed(2);
  
                    return `
                      <tr>
                        <td>${producto.PRODUCTO}</td>
                        <td>${producto.CANTIDAD}</td>
                        <td>$${producto.PRECIO}</td>
                        <td>Bs.${precioBolivares}</td>
                        <td>$${precioPesos}</td>
                        <td>$${subtotal}</td>
                        <td>Bs.${subtotalBolivares}</td>
                        <td>$${subtotalPesos}</td>
                      </tr>
                    `;
                  }
                )
                .join("")}
            </tbody>
          </table>
          <p class="total">Total: $${venta.MONTO_TOTAL}</p>
          <p class="total">Total en Bolívares: Bs.${montoEnBolivares}</p>
          <p class="total">Total en Pesos: $${montoEnPesos}</p>
          <div class="footer">
            <p>Gracias por su compra. Si tiene alguna pregunta, no dude en contactarnos.</p>
            <p><strong>Contacto:</strong> ejemplo@empresa.com | Tel: (123) 456-7890</p>
          </div>
        </div>
      </body>
    </html>
    `;
  
    // Generar PDF con expo-print
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
  
    // Guardar el PDF en el sistema de archivos
    const fileUri =
      FileSystem.documentDirectory +
      `Factura_${venta.ID_VENTA}_Cliente_${venta.CLIENTE}.pdf`;
    await FileSystem.moveAsync({
      from: uri,
      to: fileUri,
    });
  
    return fileUri; // Ruta del archivo PDF
  };
  

  const handleGenerarFactura = async () => {
    try {
      if (!ventasDetalladas || historialVentas.length === 0) {
        Alert.alert(
          "Error",
          "No se encontraron los datos de la venta o productos."
        );
        return;
      }

      // Generar la factura
      const rutaPdf = await generarFactura(ventasDetalladas, historialVentas, TasaBolivares, TasaPesos);
      setPdfRuta(rutaPdf);

      // Mostrar opción para compartir
      Alert.alert(
        "Factura Generada",
        "La factura se generó correctamente.",
        [
          {
            text: "Compartir",
            onPress: async () => {
              try {
                if (await Sharing.isAvailableAsync()) {
                  await Sharing.shareAsync(rutaPdf); // Compartir el archivo PDF
                } else {
                  Alert.alert(
                    "Error",
                    "Compartir no está disponible en este dispositivo."
                  );
                }
              } catch (error) {
                console.error("Error al compartir la factura:", error);
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error("Error al generar factura:", error);
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

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fee03e" />
          </View>
        ) : (
          <View style={styles.padreContent}>
            <View style={styles.botonesContenedor}>
              {ventasDetalladas.TIPO_PAGO === "POR ABONO" && (
                <View
                  style={{
                    width: "50%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  {ventasDetalladas.ESTADO_PAGO === "PENDIENTE" && (
                    <TouchableOpacity
                      onPress={() => handleNotificar(ventasDetalladas)}
                      style={styles.BtnNotificar}
                    >
                      <MaterialIcons
                        name="notifications-active"
                        size={24}
                        color="#FFF"
                      />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={async () => {
                      setModalHistorialPagos(true);
                      await cargarHistorialPagos(ventasDetalladas.ID_VENTA);
                    }}
                    style={styles.BtnPagos}
                  >
                    <Text style={styles.BtnPagoText}>Historial de Pagos</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                onPress={async () => {
                  setModalProductosVendidos(true);
                  await cargarHistorialVentas(ventasDetalladas.ID_VENTA);
                }}
                style={styles.BtnProductos}
              >
                <Text style={styles.BtnProductosText}>Productos Vendidos</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.content,
                {
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  marginTop: 10,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.label}>Cliente</Text>
                <Text style={styles.valor}>{ventasDetalladas.CLIENTE}</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.label}>Codigo</Text>
                <Text style={styles.valor}>{ventasDetalladas.ID_VENTA}</Text>
              </View>
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
                    <Text style={styles.BtnPagarText}>
                      {parseFloat(ABONO) === 0.0 ? (
                        <Text>Adjuntar primer pago</Text>
                      ) : (
                        <Text>Adjuntar Pago</Text>
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {ventasDetalladas.ESTADO_PAGO === "PAGADO" && (
              <TouchableOpacity
                onPress={() => {
                  handleGenerarFactura();
                }}
                style={styles.btnFactura}
              >
                <Entypo name="text-document" size={35} color="#FFF" />
              </TouchableOpacity>
            )}

           {mostrarBotonDevolucion && (<TouchableOpacity 
           onPress={() => {
            setModalDevolucion(true);
           }}
           style={styles.Btndevolucion}>
            <MaterialCommunityIcons name="account-remove-outline" size={30} color="black" />
            </TouchableOpacity>)}
          </View>
        )}
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
            TasaBolivares={TasaBolivares}
            TasaPesos={TasaPesos}
          />
        </Modal>

        <Modal visible={modalProductosVendidos} animationType="fade">
          <HistorialProductosVenta
            setModalProductosVendidos={setModalProductosVendidos}
            historialVentas={historialVentas}
          />
        </Modal>

        <Modal visible={modalDevolucion} animationType="fade">
        <DevolucionesProcesar
        setModalDevolucion={setModalDevolucion}
        CLIENTE={CLIENTE}
        VENTA_ID={VENTA_ID}
        historialVentas={historialVentas}
        cargarVentas={cargarVentas}
        cargarProductos={cargarProductos}
        closeInformacionVentas={closeInformacionVentas}
        cargarDevoluciones={cargarDevoluciones}
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  botonesContenedor: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  BtnProductos: {
    backgroundColor: "green",
    padding: 7.5,
    borderRadius: 50,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
  btnFactura: {
    backgroundColor: "maroon",
    padding: 8,
    borderRadius: 50,
  },
  BtnNotificar: {
    backgroundColor: "maroon",
    padding: 5,
    borderRadius: 50,
    position: "absolute",
    top: -15,
    left: -20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  BtnPagarText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "900",
  },
  Btndevolucion:{
    backgroundColor: "#C70039",
    padding: 5,
    borderRadius: 50,
    position: "absolute",
    bottom: 5,
    right: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  BtndevolucionText:{
    color: "#000",
    textAlign: "center",
    fontSize: 11.5,
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
