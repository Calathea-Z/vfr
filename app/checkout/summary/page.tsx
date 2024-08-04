"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { OrderData } from "../../../types/types";
import { ClipLoader } from "react-spinners";

const OrderSummaryPage: React.FC = () => {
	const searchParams = useSearchParams();
	const orderNumber = searchParams.get("orderNumber");
	const [orderData, setOrderData] = useState<OrderData | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (orderNumber) {
			const fetchOrderData = async () => {
				try {
					const response = await axios.get(`/api/orders/${orderNumber}`);
					setOrderData(response.data);
				} catch (error) {
					console.error("Error fetching order data:", error);
				}
			};

			fetchOrderData();
		}
	}, [orderNumber]);

	if (!orderData) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="d-flex flex-col items-center justify-center">
					<ClipLoader size={50} color={"#123abc"} loading={true} />
					<p className="text-lg text-gray-700 mt-4">
						Fetching your order details...
					</p>
				</div>
			</div>
		);
	}

	const handleContinueShopping = () => {
		router.push("/");
	};

	return (
		<div className="bg-primary h-screen p-8">
			<div className="p-8 bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
				<h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
					Thank you for your order!
				</h1>
				<p className="text-lg text-gray-600 mb-6 text-center">
					We'll send you an email with tracking information when your item
					ships.
				</p>
				<div className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-2">
						Order placed
					</h2>
					<p className="text-gray-700">OrderID: {orderData.orderNumber}</p>
				</div>
				<div className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-2">
						Shipping address
					</h2>
					<p className="text-gray-700">{orderData.customer.name}</p>
					<p className="text-gray-700">
						{orderData.customer.address.street},{" "}
						{orderData.customer.address.streetTwo &&
							`${orderData.customer.address.streetTwo}, `}
						{orderData.customer.address.city},{" "}
						{orderData.customer.address.state}{" "}
						{orderData.customer.address.zipCode}
					</p>
					<p className="text-gray-700">{orderData.customer.email}</p>
				</div>
				<div className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-2">
						Order summary
					</h2>
					{orderData.items.map((item, index) => (
						<div
							key={index}
							className="flex justify-between items-center text-gray-700 mb-1"
						>
							<p className="text-lg">
								{item.name} (x{item.quantity})
							</p>
							<p className="text-lg">
								${(item.price * item.quantity).toFixed(2)}
							</p>
						</div>
					))}
					<div className="flex justify-between items-center font-bold text-lg text-gray-800 border-t border-gray-200 pt-2 mt-2">
						<p>Subtotal</p>
						<p>${orderData.fees.subtotal.toFixed(2)}</p>
					</div>
					<div className="flex justify-between items-center text-gray-700">
						<p>Tax</p>
						<p>${orderData.fees.tax.toFixed(2)}</p>
					</div>
					<div className="flex justify-between items-center text-gray-700">
						<p>Shipping</p>
						<p>${orderData.fees.shipping.toFixed(2)}</p>
					</div>
					<div className="flex justify-between items-center font-bold text-xl text-gray-700 border-t border-gray-200 pt-2 mt-2">
						<p>Total</p>
						<p>${orderData.fees.total.toFixed(2)}</p>
					</div>
				</div>
				<div className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-2">
						Payment type
					</h2>
					<p className="text-gray-600">{orderData.paymentType}</p>
				</div>
				<button
					className="w-full py-3 bg-secondary text-black font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300"
					onClick={handleContinueShopping}
				>
					Continue Shopping
				</button>
			</div>
		</div>
	);
};

const SuspendedOrderSummaryPage: React.FC = () => {
	return (
		<Suspense fallback={<ClipLoader />}>
			<OrderSummaryPage />
		</Suspense>
	);
};

export default SuspendedOrderSummaryPage;
