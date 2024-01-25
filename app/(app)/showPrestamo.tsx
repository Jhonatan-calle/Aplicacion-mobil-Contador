import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	ActivityIndicator,
	useColorScheme,
	FlatList,
} from "react-native";
import { router, useLocalSearchParams, Link } from "expo-router";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebaseCofig";
import { UseSession } from "../../ctx";

const Prestamos = () => {
	const [prestamos, setPrestamos] = useState<any>();
	const [loading, setLoading] = useState<boolean>(true);
	const { id } = useLocalSearchParams() as { id: string };
	const { user } = UseSession();

	const colorScheme = useColorScheme();
	const isDarkMode = true; //colorScheme === "dark";

	useEffect(() => {
		if (user) {
			setLoading(true);
			const docsRef = query(
				collection(db, "users", user, "prestamos"),
				where("cliente", "==", id),
				where("estado", "==", false),
				orderBy("fechaF")
			);
			getDocs(docsRef).then((snapShot) => {
				if (!snapShot.empty) {
					const arrayPrestamos: any[] = [];
					snapShot.forEach((doc) => {
						arrayPrestamos.push({ id: doc.id, ...doc.data() });
					});
					arrayPrestamos.sort((a, b) => {
						const dateA: any = new Date(a.fechaF);
						const dateB: any = new Date(b.ifechaF);

						return dateB - dateA;
					});
					setPrestamos(arrayPrestamos);
				}
				setLoading(false);
				return;
			});
		}
	}, [id]);

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
						Fecha prestado: {formattedDate(item.fechaI)} {"\n"}
						Fecha cancelado: {formattedDate(item.fechaF)} {"\n"}
						Monto: {item.monto} {"\n"}
					</Text>
				</View>
				<View style={styles.buttonContainer}>
					{item?.id && (
						<Link
							href={{
								pathname: "/showCuotas",
								params: { idPrestamo: item.id, idCliente: id },
							}}
							asChild
						>
							<Pressable style={styles.button}>
								<Text style={styles.buttonText}>Ver cuotas</Text>
							</Pressable>
						</Link>
					)}
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
	return <FlatList data={prestamos} renderItem={renderItem} />;
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
	buttonContainer: {
		flexDirection: "row",
		marginTop: 10,
		flexWrap: "wrap",
	},
	button: {
		marginTop: 10,
		marginRight: 10,
		padding: 10,
		backgroundColor: "#3498db",
		borderRadius: 5,
		alignSelf: "flex-start",
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		paddingHorizontal: 5,
	},
});

export default Prestamos;
