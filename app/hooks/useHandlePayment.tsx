"use client";
import { prepareOrderData } from "../../utils/prepareOrderData";
import { State, Action } from "../../utils/stateStorage";
//---Packages---//
import axios from "axios";
import { Session } from "next-auth";

export const useHandlePayment = (
	state: State,
	total: number,
	dispatch: React.Dispatch<Action>,
	session: Session | null,
	onPaymentSuccess: (orderNumber: string) => void,
	onOrderCreationError: (message: string, transactionId: string) => void
) => {
	const handlePayment = async (transactionId: string) => {
		try {
			const orderData = prepareOrderData(
				state,
				total,
				session?.user?.id || "guest",
				transactionId
			);

			console.log("Order data prepared:", orderData);

			const response = await axios.post("/api/checkout", orderData, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			console.log("API response:", response);

			if (response.status !== 201) {
				throw new Error("Failed to create order in database");
			}

			const newOrder = response.data;
			console.log("Order created successfully:", newOrder);

			dispatch({ type: "UPDATE_PAYMENT_SUCCESS", payload: true });
			dispatch({ type: "CART_CLEAR_ITEMS" });

			// Call the callback with the order number
			onPaymentSuccess(newOrder.orderNumber);
		} catch (error) {
			dispatch({ type: "UPDATE_PAYMENT_SUCCESS", payload: true });
			dispatch({ type: "CART_CLEAR_ITEMS" });

			console.error("Error creating order:", error);
			let errorMessage =
				"Thank you for your payment. We've successfully received it, but encountered a technical issue during the final stages of order processing. Our team has been automatically notified and will promptly complete your order manually. You'll receive a confirmation email with your order details shortly. We apologize for any inconvenience and appreciate your patience.";

			onOrderCreationError(errorMessage, transactionId);
		}
	};

	return { handlePayment };
};
