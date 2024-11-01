import React, { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';

const SinConexion = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animación de opacidad

  useEffect(() => {
    // Aparecer y desaparecer la animación
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2500), // Mantener visible por 2.5 segundos
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.text}>No hay conexión con el servidor</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 5,
    marginHorizontal: 20,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SinConexion;
