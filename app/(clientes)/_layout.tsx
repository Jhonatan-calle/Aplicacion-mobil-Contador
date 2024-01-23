import { Stack } from "expo-router";

export default function clientesLayout() {
	return (
		<Stack>
			<Stack.Screen name="añadir" options={{ title: "añadir" }} />
			<Stack.Screen name="formPrestamo" options={{ title: "Nuevo Prestamo" }} />
			<Stack.Screen name="formCuota" options={{ title: "Nueva Cuota" }} />
			<Stack.Screen name="aditPerfil" options={{ title: "Editar Perfil" }} />
			<Stack.Screen name="showCuotas" options={{ title: "Cuotas" }} />
		</Stack>
	);
}
