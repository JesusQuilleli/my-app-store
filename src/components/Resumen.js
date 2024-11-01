import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable
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
      <Pressable 
      style={styles.btn}
      onLongPress={()=> console.log('Abrir Modal Ventas')}
      >
        <Text style={styles.tituloBtn}><Text style={{color:'#000'}}>Ultimas{' '}</Text>Ventas</Text>
      </Pressable>

      <View style={styles.tableVentas}>
        <FlatList
          data={DATA}
          renderItem={({ item }) => (
            <Item title={item.title} fecha={item.fecha} monto={item.monto} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <Pressable 
      style={styles.btn}
      onLongPress={()=> console.log('Abrir Modal Deudores')}
      >
        <Text style={styles.tituloBtn}>Deudores <Text style={{color:'#000'}}>Recientes</Text></Text>
      </Pressable>

      <View style={styles.tableVentas}>
        <FlatList
          data={DATA}
          renderItem={({ item }) => (
            <Item title={item.title} fecha={item.fecha} monto={item.monto} />
          )}
          keyExtractor={(item) => item.id}
        />
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
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    borderColor: "#000",
    borderWidth: 0.5,
    marginTop: 20
  },
  tituloBtn: {
    fontSize: 24,
    color: "#fee03e",
    fontWeight: "700",
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
