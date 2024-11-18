import { View, Text, StyleSheet } from 'react-native';

const InfoCard = ({ title, value }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems:'center'
  },
  title: { fontSize:20, fontWeight: 'bold', color: '#000', textAlign:'center', textTransform:'uppercase' },
});

export default InfoCard