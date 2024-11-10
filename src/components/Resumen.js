import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity
} from "react-native";
const Resumen = () => {
  //DATA DE EJEMPLO
  const DATA = [
    { id: "1", title: "Cliente 1", fecha: "00/00/2000", monto: "$100" },
    { id: "2", title: "Cliente 2", fecha: "01/01/2001", monto: "$200" },
    { id: "3", title: "Cliente 3", fecha: "02/02/2002", monto: "$300" },
    { id: "4", title: "Cliente 4", fecha: "03/03/2003", monto: "$400" },
    { id: "5", title: "Cliente 5", fecha: "04/04/2004", monto: "$500" },
    { id: "6", title: "Cliente 6", fecha: "05/05/2005", monto: "$600" },
    { id: "7", title: "Cliente 7", fecha: "06/06/2006", monto: "$700" },
  ];

  const Item = ({ title, fecha, monto }) => (
    <View style={styles.item}>
      <Text style={styles.title}><Text style={{color: '#000', fontSize: 20}}>Nombre Cliente:</Text> {title}</Text>
      <Text style={styles.fecha}>Fecha Venta: {fecha}</Text>
      <Text style={styles.monto}>Monto Total: {monto}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
      style={styles.btn}
      onLongPress={()=> console.log('Abrir Modal Ventas')}
      >
        <Text style={{color:'#000', fontSize: 24}}>Pagos{' '}</Text>
        <Text style={styles.nro}>5</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.btn}
      onLongPress={()=> console.log('Abrir Modal Deudores')}
      >
        <Text style={{color:'#000', fontSize: 24}}>Deudores</Text>
        <Text style={styles.nro}>15</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.btn}
      onLongPress={()=> console.log('Abrir Modal Deudores')}
      >
        <Text style={{color:'#000', fontSize: 24}}>Hoy</Text>
        <Text style={styles.nro}>15</Text>
      </TouchableOpacity>

      <Text>Totales</Text>

      <View style={styles.contentGroup}>
        <Text style={{color:'#000', fontSize: 24}}>Productos</Text>
        <Text style={styles.nro}>20</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: '#f2f2f2'
  },
  btn: {
    backgroundColor: "#fff",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 20,
    padding: 20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around'
  },
  nro:{
    fontSize: 30,
    fontWeight: '900'
  },
 
  tableVentas: {
    width: "90%",
    marginTop: 10,
    borderRadius: 25,
    overflow: "hidden",
    maxHeight: 250,
  },
  item: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: "#000",
    borderBottomWidth: 0.2,
  },
  title: {
    fontSize: 18,
    color: '#fee03e',
    fontWeight: '600'
  },
  fecha:{
    fontSize: 14,
    fontWeight: '300'
  },
  monto: {
    fontSize: 14,
    fontWeight: '800'
  }
});

export default Resumen;
