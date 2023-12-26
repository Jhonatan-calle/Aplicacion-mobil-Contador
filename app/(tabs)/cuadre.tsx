import React from 'react';
import { Pressable,StyleSheet } from 'react-native';
import { View, Text } from '../../components/Themed';
import { Link } from 'expo-router';

export default function cuadre() {

 
  return (
      <View style={styles.container}>
        <Link href="/(cuadre)/Cdiario" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Hoy</Text>
          </Pressable>
        </Link>
        <Link href="/(cuadre)/cSemanal" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Semana</Text>
          </Pressable>
        </Link>
        <Link href="/(cuadre)/formGasto" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Añadir gasto</Text>
          </Pressable>
        </Link>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
  }
});