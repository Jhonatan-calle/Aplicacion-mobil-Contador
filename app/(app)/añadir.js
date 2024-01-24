import React, { useState } from "react";
import {
	View,
	TextInput,
	Button,
	StyleSheet,
	useColorScheme,
	ActivityIndicator,
	Alert,
} from "react-native";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { UseSession } from "../../ctx";
import { db } from "../../firebaseCofig";

const MyForm = () => {
	const [nombre, setNombre] = useState("");
	const [direccion, setDireccion] = useState("");
	const [contacto, setContacto] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [loading, setLoading] = useState(false);
	const { user } = UseSession();

	const colorScheme = useColorScheme();
	const isDarkMode = true; //colorScheme === "dark";

	const handleFormSubmit = async () => {
		if (!nombre) {
			Alert.alert("Campos obligatorios", "Campo nombre obligatorio.");
			return; // Detener el envío del formulario si faltan campos obligatorios
		}

		try {
			setLoading(true);

			const clientesRef = collection(db, "users", user, "clientes");

			await addDoc(clientesRef, {
				nombre: nombre.trim(),
				direccion: direccion.trim(),
				contacto: contacto.toString(),
				descripcion: descripcion.trim(),
				orderIndex: 0,
			});

			router.back();
		} catch (error) {
			Alert.alert(
				"Error al insertar datos",
				"Hubo un problema al guardar los datos. Por favor, inténtalo de nuevo."
			);
			console.error("Error al guardar el cliente:", error);
		} finally {
			setLoading(false);
		}
	};

	
	if (loading) {
		return (
			<View style={[styles.container, styles.horizontal]}>
				<ActivityIndicator size="large" color="#999999" />
			</View>
		);
	}

	return (
		<View style={[styles.container, isDarkMode && styles.containertDark]}>
			<TextInput
				placeholder="Nombre"
				value={nombre}
				onChangeText={setNombre}
				style={[styles.input, isDarkMode && styles.inputDark]}
				placeholderTextColor={isDarkMode ? "gray" : "lightgray"}
				selectionColor={isDarkMode ? "white" : "black"}
			/>
			<TextInput
				placeholder="Direccion"
				value={direccion}
				onChangeText={setDireccion}
				style={[styles.input, isDarkMode && styles.inputDark]}
				placeholderTextColor={isDarkMode ? "gray" : "lightgray"}
				selectionColor={isDarkMode ? "white" : "black"}
			/>
			<TextInput
				placeholder="Contacto"
				value={contacto}
				onChangeText={(text) => {
					setContacto(text);
				}}
				style={[styles.input, isDarkMode && styles.inputDark]}
				placeholderTextColor={isDarkMode ? "gray" : "lightgray"}
				selectionColor={isDarkMode ? "white" : "black"}
				keyboardType="numeric" // Establece el tipo de teclado como numérico
			/>
			<TextInput
				placeholder="Descripcion"
				value={descripcion}
				onChangeText={setDescripcion}
				multiline={true}
				numberOfLines={6} // Define un máximo de líneas antes de habilitar el scroll
				style={[
					styles.input,
					styles.descriptionInput,
					isDarkMode && styles.inputDark,
				]}
				placeholderTextColor={isDarkMode ? "gray" : "lightgray"}
				selectionColor={isDarkMode ? "white" : "black"}
			/>
			<Button title="añadir" onPress={handleFormSubmit} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1, // Ocupa toda la pantalla
		padding: 20, // Espaciado interno
		flex: 1,
		backgroundColor: "white",
		justifyContent: "center",
	},
	containertDark: {
		backgroundColor: "black",
	},
	input: {
		height: 40,
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		borderColor: "black", // Color del borde para el modo claro
		color: "black", // Color del texto para el modo claro
		marginBottom: 10,
	},
	inputDark: {
		borderColor: "white", // Color del borde para el modo oscuro
		color: "lightgray", // Color del texto para el modo oscuro
	},
	descriptionInput: {
		minHeight: 100, // Altura mínima del campo de descripción
		textAlignVertical: "top", // Texto se alinea desde arriba
	},
});

export default MyForm;
