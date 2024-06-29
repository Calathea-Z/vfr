import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./app/lib/db";
import Resend from "next-auth/providers/resend";
import User from "./app/lib/mongoModels/User";

const providers: Provider[] = [
	Google({
		profile(profile) {
			return {
				id: profile.sub,
				name: profile.name,
				email: profile.email,
				image: profile.picture,
				role: "user",
				emailVerified: profile.email_verified ? new Date() : undefined,
			};
		},
	}),
	Resend,
];

export const providerMap = providers.map((provider) => {
	if (typeof provider === "function") {
		const providerData = provider();
		return { id: providerData.id, name: providerData.name };
	} else {
		return { id: provider.id, name: provider.name };
	}
});

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: string;
			emailVerified: Date | null;
		};
	}

	interface User {
		role: string;
		emailVerified?: Date; // Added emailVerified to User interface
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: MongoDBAdapter(clientPromise),
	providers,
	session: {
		strategy: "database",
	},
	callbacks: {
		async session({ session, user }) {
			session.user.id = user.id;
			session.user.role = user.role; // Persist the role in the session
			session.user.emailVerified = user.emailVerified; // Persist emailVerified in the session
			return session;
		},
		async signIn({ user, account, profile }) {
			// Update lastLogin field
			await User.findOneAndUpdate(
				{ email: user.email },
				{ lastLogin: new Date() }
			);
			return true;
		},
	},
	pages: {
		signIn: "/user/login",
	},
});
