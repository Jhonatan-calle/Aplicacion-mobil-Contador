import React, { useEffect, useState } from "react";
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
import { router, Link, useNavigation } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	increment,
	onSnapshot,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import { db } from "../../firebaseCofig";
import { UseSession } from "../../ctx";

export default function Perfil() {
	const [perfil, setPerfil] = useState<any>();
	const [prestamos, setPrestamos] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const { id } = useLocalSearchParams<{ id: string }>();
	const { user } = UseSession();

	const colorScheme = useColorScheme();
	const isDarkMode = true; //colorScheme === "dark";

	const navigation = useNavigation();
	let unSubscribeCliente = () => {};
	let unSubscribePrestamos = () => {};

	function mondayWeek(date: any) {
		const currentDate = new Date(date);
		currentDate.setHours(0, 0, 0, 0);
		const currentDayOfWeek = currentDate.getDay();
		const differenceToMonday =
			currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
		currentDate.setDate(currentDate.getDate() - differenceToMonday);
		return `${currentDate}`;
	}

	useEffect(() => {
		if (user) {
			const clienteRef = doc(db, "users", user, "clientes", id);
			const prestamosRef = query(
				collection(db, "users", user, "prestamos"),
				where("cliente", "==", id),
				where("estado", "==", true)
			);

			unSubscribeCliente = onSnapshot(clienteRef, (snapshot) => {
				setPerfil({ ...snapshot.data(), id: snapshot.id });
			});

			unSubscribePrestamos = onSnapshot(prestamosRef, (snapshot) => {
				const prestamosSnap = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setPrestamos(prestamosSnap);
			});

			// Cleanup subscriptions when the component unmounts or when 'user' or 'id' change
		}
	}, [user, id]);

	navigation.addListener("beforeRemove", () => {
		unSubscribeCliente();
		unSubscribePrestamos();
	});

	const handleDeletePrestamo = (id: any) => {
		Alert.alert(
			"Confirmar eliminación",
			"¿Estás seguro de que deseas eliminar este préstamo?",
			[
				{
					text: "Cancelar",
					style: "cancel",
					onPress: () => setLoading(false), // Actualizar el estado si se cancela
				},
				{
					text: "Eliminar",
					onPress: async () => {
						try {
							setLoading(true);
							if (user) {
								const prestamoRef = doc(db, "users", user, "prestamos", id);
								const prestamo = await getDoc(prestamoRef);
								if (prestamo.exists()) {
									setDoc(
										doc(db, "users", user, "diario", prestamo.data().fechaI),
										{ prestado: increment(-prestamo.data().monto) },
										{ merge: true }
									);
									setDoc(
										doc(
											db,
											"users",
											user,
											"semana",
											mondayWeek(prestamo.data().fechaI)
										),
										{ prestado: increment(-prestamo.data().monto) },
										{ merge: true }
									);
								}
								deleteDoc(prestamoRef);

								const cuotasColl = collection(db, "users", user, "cuotas");
								const consultaCuotas = query(
									cuotasColl,
									where("prestamo", "==", id)
								);
								const cuotasSnapshot = await getDocs(consultaCuotas);

								if (!cuotasSnapshot.empty) {
									// Eliminar todas las cuotas
									const deleteCuotasPromises = cuotasSnapshot.docs.map(
										async (document) => {
											const cuotaRef = document.ref;
											deleteDoc(cuotaRef);
											const diaRef = doc(
												db,
												"users",
												user,
												"diario",
												document.data().fecha
											);
											setDoc(
												diaRef,
												{ cobrado: increment(-document.data().monto) },
												{ merge: true }
											);
											const semanaRef = doc(
												db,
												"users",
												user,
												"semana",
												mondayWeek(document.data().fecha)
											);
											setDoc(
												semanaRef,
												{ cobrado: increment(-document.data().monto) },
												{ merge: true }
											);
										}
									);

									await Promise.all(deleteCuotasPromises);
								}

								console.log(
									"El préstamo y sus cuotas han sido eliminados correctamente"
								);
							}
						} catch (error) {
							console.error("Error al eliminar préstamo y cuotas:", error);
						} finally {
							setLoading(false); // Restablecer el estado de carga
						}
					},
				},
			]
		);
	};

	const renderItem = ({ item }: any) => {
		// Función para formatear la fecha en formato día, mes y año
		const formattedDate = new Date(item.fechaI).toLocaleDateString("es-ES", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
		return (
			<View
				style={[styles.rowItem, { borderColor: isDarkMode ? "#fff" : "#000" }]}
			>
				<View style={{ flex: 1 }}>
					<Text style={{ color: isDarkMode ? "#ccc" : "#000", fontSize: 18 }}>
						Fecha: {formattedDate} {"\n"}
						Monto: {item.monto} {"\n"}
						Restante: {item.adeuda}
					</Text>
				</View>
				<View style={styles.buttonContainer}>
					{item?.id && ( // Verificación para asegurarse de que el id existe y no es undefined
						<Link
							href={{
								pathname: "/formCuota",
								params: { idPrestamo: item.id, idCliente: id }, // Se asume que perfil.id no es undefined aquí
							}}
							asChild
						>
							<Pressable style={styles.button}>
								<Text style={styles.buttonText}>Agregar Cuota</Text>
							</Pressable>
						</Link>
					)}
					{item?.id && (
						<Link
							href={{
								pathname: "/showCuotas",
								params: { idPrestamo: item.id },
							}}
							asChild
						>
							<Pressable style={styles.button}>
								<Text style={styles.buttonText}>Ver cuotas</Text>
							</Pressable>
						</Link>
					)}
					<Pressable
						style={styles.button}
						onPress={() => {
							handleDeletePrestamo(item.id);
						}}
					>
						<Text style={styles.buttonText}>Eliminar</Text>
					</Pressable>
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

	return (
		<View style={styles.container}>
			<View
				style={[styles.datos, { borderColor: isDarkMode ? "#fff" : "#000" }]}
			>
				<Text style={[styles.title, { color: isDarkMode ? "#ccc" : "#000" }]}>
					Nombre: {perfil?.nombre}
				</Text>
				<Text style={[styles.title, { color: isDarkMode ? "#ccc" : "#000" }]}>
					Dirección: {perfil?.direccion}
				</Text>
				<Text style={[styles.title, { color: isDarkMode ? "#ccc" : "#000" }]}>
					Contacto: {perfil?.contacto}
				</Text>
				<Text style={[styles.title, { color: isDarkMode ? "#ccc" : "#000" }]}>
					Descripción: {perfil?.descripcion}
				</Text>
				{perfil?.id && ( // Verificación para asegurarse de que el id existe y no es undefined
					<Link
						href={{
							pathname: "/aditPerfil",
							params: { id: perfil.id }, // Se asume que perfil.id no es undefined aquí
						}}
						asChild
					>
						<Pressable style={styles.button}>
							<Text style={styles.buttonText}>Editar</Text>
						</Pressable>
					</Link>
				)}
			</View>
			<FlatList
				style={{ marginHorizontal: 20 }}
				data={prestamos}
				renderItem={renderItem}
			/>
			{perfil?.id && (
				<>
					<Link
						href={{ pathname: "/formPrestamo", params: { id: perfil.id } }}
						asChild
					>
						<Pressable style={styles.button}>
							<Text style={styles.buttonText}>Nuevo Prestamo</Text>
						</Pressable>
					</Link>
					<Link
						href={{ pathname: "/showPrestamo", params: { id: perfil.id } }}
						asChild
					>
						<Pressable style={styles.button}>
							<Text style={styles.buttonText}>Historial</Text>
						</Pressable>
					</Link>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 5,
		flex: 1,
	},
	datos: {
		borderWidth: 1,
		borderRadius: 5,
		padding: 5,
	},
	title: {
		fontSize: 18,
		marginBottom: 10,
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
	horizontal: {
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 10,
	},
	rowItem: {
		justifyContent: "space-between",
		padding: 10,
		borderWidth: 1,
		borderRadius: 5,
		marginVertical: 10,
	},
	buttonContainer: {
		flexDirection: "row",
		marginTop: 10,
		flexWrap: "wrap",
	},
});
