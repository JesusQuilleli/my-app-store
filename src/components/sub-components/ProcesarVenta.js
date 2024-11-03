import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";

import Checkbox from "expo-checkbox";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { formatearFechaOtroFormato } from "../../helpers/validaciones";

import axios from "axios";
import { url } from "./../../helpers/url.js";

const ProcesarVenta = ({
  setModalVenta,
  productosCarrito,
  setProductosCarrito,
  productos,
  setProductos,
  fecha,
  clienteSeleccionado,
}) => {
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

  const quitarProductoDelCarrito = async (producto) => {
    // Verifica si el producto ya está en el carrito
    const productoEnCarrito = productosCarrito.find(
      (item) => item.ID_PRODUCTO === producto.ID_PRODUCTO
    );

    if (!productoEnCarrito) {
      console.log("El producto no está en el carrito");
      return;
    }

    // Sumar uno a la cantidad del producto en la lista de productos
    const productosActualizados = productos.map((item) => {
      if (item.ID_PRODUCTO === producto.ID_PRODUCTO) {
        return { ...item, CANTIDAD: item.CANTIDAD + 1 }; // Suma uno
      }
      return item;
    });
    setProductos(productosActualizados);

    // Disminuir la cantidad en el carrito
    let carritoActualizado;
    if (productoEnCarrito.CANTIDAD > 1) {
      // Si la cantidad es mayor que 1, simplemente resta uno
      carritoActualizado = productosCarrito.map((item) => {
        if (item.ID_PRODUCTO === producto.ID_PRODUCTO) {
          return { ...item, CANTIDAD: item.CANTIDAD - 1 };
        }
        return item;
      });
    } else {
      // Si la cantidad es 1, elimina el producto del carrito
      carritoActualizado = productosCarrito.filter(
        (item) => item.ID_PRODUCTO !== producto.ID_PRODUCTO
      );
    }
    setProductosCarrito(carritoActualizado);

    // Actualizar la cantidad en la base de datos usando Axios
    try {
      await axios.put(`${url}/updateProductoStock/${producto.ID_PRODUCTO}`, {
        cantidad: 1, // Suma uno en la base de datos
      });
      console.log("Cantidad actualizada en la base de datos");
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad en la base de datos",
        error
      );
    }
  };

  const Item = ({ nombre, cantidad, precio, quitar }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.nombre}>
          PRODUCTO:{" "}
          <Text style={{ textDecorationLine: "underline" }}>{nombre}</Text>
        </Text>
        <Text style={styles.cantidad}>CANTIDAD: {cantidad}</Text>
        <Text style={styles.precio}>PRECIO: {precio}</Text>
        <Text style={styles.precio}>TOTAL: {precio * cantidad}</Text>
      </View>
      <TouchableOpacity onPress={quitar} style={styles.BtnMenos}>
        <AntDesign name="minus" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.modalOverlay}>
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
            <Text style={{textAlign:'center', fontSize: 20, fontWeight: 'bold', letterSpacing: 3}}>Sin Productos Seleccionados</Text>
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
              <Text style={styles.hijoOpcionesPagoText}>CUOTAS</Text>
              <Checkbox />
            </View>
            <View style={styles.hijoOpcionesPago}>
              <Text style={styles.hijoOpcionesPagoText}>AL CONTADO</Text>
              <Checkbox />
            </View>
          </View>
          <View style={styles.contentTotal}>
            <Text style={styles.textTotal}>MONTO TOTAL</Text>
            <Text style={styles.textTotal}>{totalPrecio}</Text>
          </View>
          <View style={styles.contentTotal}>
            <Text style={styles.textTotal}>CANTIDAD</Text>
            <Text style={styles.textTotal}>{totalCantidadProductos}</Text>
          </View>
          <View style={styles.primerAbono}>
            <Text style={styles.textAbono}>PRIMER ABONO</Text>
            <TextInput
              placeholder="500"
              keyboardAppearance="default"
              keyboardType="numeric"
              style={styles.keyAbono}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.BtnProcesarVenta}>
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
    maxHeight: 250,
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
    textTransform: "uppercase",
  },
  cantidad: {
    fontSize: 14,
    fontWeight: "900",
  },
  precio: {
    fontSize: 14,
    fontWeight: "900",
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
    fontSize: 20,
    fontWeight: "800",
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
    letterSpacing: 2,
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
