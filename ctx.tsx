import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { auth } from "./firebaseCofig";

interface AuthContextType {
	LogIn: (email: string) => void;
	LogOut: () => void;
	user: string | null;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export function UseSession(): AuthContextType {
	return useContext(AuthContext) as AuthContextType;
}

export function AuthContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<string | null>(null);

	useEffect(() => {
		const checkUser = async () => {
			// Esperar a que la información del usuario esté disponible
			await auth.onAuthStateChanged((user) => {
				if (user) {
					setUser(user.email);
					router.replace("/(app)/(tabs)");
				} else {
					setUser(null);
					router.replace("/iniciarSecion");
				}
			});
		};

		checkUser();
	}, []); // Solo se ejecuta una vez al montar el componente

	return (
		<AuthContext.Provider
			value={{
				LogIn: (email) => {
					setUser(email);
				},
				LogOut: () => {
					setUser(null);
				},
				user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
