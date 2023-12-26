import { StyleSheet, TextInput, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { View } from '../../components/Themed';

export default function cuadre() {
  const [text, onChangeText] = useState('Buscar');
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isDarkMode && styles.inputDark]}
          onChangeText={onChangeText}
          placeholder="Buscar"
          placeholderTextColor={isDarkMode ? 'gray' : 'lightgray'}
          value={text}
          selectionColor={isDarkMode ? 'white' : 'black'}
        />
      </View>
      {/* Resto del contenido */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    width: '100%', // Ocupa todo el ancho disponible
    paddingHorizontal: 10, // Espacio horizontal para evitar el borde de la pantalla
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: 'black', // Color del borde para el modo claro
    color: 'black', // Color del texto para el modo claro
  },
  inputDark: {
    borderColor: 'white', // Color del borde para el modo oscuro
    color: 'lightgray', // Color del texto para el modo oscuro
  },
});

