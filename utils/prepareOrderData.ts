import { CartItem, OrderItem } from "../types/types";
import { State } from "../utils/stateStorage";

export const prepareOrderData = (
	state: State,
	total: number,
	userId: string
) => {
	const { userInfo, cart } = state;
	const { shippingInformation, cartItems, shippingCost } = cart;

	console.log("User Info:", userInfo);
	return {
		orderNumber: `ORD-${new Date().toISOString().split("T")[0]}-${crypto.randomUUID()}`,
		userId: userId || "guest",
		customer: {
			name: `${shippingInformation.firstNameShipping} ${shippingInformation.lastNameShipping}`,
			email: shippingInformation.shippingContactEmail,
			company: shippingInformation.company,
			address: shippingInformation.address,
		},
		items: cartItems.map(
			(item: CartItem): OrderItem => ({
				productId: item.productId,
				name: item.name,
				quantity: item.quantity,
				price: item.price,
			})
		),
		fees: {
			subtotal: cartItems.reduce(
				(acc: number, item: CartItem) => acc + item.price * item.quantity,
				0
			),
			tax:
				cartItems.reduce(
					(acc: number, item: CartItem) => acc + item.price * item.quantity,
					0
				) * 0.07,
			shipping: shippingCost || 0,
			total: total,
		},
		paymentStatus: "Completed",
		shippingStatus: "Not Shipped",
	};
};
