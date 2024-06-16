import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./app/lib/db";
import Resend from "next-auth/providers/resend";

const providers: Provider[] = [Google, Resend];

export const providerMap = providers.map((provider) => {
	if (typeof provider === "function") {
		const providerData = provider();
		return { id: providerData.id, name: providerData.name };
	} else {
		return { id: provider.id, name: provider.name };
	}
});

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: MongoDBAdapter(clientPromise),
	providers,
	pages: {
		signIn: "/user/login",
	},
});
