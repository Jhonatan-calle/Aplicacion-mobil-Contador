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
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../../constants/Colors";
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	increment,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../../firebaseCofig";
import { UseSession } from "../../ctx";

const Cuotas = () => {
	const [cuotas, setCuotas] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const { idPrestamo } = useLocalSearchParams() as { idPrestamo: string };
	const { user } = UseSession();

	const colorScheme = useColorScheme();
	const isDarkMode = true; //colorScheme === "dark";

	const navigation = useNavigation();
	let unSubscribeCuotas = () => {};

	useEffect(() => {
		setLoading(true);
		if (user) {
			const cuotasRef = query(
				collection(db, "users", user, "cuotas"),
				where("prestamo", "==", idPrestamo),
				orderBy("fecha")
			);
			unSubscribeCuotas = onSnapshot(cuotasRef, (snapShot) => {
				if (!snapShot.empty) {
					let cuotas: any[] = [];
					snapShot.forEach((doc) => {
						cuotas.push({ ...doc.data(), id: doc.id });
					});
					cuotas.sort((a, b) => {
						const dateA: any = new Date(a.fecha);
						const dateB: any = new Date(b.ifecha);

						return dateB - dateA;
					});
					setCuotas(cuotas);
				}
			});
		}
		setLoading(false);
	});

	navigation.addListener("beforeRemove", () => {
		unSubscribeCuotas();
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
			"¿Estás seguro de que deseas eliminar esta cuota?",
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
							const cuotaRef = doc(db, "users", user, "cuotas", id);
							deleteDoc(cuotaRef);
							const prestamoRef = doc(
								db,
								"users",
								user,
								"prestamos",
								idPrestamo
							);
							updateDoc(prestamoRef, {
								adeuda: increment(monto),
								estado: true,
							});

							setDoc(doc(db, "users", user, "diario", fecha), {
								cobrado: increment(-monto),
							});
							setDoc(doc(db, "users", user, "diario", mondayWeek(fecha)), {
								cobrado: increment(-monto),
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
	return <FlatList data={cuotas} renderItem={renderItem} />;
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

export default Cuotas;
