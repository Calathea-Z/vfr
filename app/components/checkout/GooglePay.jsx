"use client";
import { useState, useEffect } from "react";
import { GooglePay, PaymentForm } from "react-square-web-payments-sdk";
import { submitPayment } from "../../actions/squarePaymentAction";

const GooglePayComponent = ({ totalAmount }) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setIsClient(true);
		}
	}, []);

	const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
	const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

	const createPaymentRequest = () => {
		return {
			countryCode: "US",
			currencyCode: "USD",
			total: {
				label: "Total",
				amount: totalAmount.toFixed(2), // Total amount without shipping rate
				pending: false,
			},
			shippingAddressRequired: false, // No shipping address required
		};
	};

	const [paymentRequest, setPaymentRequest] = useState(createPaymentRequest()); // State to store the payment request

	const handlePayment = async (token) => {
		try {
			const result = await submitPayment(token, (totalAmount * 100).toFixed(0)); // Use the converted amount
			console.log("Payment result:", result);
		} catch (error) {
			console.error("Payment error:", error);
		}
	};

	if (!isClient) {
		return null;
	}

	return (
		<PaymentForm
			applicationId={appId}
			locationId={locationId}
			cardTokenizeResponseReceived={async (token) => {
				await handlePayment(token.token);
			}}
			createPaymentRequest={() => paymentRequest} // Use the updated payment request
		>
			<div className="max-w-[15rem] mx-auto">
				<GooglePay />
			</div>
		</PaymentForm>
	);
};

export default GooglePayComponent;
