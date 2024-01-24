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
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	increment,
	setDoc,
} from "firebase/firestore";
import { UseSession } from "../../ctx";
import { db } from "../../firebaseCofig";

const formCuota = () => {
	const [fechaI, setFecha] = useState<any>(new Date());
	const [monto, setMonto] = useState<number>();
	const [showDatePicker, setShowDatePicker] = useState(false);
	const { idPrestamo, idCliente } = useLocalSearchParams() as {
		idPrestamo: string;
		idCliente: string;
	};
	const { user } = UseSession();

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

	const colorScheme = useColorScheme();
	const isDarkMode = true; //colorScheme === "dark";

	const handleDateChange = (event: any, selectedDate: any) => {
		setShowDatePicker(false);
		if (selectedDate) {
			setFecha(selectedDate);
		}
	};

	const handleFormSubmit = async () => {
		try {
			if (!monto) {
				Alert.alert("Campo monto es obligatorio");
				return;
			}

			if (user) {
				const prestamoRef = doc(db, "users", user, "prestamos", idPrestamo);
				const prestamoSnap = await getDoc(prestamoRef);

				if (prestamoSnap.exists()) {
					const prestamo = prestamoSnap.data();

					if (prestamo.adeuda - monto < 0) {
						Alert.alert("El monto de la cuota supera lo adeudado");
						return;
					}

					await addDoc(collection(db, "users", user, "cuotas"), {
						fecha: formatFecha(fechaI),
						monto: monto,
						cliente: idCliente,
						prestamo: idPrestamo,
					});

					await setDoc(
						doc(db, "users", user, "diario", formatFecha(fechaI)),
						{
							cobrado: increment(monto),
						},
						{ merge: true }
					);
					await setDoc(
						doc(db, "users", user, "semana", mondayWeek(fechaI)),
						{
							cobrado: increment(monto),
						},
						{ merge: true }
					);

					if (prestamo.adeuda - monto === 0) {
						await setDoc(
							prestamoRef,
							{ adeuda: 0, estado: false, fechaF: fechaI.toISOString() },
							{ merge: true }
						);
					} else {
						await setDoc(
							prestamoRef,
							{ adeuda: prestamo.adeuda - monto },
							{ merge: true }
						);
					}

					router.back();
				} else {
					console.error("Prestamo not found");
				}
			}
		} catch (error) {
			console.error("Error in handleFormSubmit:", error);
			// Handle the error as needed
			Alert.alert("Error al procesar la cuota");
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
});

export default formCuota;
