import { Stack } from "expo-router";
import { Layout } from "react-native-reanimated";

export default function appLayout() {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="cDiario"
				options={{ presentation: "modal", title: "Cuadre Diario" }}
			/>
			<Stack.Screen
				name="formCuota"
				options={{ presentation: "modal", title: "Nueva Cuota" }}
			/>
			<Stack.Screen
				name="formGasto"
				options={{ presentation: "modal", title: "Nuevo Gasto" }}
			/>
			<Stack.Screen name="formPrestamo" options={{ title: "Nuevo Prestamo" }} />
			<Stack.Screen name="perfil" options={{ title: "Perfil" }} />
			<Stack.Screen
				name="semanal"
				options={{ presentation: "modal", title: "Cuadre Semanal" }}
			/>
			<Stack.Screen
				name="showCuotas"
				options={{ presentation: "modal", title: "Cuotas" }}
			/>
			<Stack.Screen
				name="showGastos"
				options={{ presentation: "modal", title: "Gastos" }}
			/>
			<Stack.Screen
				name="showPrestamo"
				options={{ presentation: "modal", title: "Prestamos" }}
			/>
		</Stack>
	);
}
