import React, { useState } from 'react'
import { Text, StyleSheet, View, Pressable, Image} from 'react-native'

//COMPONENTE DE BIENVENIDA INICIO DE APLICACIÓN

const Welcome = ({navigation}) => {

   const [isPressed, setIsPressed] = useState(false); //ESTADO PARA SABER CUANDO ESTA PRESIONADO EL BOTON Y CUANDO NO

  return (
   <View style={styles.container}>
      <Image source={require('../assets/resources/imagenPrueba.jpg')} style={styles.imagen}/>
         <Text style={styles.titulo}>Inversiones{' '}<Text style ={styles.tituloBold}>Margarita</Text></Text>

      <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={() => navigation.navigate('Login')}
      style={isPressed ? styles.btnPressed : styles.btnStarted}
      >
         <Text style={isPressed ? styles.btnPressedText : styles.btnStartedText}>
            Vamos
         </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
   //ESTILOS AQUI
   container:{
      backgroundColor: '#fff',
      flex: 1,
      justifyContent:'center',
      alignItems:'center'
   },
   imagen:{
      width: 250,
      height: 250,
      borderRadius: 50,
      borderColor:'#fff',
      marginBottom: 60
   },
   titulo:{
      fontSize: 40,
      fontWeight:'400',
      letterSpacing:4,
      textAlign:'center'
   },
   tituloBold:{
      fontWeight:'700',
      color:'#fee03e',
      textAlign:'center'
   },
   btnStarted: {
      padding: 15,
      borderColor: '#fee03e',
      borderWidth: 2,
      borderRadius: 20,
      marginTop: 100,
      backgroundColor: '#fff'
   },
   btnPressed: {
      marginTop: 100,
      backgroundColor: '#fee03e',
      padding: 15,
      borderRadius: 20,
      borderColor: '#fff',
      borderWidth: 2,
    },
   btnStartedText:{
      color: '#000',
      fontSize: 24,
      fontWeight:'700'
   },
   btnPressedText: {
      color: '#000',
      fontSize: 24,
      fontWeight: '700',
    },
})


export default Welcome