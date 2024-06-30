"use client";
import { useState, useEffect } from "react";
import {
	CreditCard,
	PaymentForm,
	GooglePay,
} from "react-square-web-payments-sdk";

const PaymentWithSquare = () => {
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setIsClient(true);
		}
	}, []);

	const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
	const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

	const handlePaymentMethodClick = (method) => {
		setSelectedPaymentMethod(method === selectedPaymentMethod ? null : method);
	};

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

	if (!isClient) {
		return null; // or a loading spinner
	}

	return (
		<div className="flex flex-col items-center w-full px-4">
			<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6 w-full">
				<button
					className="flex items-center justify-center w-full sm:w-1/2 h-16 border p-4 border-gray-300 rounded-md bg-blue-400"
					onClick={() => handlePaymentMethodClick("CreditCard")}
				>
					<CreditCardIcon size={32} color="#4B5563" />
					<span className="ml-2 text-lg text-stone-700">Credit Card</span>
				</button>
				<button
					className="flex items-center justify-center w-full sm:w-1/2 h-16 p-4 border border-gray-300 rounded-md bg-green-400"
					onClick={() => handlePaymentMethodClick("GooglePay")}
				>
					<GoogleChromeLogo size={32} color="#4B5563" />
					<span className="ml-2 text-lg text-stone-700">Google Pay</span>
				</button>
			</div>
			<PaymentForm
				applicationId={appId}
				locationId={locationId}
				cardTokenizeResponseReceived={async (token) => {
					const result = await submitPayment(token.token);
					console.log(result);
				}}
				createPaymentRequest={createPaymentRequest}
			>
				{selectedPaymentMethod === "CreditCard" && <CreditCard />}
				{selectedPaymentMethod === "GooglePay" && <GooglePay />}
			</PaymentForm>
		</div>
	);
};

export default PaymentWithSquare;
