"use client";
import { useState, useEffect } from "react";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { useStateStorage } from "../../../utils/stateStorage";
import { submitPayment } from "../../actions/squarePaymentAction";

const CreditCardPay = ({ totalAmount }) => {
	const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
	const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setIsClient(true);
		}
	}, []);

	if (!isClient) {
		return null;
	}

	const handlePayment = async (token) => {
		try {
			const amount = totalAmount * 100; // Convert to cents

			const result = await submitPayment(token.token, amount);
			console.log(result);
		} catch (error) {
			console.error("Error processing payment:", error);
		}
	};

	return (
		<PaymentForm
			applicationId={appId}
			locationId={locationId}
			cardTokenizeResponseReceived={handlePayment} // This prop receives the token
		>
			<div>
				<h1 className="text-2xl font-bold self-start">Payment</h1>
				<p className="text-sm text-gray-500 mb-4">
					All transactions are secure and encrypted
				</p>
				<CreditCard
					buttonProps={{
						css: {
							"[data-theme='dark'] &": {
								backgroundColor: "#61dafb",
								color: "var(--ifm-color-emphasis-100)",
								"&:hover": {
									backgroundColor: "#0091ea",
								},
							},
							backgroundColor: "#f2c88c",
							fontSize: "14px",
							color: "#fff",
							"&:hover": {
								backgroundColor: "#d1a06b",
							},
						},
					}}
					style={{
						input: {
							fontSize: "14px",
						},
						"input::placeholder": {
							color: "#781520",
						},
					}}
				/>
			</div>
		</PaymentForm>
	);
};

export default CreditCardPay;
