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
	ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { UseSession } from "../../ctx";
import { addDoc, collection, doc, increment, setDoc } from "firebase/firestore";
import { db } from "../../firebaseCofig";

const formprestamo = () => {
	const [fechaI, setFecha] = useState<any>(new Date());
	const [monto, setMonto] = useState<number>();
	const [loading, setLoading] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const { id } = useLocalSearchParams<{ id: string }>();
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

	const handleFormSubmit = async () => {
		try {
			if (!monto) {
				Alert.alert("Campos monto obligatorio");
				return; // Stop the form submission if the mandatory field is missing
			}
			setLoading(true);
			if (user) {
				const prestamosColl = collection(db, "users", user, "prestamos");

				await addDoc(prestamosColl, {
					fechaI: formatFecha(fechaI),
					monto: monto,
					estado: true,
					cliente: id,
					adeuda: monto,
				});

				setDoc(
					doc(db, "users", user, "diario", formatFecha(fechaI)),
					{
						prestado: increment(monto),
					},
					{ merge: true }
				);
				setDoc(
					doc(db, "users", user, "semana", mondayWeek(fechaI)),
					{
						prestado: increment(monto),
					},
					{ merge: true }
				);

				setLoading(false);
				// Navigate back (assuming 'router' is from a navigation library like Next.js or React Router)
				router.back();
			}
		} catch (error) {
			// Handle errors here
			console.error("Error submitting form:", error);
			// You can also show an alert or perform other actions to notify the user
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
			<TouchableOpacity
				style={[styles.button, isDarkMode && styles.buttonDark]}
				onPress={() => {
					setShowDatePicker(!showDatePicker);
				}}
			>
				<Text style={styles.buttonText}>
					Fecha:{" "}
					{new Date(fechaI).toLocaleDateString("es-ES", {
						day: "numeric",
						month: "long",
						year: "numeric",
					})}
				</Text>
			</TouchableOpacity>

			{showDatePicker && (
				<DateTimePicker
					testID="dateTimePicker"
					value={fechaI}
					mode="date"
					is24Hour={true}
					display="default"
					onChange={handleDateChange}
				/>
			)}
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
	horizontal: {
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 10,
	},
});

export default formprestamo;
