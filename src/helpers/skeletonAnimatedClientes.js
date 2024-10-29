import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonLoaderClientes = () => {
  const opacity = useRef(new Animated.Value(0.5)).current;

  // Función para iniciar la animación de opacidad
  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000, // Duración para llegar a opacidad completa
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 1000, // Duración para volver a opacidad reducida
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Iniciar la animación al montar el componente
  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <View style={styles.skeletonContainer}>
      {[...Array(10)].map((_, index) => (
        <Animated.View key={index} style={[styles.skeletonRow, { opacity }]}>
          <View style={styles.skeletonText} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    padding: 10,
  },
  skeletonRow: {
    height: 50,
    backgroundColor: '#e0e0e0', // Color de los elementos
    borderRadius: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  skeletonText: {
    height: 20,
    width: '100%',
    backgroundColor: '#d0d0d0', // Color del texto
    borderRadius: 5,
  },
});

export default SkeletonLoaderClientes;
