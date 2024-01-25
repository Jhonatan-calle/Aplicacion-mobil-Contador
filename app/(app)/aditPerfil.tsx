import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
	View,
	TextInput,
	Button,
	StyleSheet,
	useColorScheme,
	ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseCofig";
import { UseSession } from "../../ctx";

const aditPerfil = () => {
	const [nombre, setNombre] = useState<any>("");
	const [direccion, setDireccion] = useState<any>("");
	const [contacto, setContacto] = useState<any>("");
	const [descripcion, setDescripcion] = useState<any>("");
	const [loading, setLoading] = useState<boolean>(true);
	const { id } = useLocalSearchParams<{ id: string }>();
	const [perfil, setPerfil] = useState<any>(null);
	const { user } = UseSession();

	useEffect(() => {
		setLoading(true);
		if (user) {
			getDoc(doc(db, "users", user, "clientes", id)).then((docSnap) => {
				const perfilRef = { ...docSnap.data(), id: docSnap.id };
				setPerfil(perfilRef);
			});
		}
		setLoading(false);
	}, [id]);

	useEffect(() => {
		if (perfil) {
			setNombre(perfil.nombre);
			setDireccion(perfil.direccion);
			setContacto(perfil.contacto.toString());
			setDescripcion(perfil.descripcion);
		}
	}, [perfil]);

	const colorScheme = useColorScheme();
	const isDarkMode = true; //colorScheme === "dark";

	const handleFormSubmit = () => {
		if (!nombre) {
			Alert.alert("Campos obligatorios", "El campo nombre es obligatorio");
			return; // Detener el envío del formulario si faltan campos obligatorios
		}
		if (user) {
			const perfilRef = doc(db, "users", user, "clientes", id);

			setDoc(
				perfilRef,
				{
					nombre: nombre.trim(),
					direccion: direccion.trim(),
					contacto: contacto.toString(),
					descripcion: descripcion.trim(),
				},
				{ merge: true }
			);
			router.back();
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
				value={nombre}
				onChangeText={setNombre}
				style={[styles.input, isDarkMode && styles.inputDark]}
				placeholderTextColor={isDarkMode ? "gray" : "lightgray"}
				selectionColor={isDarkMode ? "white" : "black"}
			/>
			<TextInput
				value={direccion}
				onChangeText={setDireccion}
				style={[styles.input, isDarkMode && styles.inputDark]}
				placeholderTextColor={isDarkMode ? "gray" : "lightgray"}
				selectionColor={isDarkMode ? "white" : "black"}
			/>
			<TextInput
				value={contacto ? contacto.toString() : ""}
				onChangeText={(text) => {
					const parsedContacto = parseInt(text);
					if (!isNaN(parsedContacto)) {
						setContacto(parsedContacto);
					}
				}}
				style={[styles.input, isDarkMode && styles.inputDark]}
				placeholderTextColor={isDarkMode ? "gray" : "lightgray"}
				selectionColor={isDarkMode ? "white" : "black"}
				keyboardType="numeric" // Establece el tipo de teclado como numérico
			/>
			<TextInput
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
	horizontal: {
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 10,
	},
});

export default aditPerfil;
