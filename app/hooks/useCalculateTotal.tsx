import { useMemo } from "react";
import { CartItem } from "../../types/types";

export const useCalculateTotal = (
	cartItems: CartItem[],
	shippingRate: number
) => {
	return useMemo(() => {
		const subtotal = cartItems.reduce(
			(total: number, item: CartItem) => total + item.price * item.quantity,
			0
		);
		const shippingRateNumber = Number(shippingRate); // Ensure shippingRate is a number
		const taxes = subtotal * 0.07; // 7% tax rate
		const totalAmount = subtotal + shippingRateNumber + taxes;
		return parseFloat(totalAmount.toFixed(2)); // Ensure total is formatted to two decimal places
	}, [cartItems, shippingRate]);
};
