import { UserInfo, ShippingInformation, CartItem } from "../types/types";
import { State } from "../utils/stateStorage";

export const prepareOrderData = (state: State, total: number) => {
	const { userInfo, cart } = state;
	const { shippingInformation, cartItems, shippingCost } = cart;

	return {
		orderNumber: `ORD-${new Date().toISOString().split("T")[0]}-${crypto.randomUUID()}`,
		userId: userInfo?.id || "guest",
		customer: {
			name: `${shippingInformation.firstNameShipping} ${shippingInformation.lastNameShipping}`,
			email: shippingInformation.shippingContactEmail,
			company: shippingInformation.company,
			address: {
				street: shippingInformation.address.street,
				streetTwo: shippingInformation.address.streetTwo,
				city: shippingInformation.address.city,
				state: shippingInformation.address.state,
				zipCode: shippingInformation.address.zipCode,
			},
		},
		items: cartItems.map((item: CartItem) => ({
			productId: item.productId,
			name: item.name,
			quantity: item.quantity,
			price: item.price,
		})),
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
