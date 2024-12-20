import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";

import Checkbox from "expo-checkbox";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { formatearFechaOtroFormato } from "./../../../helpers/validaciones.js";

import axios from "axios";
import { url } from "./../../../helpers/url.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProcesarVenta = ({
  setModalVenta,
  productosCarrito, // SE USA PARA INSERTAR LA VENTA (MONTO TOTAL: PRECIO * CANTIDAD, )
  setProductosCarrito,
  productos,
  setProductos,
  fecha, // SE USA PARA INSERTAR LA VENTA
  clienteSeleccionado, // SE USA PARA INSERTAR LA VENTA
  closeForm,
  cargarVentas,
  cargarProductos,
  TasaBolivares,
  TasaPesos,
}) => {
  //USE-STATE PARA LA VENTA
  const [tipoPago, setTipoPago] = useState("AL CONTADO");
  const [estadoPago, setEstadoPago] = useState("PAGADO");
  const [primerAbono, setPrimerAbono] = useState(0);
  const [opciones, setOpciones] = useState("NO");
  const FechaActual = new Date();

  //CARGA
  const [isLoading, setIsLoading] = useState(false);

  //CALCULAR EL PRECIO TOTAL DE PRODUCTOS SELECCIONADOS
  const totalPrecio = productosCarrito.reduce(
    (total, item) => total + item.PRECIO * item.CANTIDAD,
    0
  );

  //CALCULAR EL CANTIDAD TOTAL DE PRODUCTOS SELECCIONADOS TOTAL
  const totalCantidadProductos = productosCarrito.reduce(
    (total, item) => total + item.CANTIDAD,
    0
  );

  // FUNCION PARA MANEJAR EL TIPO DE PAGO
  const handleTipoPago = (tipo) => {
    setTipoPago(tipo);
    setEstadoPago(tipo === "AL CONTADO" ? "PAGADO" : "PENDIENTE");
  };

  // FUNCION PARA MANEJAR EL TIPO DE PAGO
  const handleOpciones = (tipo) => {
    setOpciones(tipo);
  };

  //QUITAR PRODUCTOS
  const quitarProductoDelCarrito = (producto) => {
    const productoEnCarrito = productosCarrito.find(
      (item) => item.ID_PRODUCTO === producto.ID_PRODUCTO
    );

    if (!productoEnCarrito) {
      console.log("El producto no está en el carrito");
      return;
    }

    // Aumentar la cantidad en la lista de productos
    const productosActualizados = productos.map((item) => {
      if (item.ID_PRODUCTO === producto.ID_PRODUCTO) {
        return { ...item, CANTIDAD: item.CANTIDAD + 1 };
      }
      return item;
    });
    setProductos(productosActualizados);

    // Quitar o actualizar el producto en el carrito
    let carritoActualizado;
    if (productoEnCarrito.CANTIDAD > 1) {
      carritoActualizado = productosCarrito.map((item) => {
        if (item.ID_PRODUCTO === producto.ID_PRODUCTO) {
          return { ...item, CANTIDAD: item.CANTIDAD - 1 };
        }
        return item;
      });
    } else {
      carritoActualizado = productosCarrito.filter(
        (item) => item.ID_PRODUCTO !== producto.ID_PRODUCTO
      );
    }
    setProductosCarrito(carritoActualizado);
  };

  //PROCESAR VENTA
  const procesarVenta = async () => {
    setIsLoading(true); // Comienza la carga
    try {
      // Obtener el ID del administrador desde AsyncStorage
      const adminId = await AsyncStorage.getItem("adminId");

      // Calcular monto pendiente si aplica
      const totalPendiente = totalPrecio - primerAbono;

      // Preparar los datos de la venta
      const ventaData = {
        clienteId: clienteSeleccionado.ID_CLIENTE,
        pagoTotal: parseFloat(parseFloat(totalPrecio).toFixed(2)),
        montoPendiente:
          tipoPago === "POR ABONO" ? parseFloat(totalPendiente.toFixed(2)) : 0,
        fechaVenta: fecha.toISOString().slice(0, 10),
        estadoPago: tipoPago === "AL CONTADO" ? "PAGADO" : "PENDIENTE",
        tipoPago: tipoPago,
        administradorId: adminId,
      };

      // 1. Procesar el carrito: Enviar el array completo de productos
      try {
        await axios.put(`${url}/updateProductosStock`, productosCarrito); // Enviar todos los productos
      } catch (error) {
        console.error("Error al actualizar el stock de los productos", error);
        throw new Error(
          "No se pudo actualizar el stock. Verifica los productos."
        );
      }

      // 2. Registrar la venta en la base de datos
      const response = await axios.post(`${url}/procesarVenta`, ventaData);
      const ventaId = response.data.ID_VENTA;

      // 3. Registrar los productos de la venta
      try {
        await axios.post(`${url}/ventaProductos`, {
          ventaId: ventaId,
          productos: productosCarrito, // Enviar el array completo de productos
        });
      } catch (error) {
        console.error("Error al registrar los productos de la venta", error);
        throw new Error("Error al registrar los productos en la venta.");
      }

      // Limpiar el carrito después de procesar la venta
      setProductosCarrito([]);
    } catch (error) {
      console.error("Error al procesar la venta", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al procesar la venta. Inténtalo nuevamente."
      );
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  };

  // Función para procesar la venta
  const handleVenta = async () => {
    try {
      if (productosCarrito.length === 0) {
        Alert.alert(
          "Carga Productos al Carrito",
          "No puedes procesar la venta sin productos que vender."
        );
        return;
      }

      if (primerAbono > totalPrecio) {
        Alert.alert(
          "Error al procesar la venta.",
          "No puedes abonar un monto superior a la deuda de la venta."
        );
        return;
      }

      if (fecha > FechaActual) {
        Alert.alert(
          "Error al procesar la venta.",
          "No puedes realizar una venta en fechas futuras."
        );
        return;
      }

      setIsLoading(true);

      // Mostrar la alerta de éxito
      Alert.alert(
        "Confirmación",
        "¿Estás seguro de que deseas procesar la venta?",
        [
          {
            text: "Cancelar", // Opción para cancelar
            onPress: () => {
              
            },
            style: "cancel", // Estilo específico para dar énfasis de cancelación
          },
          {
            text: "Aceptar", // Opción para confirmar la venta
            onPress: async () => {
              await procesarVenta();
              // Aquí limpias los campos que necesites
              setProductosCarrito([]); // Limpia el carrito de productos
              setPrimerAbono(""); // Limpia el campo de abono
              cargarVentas();
              cargarProductos();
              setModalVenta(false);
              closeForm();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error al procesar la venta", error);
      Alert.alert("Error", "Ocurrió un error al procesar la venta.");
    } finally {
      setIsLoading(false);
    }
  };

  const Item = ({ nombre, cantidad, precio, quitar }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.nombre}>
          <Text>{nombre}</Text>
        </Text>
        <Text style={styles.cantidad}>Cantidad: {cantidad}</Text>
        <Text style={styles.precio}>
          Unidad Precio: {precio} <Text style={{ fontSize: 12 }}>Dolares</Text>
        </Text>
        <Text style={styles.precio}>
          Total: {(precio * cantidad).toFixed(2)}{" "}
          <Text style={{ fontSize: 12 }}>Dolares</Text>
        </Text>
      </View>
      <TouchableOpacity onPress={quitar} style={styles.BtnMenos}>
        <AntDesign name="minus" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

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
          <View style={styles.headerTitulo}>
            <Text style={styles.titulo}>Cliente </Text>
            <Text style={styles.tituloCliente}>
              {clienteSeleccionado.NOMBRE}
            </Text>
          </View>
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
            {productosCarrito.length < 1 && (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                }}
              >
                Sin Productos Seleccionados
              </Text>
            )}
            <FlatList
              data={productosCarrito}
              renderItem={({ item }) => (
                <Item
                  nombre={item.NOMBRE}
                  cantidad={item.CANTIDAD}
                  precio={item.PRECIO}
                  quitar={() => quitarProductoDelCarrito(item)}
                />
              )}
              keyExtractor={(item) => item.ID_PRODUCTO}
            />
          </View>
          <View style={styles.contentFecha}>
            <Text style={styles.textFecha}>FECHA VENTA</Text>
            <Text style={styles.textFecha}>
              {formatearFechaOtroFormato(fecha)}
            </Text>
          </View>
          <View
            style={{ borderTopColor: "#000", borderTopWidth: 1, marginTop: 5 }}
          >
            <Text style={styles.tituloPago}>Tipo de Pago</Text>
          </View>
          <View style={styles.contentOpcionesPago}>
            <View style={styles.hijoOpcionesPago}>
              <Text style={styles.hijoOpcionesPagoText}>POR ABONO</Text>
              <Checkbox
                value={tipoPago === "POR ABONO"}
                onValueChange={() => handleTipoPago("POR ABONO")}
              />
            </View>
            <View style={styles.hijoOpcionesPago}>
              <Text style={styles.hijoOpcionesPagoText}>AL CONTADO</Text>
              <Checkbox
                value={tipoPago === "AL CONTADO"}
                onValueChange={() => handleTipoPago("AL CONTADO")}
              />
            </View>
          </View>

          {tipoPago === "POR ABONO" && (
            <View style={{ marginTop: 5 }}>
              <Text style={styles.tituloPago}>
                ¿Desea agregar un abono Inicial?
              </Text>

              <View style={styles.contentOpcionesPago}>
                <View style={styles.hijoOpcionesPago}>
                  <Text style={styles.hijoOpcionesPagoText}>SI</Text>
                  <Checkbox
                    value={opciones === "SI"}
                    onValueChange={() => handleOpciones("SI")}
                  />
                  <Text style={styles.hijoOpcionesPagoText}>NO</Text>
                  <Checkbox
                    value={opciones === "NO"}
                    onValueChange={() => handleOpciones("NO")}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.contentTotal}>
            <Text style={styles.textTotal}>Monto Total</Text>
            <Text style={styles.textTotal}>{totalPrecio.toFixed(2)} $</Text>
          </View>
          <View style={styles.contentTotal}>
            <Text style={styles.textTotal}>En Bolivares</Text>
            <Text style={styles.textTotal}>
              {isNaN(TasaBolivares) || TasaBolivares === 0 ? (
                <Text style={{ fontSize: 12 }}>No disponible</Text>
              ) : (
                (totalPrecio * TasaBolivares).toFixed(2)
              )}
              <Text style={{ fontSize: 12 }}>
                {isNaN(TasaBolivares) ? <Text></Text> : <Text> Bs</Text>}{" "}
              </Text>
            </Text>
          </View>

          <View style={styles.contentTotal}>
            <Text style={styles.textTotal}>En Pesos</Text>
            <Text style={styles.textTotal}>
              {isNaN(TasaPesos) || TasaPesos === 0 ? (
                <Text style={{ fontSize: 12 }}>No disponible</Text>
              ) : (
                (totalPrecio * TasaPesos).toFixed(0)
              )}
              <Text style={{ fontSize: 12 }}>
                {isNaN(TasaPesos) ? <Text></Text> : <Text> Pesos</Text>}{" "}
              </Text>
            </Text>
          </View>
          <View style={styles.contentTotal}>
            <Text style={styles.textTotal}>Cantidad</Text>
            <Text style={styles.textTotal}>{totalCantidadProductos}</Text>
          </View>
          {tipoPago === "POR ABONO" && opciones === "SI" && (
            <View style={styles.primerAbono}>
              <Text style={[styles.textAbono, { fontSize: 16 }]}>
                PRIMER ABONO
              </Text>
              <TextInput
                placeholder="500"
                keyboardAppearance="default"
                keyboardType="numeric"
                style={styles.keyAbono}
                value={primerAbono}
                onChangeText={(value) => {
                  const numericValue = parseFloat(value); // Convertir a número

                  if (numericValue < 0) {
                    Alert.alert(
                      "Error",
                      "Error: no se puede un Abono Negativo"
                    );
                    setPrimerAbono(""); // Reiniciar el estado
                  } else {
                    setPrimerAbono(value); // Solo establece el valor si es válido
                  }
                }}
              />
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.BtnProcesarVenta} onPress={handleVenta}>
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
  },
  headerTitulo: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#000",
  },
  titulo: {
    fontSize: 24,
    color: "#fcd53f",
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  tituloCliente: {
    fontSize: 24,
    color: "#000",
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 3,
  },
  btnClose: {
    position: "absolute",
    top: -20,
    right: -15,
  },
  content: {
    marginTop: 20,
    width: "100%",
  },
  tableVentas: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    maxHeight: 200,
    borderTopColor: "#000",
    borderTopWidth: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  cantidad: {
    fontSize: 14,
    fontWeight: "800",
  },
  precio: {
    fontSize: 14,
    fontWeight: "700",
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
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
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
  textAbono: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },
  keyAbono: {
    fontSize: 20,
    fontWeight: "900",
    width: "25%",
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
