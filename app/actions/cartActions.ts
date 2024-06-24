"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types/types";

export async function setCartItems(cartItems: CartItem[]) {
	cookies().set("cartItems", JSON.stringify(cartItems), { path: "/" });
}

export async function getCartItems(): Promise<CartItem[]> {
	const storedCartItems = cookies().get("cartItems")?.value;
	return storedCartItems ? JSON.parse(storedCartItems) : [];
}
