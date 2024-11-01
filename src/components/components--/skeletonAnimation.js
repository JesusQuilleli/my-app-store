import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonLoader = () => {
  const opacity = useRef(new Animated.Value(0)).current;

  // Función para iniciar la animación de opacidad
  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 2000, // Duración de la animación para llegar a opacidad completa
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 800, // Duración de la animación para volver a opacidad reducida
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
    <View style={styles.container}>
      <View style={styles.rowSkeleton}>
        <Animated.View style={[styles.skeletonItem, { opacity }]}>
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonImage} />
        </Animated.View>
        <Animated.View style={[styles.skeletonItem, { opacity }]}>
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonImage} />
        </Animated.View>
      </View>
      <View style={styles.rowSkeleton}>
        <Animated.View style={[styles.skeletonItem, { opacity }]}>
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonImage} />
        </Animated.View>
        <Animated.View style={[styles.skeletonItem, { opacity }]}>
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonImage} />
        </Animated.View>
      </View>
      <View style={styles.rowSkeleton}>
        <Animated.View style={[styles.skeletonItem, { opacity }]}>
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonImage} />
        </Animated.View>
        <Animated.View style={[styles.skeletonItem, { opacity }]}>
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonImage} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Color de fondo
    padding: 10,
  },
  rowSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonItem: {
    width: '48%',
    backgroundColor: '#e0e0e0', // Color de los elementos
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  skeletonImage: {
    height: 80,
    backgroundColor: '#d0d0d0', // Color de la imagen
    borderRadius: 5,
  },
  skeletonText: {
    height: 20,
    backgroundColor: '#d0d0d0', // Color del texto
    borderRadius: 5,
    marginBottom: 5,
   },
});

export default SkeletonLoader;

