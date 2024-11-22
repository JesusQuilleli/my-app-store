import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

const HistorialProductosVenta = ({
  setModalProductosVendidos,
  historialVentas,
}) => {
  //CARGA
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (historialVentas && historialVentas.length !== 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [historialVentas]);

  const Item = ({ PRODUCTO, DESCRIPCION, CANTIDAD }) => (
    <View style={styles.item}>
      <Text style={styles.nombreProducto}>{PRODUCTO}</Text>
      <Text style={styles.defecto}>
        Descripción: <Text style={{ color: "#000" }}>{DESCRIPCION}</Text>
      </Text>
      <Text style={styles.defecto}>
        Cantidad: <Text style={{ color: "#000" }}>{CANTIDAD}</Text>
      </Text>
      
    </View>
  );

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>HISTORIAL DE PRODUCTOS</Text>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => setModalProductosVendidos(false)}
          >
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fee03e" />
          </View>
        ) : (
          <FlatList
            data={historialVentas}
            keyExtractor={(item) => `${item.VENTA_ID}-${item.ID_PRODUCTO}`}
            style={styles.tablePagos}
            renderItem={({ item }) => (
              <Item PRODUCTO={item.PRODUCTO} DESCRIPCION={item.DESCRIPCION} CANTIDAD={item.CANTIDAD} />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default HistorialProductosVenta;

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
  tablePagos: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    width: "100%",
  },
  nombreProducto: {
    fontSize: 18,
    fontWeight: "800",
  },
  defecto: {
    fontSize: 15,
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
  },
});
