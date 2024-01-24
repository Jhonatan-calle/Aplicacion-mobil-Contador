import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	ActivityIndicator,
	Alert,
	useColorScheme,
	FlatList,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../../constants/Colors";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	increment,
	orderBy,
	query,
	setDoc,
} from "firebase/firestore";
import { db } from "../../firebaseCofig";
import { UseSession } from "../../ctx";

const ShowGastos = () => {
	const [gastos, setGastos] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const { user } = UseSession();

	const colorScheme = useColorScheme();
	const isDarkMode = true; // colorScheme === "dark";

	useEffect(() => {
		setLoading(true);
		if (user) {
			const gastosFef = query(
				collection(db, "users", user, "gastos"),
				orderBy("fecha")
			);
			getDocs(gastosFef).then((response) => {
				if (!response.empty) {
					const docsGastos: any[] = [];
					response.forEach((doc) => {
						docsGastos.push({ id: doc.id, ...doc.data() });
					});
					setGastos(docsGastos);
				}
			});
		}
		setLoading(false);
	});

	function mondayWeek(date: any) {
		const currentDate = new Date(date);
		currentDate.setHours(0, 0, 0, 0);
		const currentDayOfWeek = currentDate.getDay();
		const differenceToMonday =
			currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
		currentDate.setDate(currentDate.getDate() - differenceToMonday);
		return `${currentDate}`;
	}

	const renderItem = ({ item }: any) => {
		const formattedDate = new Date(item.fecha).toLocaleDateString("es-ES", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
		return (
			<View
				style={[
					styles.rowItem,
					{ borderColor: isDarkMode ? "#fff" : "#000", flexDirection: "row" },
				]}
			>
				<View style={{ flex: 1 }}>
					<Text style={{ color: isDarkMode ? "#ccc" : "#000", fontSize: 18 }}>
						Fecha: {formattedDate} {"\n"}
						descripcion: {item.descripcion} {"\n"}
						Monto: {item.monto} {"\n"}
					</Text>
				</View>
				<View style={styles.buttonContainer}>
					<Pressable
						onPress={() => {
							eliminar(item.id, item.monto, item.fecha);
						}}
					>
						{({ pressed }) => (
							<FontAwesome
								name="trash"
								size={30}
								color="white"
								style={{ opacity: pressed ? 0.5 : 1 }}
							/>
						)}
					</Pressable>
				</View>
			</View>
		);
	};

	const eliminar = (id: any, monto: any, fecha: any) => {
		Alert.alert(
			"Confirmar eliminación",
			"¿Estás seguro de que deseas eliminar esta gasto?",
			[
				{
					text: "Cancelar",
					style: "cancel",
					onPress: () => setLoading(false),
				},
				{
					text: "Eliminar",
					onPress: async () => {
						setLoading(true);
						if (user) {
							const gastoRef = doc(db, "users", user, "gastos", id);
							deleteDoc(gastoRef);

							setDoc(doc(db, "users", user, "diario", fecha), {
								gastos: increment(-monto),
							});
							setDoc(doc(db, "users", user, "diario", mondayWeek(fecha)), {
								gastos: increment(-monto),
							});
						}
					},
				},
			]
		);
	};

	if (loading) {
		return (
			<View style={[styles.container, styles.horizontal]}>
				<ActivityIndicator size="large" color="#999999" />
			</View>
		);
	}
	return <FlatList data={gastos} renderItem={renderItem} />;
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
});

export default ShowGastos;
