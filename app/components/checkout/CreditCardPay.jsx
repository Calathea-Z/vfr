"use client";
import { submitPayment } from "../../actions/squarePaymentAction";
//Framework
import { useState, useEffect } from "react";
//Packages
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";

const CreditCardPay = ({
	totalAmount,
	disabled,
	onPaymentSuccess,
	onPaymentError,
}) => {
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
			const amount = totalAmount * 100;
			const result = await submitPayment(token.token, amount);
			console.log("Payment result:", result);

			if (result.payment.status === "COMPLETED") {
				onPaymentSuccess(result.payment.id); // Pass the transaction ID
			} else {
				const errorMessage = `Payment not completed. Status: ${result.payment.status}`;
				console.log(errorMessage);
				onPaymentError(errorMessage);
			}
		} catch (error) {
			console.error("Error processing payment:", error);
			onPaymentError(
				"There was an error processing your payment. Please try again."
			);
		}
	};

	if (disabled) {
		return (
			<div className="flex justify-center items-center h-full">
				<div className="bg-gray-100 rounded-lg p-4">
					<p className="text-center text-gray-500 font-bold">
						Please fill out Delivery Address and Contact Information before
						payment is taken.
					</p>
				</div>
			</div>
		);
	}

	return (
		<PaymentForm
			applicationId={appId}
			locationId={locationId}
			cardTokenizeResponseReceived={handlePayment}
		>
			<div>
				<h1 className="text-2xl font-bold text-left">Payment</h1>
				<p className="text-sm text-gray-500 mb-4 text-left">
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
							fontSize: "20px",
							color: "#fff",
							"&:hover": {
								backgroundColor: "#d1a06b",
							},
						},
					}}
					style={{
						input: {
							fontSize: "20px",
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
