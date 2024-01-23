import { Stack } from "expo-router";

export default function cuadreLayout() {
	return (
		<Stack>
			<Stack.Screen name="formGasto" options={{ title: "Nuevo gasto " }} />
			<Stack.Screen name="cDiario" options={{ title: "Cuadre diario " }} />
			<Stack.Screen name="semanal" options={{ title: "Cuadre semanal " }} />
			<Stack.Screen name="showGastos" options={{ title: "Gastos " }} />
		</Stack>
	);
}
