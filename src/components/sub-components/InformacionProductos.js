import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Ionicons from '@expo/vector-icons/Ionicons';

const InformacionProductos = ({setModalProducto, producto, setProducto}) => {

   const handleClose = () => {
      setModalProducto(false);
      setProducto({});
    };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Informacion <Text style={styles.tituloBold}>Producto</Text>
      </Text>

      <View style={styles.contenido}>
        <View style={styles.campo}>
          <Text style={styles.label}>Categoria</Text>
          <Text style={styles.valor}>{producto.CATEGORIA}</Text>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Marca</Text>
          <Text style={styles.valor}>{producto.PRODUCTO}</Text>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Descripcion</Text>
          <Text style={styles.valor}>{producto.DESCRIPCION}</Text>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Precio</Text>
          <Text style={styles.valor}>{producto.PRECIO} $</Text>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Cantidad</Text>
          <Text style={styles.valor}>{producto.CANTIDAD} Unidades</Text>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Imagen</Text>
          {(producto.IMAGEN.includes('null')) ? (
            <View style={{margin: 'auto', }}>
            <MaterialCommunityIcons name="image-remove" size={200} color="#fcd53f" />
            </View>
          ) : (
            <Image source={{ uri: producto.IMAGEN }} style={styles.image} />
          )}
        </View>
      </View>

      <View>
        <TouchableOpacity style={styles.btnCerrar} onPress={handleClose}>
          <Text style={styles.btnCerrarTexto}><Ionicons name="return-down-back" size={24} color="#FFF" /></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InformacionProductos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fee03e",
  },
  titulo: {
    fontSize: 24,
    textAlign: "center",
    color: "#2e252a",
    marginTop: 30,
    fontWeight: "600",
    backgroundColor: "#FFF",
    padding: 5,
    borderRadius: 50,
    marginHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tituloBold: {
    fontSize: 26,
    color: "#fcd53f",
    fontWeight: "bold",
  },
  btnCerrar: {
    marginTop: 25,
    backgroundColor: "#2e252a",
    marginHorizontal: 60,
    padding: 20,
    borderRadius: 10,
  },
  btnCerrarTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
    textTransform: "uppercase",
  },
  contenido: {
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
  campo: {
    marginBottom: 10,
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 50,
    marginTop: 10,
    borderColor: '#fcd53f',
    borderWidth: 1
  },
});
