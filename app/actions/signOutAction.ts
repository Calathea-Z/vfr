"use server";

import { signOut } from "@/nextAuth";

export async function handleSignOut() {
	await signOut();
}
