import { prepareOrderData } from "../../utils/prepareOrderData";
import { State, Action } from "../../utils/stateStorage";
//---Packages---//
import axios from "axios";

interface Dispatch {
	(action: { type: string; payload?: any }): void;
}

export const useHandlePayment = (
	state: State,
	total: number,
	dispatch: React.Dispatch<Action>
) => {
	const handlePaymentSuccess = async () => {
		try {
			const orderData = prepareOrderData(state, total);

			console.log("Order data prepared:", orderData);

			const response = await axios.post("/api/checkout", orderData, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			console.log("API response:", response);

			if (response.status !== 201) {
				throw new Error("Failed to create order");
			}

			const newOrder = response.data;
			console.log("Order created successfully:", newOrder);

			dispatch({ type: "UPDATE_PAYMENT_SUCCESS", payload: true });
			dispatch({ type: "CART_CLEAR_ITEMS" });
		} catch (error) {
			console.error("Error processing payment:", error);
			dispatch({ type: "UPDATE_PAYMENT_SUCCESS", payload: false });
		}
	};

	return { handlePaymentSuccess };
};
