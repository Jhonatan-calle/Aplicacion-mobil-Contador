import React, { useEffect, useState } from "react";
import {
	Pressable,
	StyleSheet,
	Text,
	View,
	useColorScheme,
} from "react-native";
import { Link, router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseCofig";
import { UseSession } from "../../ctx";

export default function cuadre() {
	const colorScheme = useColorScheme();
	const { user } = UseSession();
	const [cash, setCash] = useState(0);

	useEffect(() => {
		const fetchDebts = async () => {
			if (user) {
				try {
					const querySnapshot = await getDocs(
						query(
							collection(db, "users", user, "prestamos"),
							where("estado", "==", true)
						)
					);

					let totalDebt = 0;

					querySnapshot.forEach((prestamo) => {
						totalDebt += prestamo.data().adeuda;
					});

					setCash(totalDebt);
				} catch (error) {
					console.error("Error fetching debts:", error);
				}
			}
		};

		fetchDebts();
	}, [user]);
	const isDarkMode = true; //colorScheme === "dark";
	return (
		<View style={styles.container}>
			<Pressable
				style={styles.button}
				onPress={() => {
					router.push("/(cuadre)/cDiario");
				}}
			>
				<Text
					style={[styles.buttonText, { color: isDarkMode ? "#ccc" : "#000" }]}
				>
					Día
				</Text>
			</Pressable>
			<Link href="../(cuadre)/semanal" asChild>
				<Pressable style={styles.button}>
					<Text
						style={[styles.buttonText, { color: isDarkMode ? "#ccc" : "#000" }]}
					>
						Semana
					</Text>
				</Pressable>
			</Link>
			<Link href="../(cuadre)/showGastos" asChild>
				<Pressable style={styles.button}>
					<Text
						style={[styles.buttonText, { color: isDarkMode ? "#ccc" : "#000" }]}
					>
						Ver gastos
					</Text>
				</Pressable>
			</Link>
			<Link href="../(cuadre)/formGasto" asChild>
				<Pressable style={styles.button}>
					<Text
						style={[styles.buttonText, { color: isDarkMode ? "#ccc" : "#000" }]}
					>
						Añadir gasto
					</Text>
				</Pressable>
			</Link>
			<Text
				style={{
					position: "absolute",
					bottom: 10,
					right: 10,
					color: isDarkMode ? "#ccc" : "#000",
				}}
			>
				Plata en la calle: {cash}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		marginVertical: 8,
	},
	buttonText: {
		fontSize: 18,
		textAlign: "center",
	},
});
