"use client";
import { useState, useEffect } from "react";
import { GooglePay, PaymentForm } from "react-square-web-payments-sdk";

const GooglePayComponent = () => {
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
				amount: "1.00",
				pending: false,
			},
		};
	};

	const submitPayment = async (token) => {
		// Implement your payment submission logic here
		console.log("Payment token received:", token);
		// Example: Send the token to your server for processing
		const response = await fetch("/api/submitPayment", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ token }),
		});
		const result = await response.json();
		return result;
	};

	if (!isClient) {
		return null;
	}

	return (
		<>
			<PaymentForm
				applicationId={appId}
				locationId={locationId}
				cardTokenizeResponseReceived={async (token) => {
					const result = await submitPayment(token.token);
					console.log(result);
				}}
				createPaymentRequest={createPaymentRequest}
			>
				<div className="max-w-[15rem] mx-auto">
					<GooglePay />
				</div>
			</PaymentForm>
		</>
	);
};

export default GooglePayComponent;
