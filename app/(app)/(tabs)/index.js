import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	Text,
	useColorScheme,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList from "react-native-draggable-flatlist";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { collection, doc,  onSnapshot, setDoc, getDocs, query } from "firebase/firestore";
import { auth, db } from "../../../firebaseCofig";
import { UseSession } from "../../../ctx";



export default function Home() {
	const colorScheme = useColorScheme();
	const isDarkMode = true //colorScheme === "dark";
	const [clientes, setClientes] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = UseSession();

	useEffect(()=>{
		if (user) {
			setLoading(true);
			const clientesRef = collection(db, "users", user, "clientes");
			const unSuscribe = onSnapshot(clientesRef,(querySnapshot)=>{
				const clientesArray2 =querySnapshot.docs
				.map((doc) => ({ id: doc.id, ...doc.data() }))
				.sort((a, b) => a.orderIndex - b.orderIndex);
				setClientes(clientesArray2);
				setLoading(false);
				setLoading(false);
			})
		}
	},[user])
		
	 
	
	const renderItem = ({ item, drag, isActive }) => {
		return (
			<ScaleDecorator>
				<TouchableOpacity
					onLongPress={drag}
					disabled={isActive}
					style={[
						styles.rowItem,
						{ backgroundColor: isActive ? "red" : item.backgroundColor },
						{ borderColor: isDarkMode ? "#fff" : "#000" },
					]}
					onPress={() => {
						router.push({
							pathname: "../perfil",
							params: { id: item.id },
						});
					}}
				>
					<Text style={[styles.text, { color: isDarkMode ? "#ccc" : "#000" }]}>
						{item.nombre}
					</Text>
				</TouchableOpacity>
			</ScaleDecorator>
		);
	};

	const onDragEnd = async ({ data }) => {
		setLoading(true);
	  
		try {
		  const updatePromises = data.map(async (item, index) => {
			const clientRef = doc(db, "users", user, "clientes", item.id);
			await setDoc(clientRef, { orderIndex: index }, { merge: true });
		  });
	  
		  // Esperar a que todas las actualizaciones se completen
		  await Promise.all(updatePromises);
	  
		  // Actualizar el estado después de que todas las operaciones Firestore se hayan completado
		  setClientes(data);
		  setLoading(false);
		} catch (error) {
		  console.error("Error al actualizar el orden de los clientes:", error);
		  setLoading(false);
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
		<View
			style={[
				styles.container,
				{ backgroundColor: isDarkMode ? "#000" : "#fff" },
			]}
		>
			<View style={{ flex: 1 }}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<DraggableFlatList
						data={clientes}
						renderItem={renderItem}
						keyExtractor={(item) => item.id}
						onDragEnd={onDragEnd}
					/>
				</GestureHandlerRootView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	input: {
		height: 40,
		borderWidth: 1,
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	rowItem: {
		height: 50,
		marginVertical: 5,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderRadius: 5,
	},
	text: {
		fontSize: 18,
	},
	horizontal: {
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 10,
	},
});
