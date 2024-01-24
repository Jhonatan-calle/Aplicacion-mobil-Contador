import React, { useState } from "react";
import { Alert } from "react-native";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	useColorScheme,
	TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { UseSession } from "../../ctx";
import { addDoc, collection, doc, increment, setDoc } from "firebase/firestore";
import { db } from "../../firebaseCofig";

const formGasto = () => {
	const [fecha, setFecha] = useState<any>(new Date());
	const [monto, setMonto] = useState<number>();
	const [descripcion, setDescripcion] = useState<string>();
	const [showDatePicker, setShowDatePicker] = useState(false);
	const { user } = UseSession();
	const colorScheme = useColorScheme();
	const isDarkMode = true; //colorScheme === "dark";

	const handleDateChange = (event: any, selectedDate: any) => {
		setShowDatePicker(false);
		if (selectedDate) {
			setFecha(selectedDate);
		}
	};

	function mondayWeek(date: any) {
		const currentDate = new Date(date);
		currentDate.setHours(0, 0, 0, 0);
		const currentDayOfWeek = currentDate.getDay();
		const differenceToMonday =
			currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
		currentDate.setDate(currentDate.getDate() - differenceToMonday);
		return `${currentDate}`;
	}

	function formatFecha(date: any) {
		const currentDate = new Date(date);
		currentDate.setHours(0, 0, 0, 0);
		return `${currentDate}`;
	}

	const handleFormSubmit = () => {
		if (!monto || !descripcion) {
			Alert.alert("Campos monto y descripcion obligatorio");
			return;
		}
		if (user) {
			addDoc(collection(db, "users", user, "gastos"), {
				fecha: formatFecha(fecha),
				monto: monto,
				descripcion: descripcion.trim(),
			});
			setDoc(
				doc(db, "users", user, "diario", formatFecha(fecha)),
				{ gastos: increment(monto) },
				{ merge: true }
			);
			setDoc(
				doc(db, "users", user, "semana", mondayWeek(fecha)),
				{ gastos: increment(monto) },
				{ merge: true }
			);
			router.back();
		}
	};

	return (
		<View style={[styles.container, isDarkMode && styles.containertDark]}>
			<TouchableOpacity
				style={[styles.button, isDarkMode && styles.buttonDark]}
				onPress={() => {
					setShowDatePicker(!showDatePicker);
				}}
			>
				<Text style={styles.buttonText}>
					Fecha:{" "}
					{new Date(fecha).toLocaleDateString("es-ES", {
						day: "numeric",
						month: "long",
						year: "numeric",
					})}
				</Text>
			</TouchableOpacity>

			{showDatePicker && (
				<DateTimePicker
					testID="dateTimePicker"
					value={fecha}
					mode="date"
					is24Hour={true}
					display="default"
					onChange={handleDateChange}
				/>
			)}
			<TextInput
				placeholder="Descripcion"
				value={descripcion}
				onChangeText={setDescripcion}
				multiline={true}
				style={[
					styles.input,
					styles.descriptionInput,
					isDarkMode && styles.inputDark,
				]}
				placeholderTextColor={isDarkMode ? "gray" : "lightgray"}
				selectionColor={isDarkMode ? "white" : "black"}
			/>
			<TextInput
				placeholder="Monto"
				value={monto?.toString() || ""}
				onChangeText={(text) => {
					const parsedMonto = parseFloat(text);
					if (!isNaN(parsedMonto)) {
						setMonto(parsedMonto);
					} else {
						setMonto(undefined);
					}
				}}
				style={[styles.input, isDarkMode && styles.inputDark]}
				placeholderTextColor={isDarkMode ? "gray" : "lightgray"}
				selectionColor={isDarkMode ? "white" : "black"}
				keyboardType="numeric" // Establece el tipo de teclado como numérico
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
	button: {
		backgroundColor: "blue", // Background color for the button
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	buttonDark: {
		backgroundColor: "darkblue", // Background color for the button in dark mode
	},
	buttonText: {
		color: "white", // Text color for the button
		textAlign: "center",
		fontWeight: "bold",
	},
	descriptionInput: {
		minHeight: 100, // Altura mínima del campo de descripción
		textAlignVertical: "top", // Texto se alinea desde arriba
	},
});

export default formGasto;
