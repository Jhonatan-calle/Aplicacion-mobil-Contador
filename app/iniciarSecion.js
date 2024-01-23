import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, useColorScheme, ActivityIndicator } from 'react-native';
import { auth } from '../firebaseCofig';
import { UseSession } from '../ctx';


const IniciarSesion = () => {
  const colorScheme = 'dark'//  = useColorScheme(); Detectar el tema claro u oscuro del dispositivo

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setloadingg] = useState(false)
  const { user, LogIn } = UseSession();

  const handleIniciarSesion = async () => {
    if (!email || !password) {
      Alert.alert('Por favor, ingresa correo y contraseña.');
      return;
    }
  
    setloadingg(true);
  
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      LogIn(response.user.email);
      setloadingg(false);
      // Puedes redirigir a otra pantalla o realizar acciones adicionales después del inicio de sesión
      return;
    } catch (error) {
      setloadingg(false);
  
      let errorMessage = 'Error al iniciar sesión';
  
      // Personaliza los mensajes de error según el código de error
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Contraseña incorrecta. Verifica tu correo y contraseña.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email invalido. Verifica tu correo electrónico.';
          break;
        default:
          break;
      }
  
      Alert.alert('Error al iniciar sesión', errorMessage);
      return;
    }
  };
  
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white', // Ajustar el fondo según el tema
    },
    titulo: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: colorScheme === 'dark' ? 'white' : 'black', // Ajustar el color del texto según el tema
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 10,
      color: colorScheme === 'dark' ? 'white' : 'black', // Ajustar el color del texto según el tema
      
    },
    button: {
      backgroundColor: colorScheme === 'dark' ? 'gray' : 'blue', // Ajustar el color del botón según el tema
      color: 'white', // Ajustar el color del texto del botón según el tema
    },
  });

  if (loading) {
    return (
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#999999" />
        </View>
    );
}

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholderTextColor={colorScheme === 'dark' ? "gray" : "lightgray"}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholderTextColor={colorScheme === 'dark' ? "gray" : "lightgray"}
      />
      <Button title="Iniciar Sesión" onPress={handleIniciarSesion} style={styles.button} />
    </View>
  );
};

export default IniciarSesion;
