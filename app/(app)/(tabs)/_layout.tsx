import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, Link } from "expo-router";
import { useColorScheme, Pressable } from "react-native";
import Colors from "../../../constants/Colors";
import { auth } from "../../../firebaseCofig";

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayOut() {
	const colorScheme = "dark"; // useColorScheme();
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Clientes",
					tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
					headerRight: () => (
						<Link href="../añadir" asChild>
							<Pressable>
								{({ pressed }) => (
									<FontAwesome
										name="plus"
										size={25}
										color={Colors[colorScheme ?? "light"].text}
										style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
									/>
								)}
							</Pressable>
						</Link>
					),
				}}
			/>
			<Tabs.Screen
				name="cuadre"
				options={{
					title: "Cuadre",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="calculator" color={color} />
					),
					headerRight: () => (
						<Pressable
							onPress={() => {
								auth.signOut();
							}}
						>
							{({ pressed }) => (
								<FontAwesome
									name="sign-out"
									size={25}
									color={Colors[colorScheme ?? "light"].text}
									style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
								/>
							)}
						</Pressable>
					),
				}}
			/>
		</Tabs>
	);
}
