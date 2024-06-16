import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";

const providers: Provider[] = [
	Google,
	Credentials({
		credentials: { password: { label: "Password", type: "password" } },
		authorize(c) {
			if (c.password !== "password") return null;
			return {
				id: "test",
				name: "Test User",
				email: "test@example.com",
			};
		},
	}),
];

export const providerMap = providers.map((provider) => {
	if (typeof provider === "function") {
		const providerData = provider();
		return { id: providerData.id, name: providerData.name };
	} else {
		return { id: provider.id, name: provider.name };
	}
});

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers,
	pages: {
		signIn: "/user/login",
	},
});
