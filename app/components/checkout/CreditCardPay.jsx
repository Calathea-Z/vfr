"use client";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { CreditCard as CreditCardIcon } from "@phosphor-icons/react";

const CreditCardPay = ({
	appId,
	locationId,
	handlePaymentMethodClick,
	selectedPaymentMethod,
}) => {
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

	return (
		<>
			<button
				className="flex items-center justify-center w-full sm:w-1/2 h-16 border p-4 border-gray-300 rounded-md bg-blue-400"
				onClick={() => handlePaymentMethodClick("CreditCard")}
			>
				<CreditCardIcon size={32} color="#4B5563" />
				<span className="ml-2 text-lg text-stone-700">Credit Card</span>
			</button>
			{selectedPaymentMethod === "CreditCard" && (
				<PaymentForm
					applicationId={appId}
					locationId={locationId}
					cardTokenizeResponseReceived={async (token) => {
						const result = await submitPayment(token.token);
						console.log(result);
					}}
					createPaymentRequest={createPaymentRequest}
				>
					<CreditCard />
				</PaymentForm>
			)}
		</>
	);
};

export default CreditCardPay;
