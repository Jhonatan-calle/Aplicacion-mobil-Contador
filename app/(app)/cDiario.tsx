import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	useColorScheme,
	FlatList,
} from "react-native";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../firebaseCofig";
import { UseSession } from "../../ctx";

const CDiario = () => {
	const [cuadres, setCuadres] = useState<any>();
	const [loading, setLoading] = useState<boolean>(true);
	const { user } = UseSession();

	const colorScheme = useColorScheme();
	const isDarkMode = true; //colorScheme === "dark";

	useEffect(() => {
		if (user) {
			setLoading(true);
			const docsRef = query(collection(db, "users", user, "diario"));
			getDocs(docsRef).then((snapShot) => {
				if (!snapShot.empty) {
					const arrayCuadres: any[] = [];
					snapShot.forEach((doc) => {
						arrayCuadres.push({ id: doc.id, ...doc.data() });
					});
					arrayCuadres.sort((a, b) => {
						// Asumiendo que 'id' es una cadena de fecha en formato YYYY-MM-DD
						const dateA: any = new Date(a.id);
						const dateB: any = new Date(b.id);

						// Compara las fechas para determinar el orden
						return dateB - dateA;
					});
					setCuadres(arrayCuadres);
				}
				setLoading(false);
				return;
			});
		}
	}, []);

	const renderItem = ({ item }: any) => {
		const formattedDate = (fecha: any) => {
			return new Date(fecha).toLocaleDateString("es-ES", {
				day: "numeric",
				month: "long",
				year: "numeric",
			});
		};
		return (
			<View
				style={[
					styles.rowItem,
					{ borderColor: isDarkMode ? "#fff" : "#000", flexDirection: "row" },
				]}
			>
				<View style={{ flex: 1 }}>
					<Text style={{ color: isDarkMode ? "#ccc" : "#000", fontSize: 18 }}>
						Fecha: {formattedDate(item.id)} {"\n"}
						Prestado: {item.prestado} {"\n"}
						Cobrado: {item.cobrado} {"\n"}
						Gastos: {item.gastos} {"\n"}
					</Text>
				</View>
			</View>
		);
	};

	if (loading) {
		return (
			<View style={[styles.container, styles.horizontal]}>
				<ActivityIndicator size="large" color="#999999" />
			</View>
		);
	}
	return <FlatList data={cuadres} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 5,
	},
	horizontal: {
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 10,
	},
	rowItem: {
		padding: 10,
		borderWidth: 1,
		borderRadius: 10,
		margin: 10,
	},
});

export default CDiario;
