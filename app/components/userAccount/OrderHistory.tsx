"use client";
import { FC, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { OrderData, OrderItem } from "@/types/types";

interface Order extends OrderData {
	showDetails?: boolean;
	createdAt?: string;
}

const OrderHistory: FC = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { data: session } = useSession();

	useEffect(() => {
		const fetchOrders = async () => {
			if (!session) {
				setLoading(false);
				return;
			}

			try {
				const response = await axios.get(
					`/api/order-history/${session.user.id}`
				);
				setOrders(response.data);
			} catch (err) {
				setError("Failed to fetch orders. Please try again later.");
				console.error("Error fetching orders:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [session]);

	const toggleOrderDetails = (index: number) => {
		const newOrders = [...orders];
		newOrders[index].showDetails = !newOrders[index].showDetails;
		setOrders(newOrders);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-full">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return <p className="text-red-500">{error}</p>;
	}

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Order History</h2>
			{orders.length === 0 ? (
				<p className="text-gray-600">You haven't placed any orders yet!</p>
			) : (
				<div className="space-y-4">
					{orders.map((order, index) => (
						<div
							key={order.orderNumber}
							className="bg-white shadow-md rounded-lg overflow-hidden"
						>
							<div className="p-4">
								<div className="flex justify-between items-center mb-2">
									<p className="text-sm sm:text-large ">
										{order.createdAt
											? new Date(order.createdAt).toLocaleDateString()
											: "Unknown date"}
									</p>
									<p className="text-sm sm:text-base  font-bold">
										${order.fees.total.toFixed(2)}
									</p>
								</div>
								<div className="flex space-x-2 mb-2">
									<span
										className={`text-xs sm:text-base  px-2 py-1 rounded-full ${
											order.paymentStatus.toLowerCase() === "completed"
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{order.paymentStatus.toLowerCase() === "completed"
											? "Paid"
											: order.paymentStatus}
									</span>
									<span
										className={`text-xs sm:text-base px-2 py-1 rounded-full ${
											order.shippingStatus.toLowerCase() === "shipped"
												? "bg-green-100 text-green-800"
												: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{order.shippingStatus}
									</span>
								</div>
								<p className="text-xs sm:text-base text-gray-800 truncate mb-2 font-bold">
									{order.orderNumber}
								</p>
								<button
									className="w-full text-sm border border-blue-500 text-blue-500 rounded-full px-4 py-1 hover:bg-blue-500 hover:text-white transition"
									onClick={() => toggleOrderDetails(index)}
								>
									{order.showDetails ? "Hide Details" : "Show Details"}
								</button>
							</div>
							{order.showDetails && (
								<div className="border-t border-gray-200">
									<div className="p-2 mb-1">
										<p className="font-bold mb-2">Items:</p>
										<ul className="divide-y divide-gray-200">
											{order.items.map((item: OrderItem, idx) => (
												<li
													key={idx}
													className={`p2 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
												>
													<div className="flex justify-between items-center">
														<div className="flex items-center space-x-2">
															<span className="text-xs sm:text-base bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
																{item.quantity}
															</span>
															<span className="text-sm">{item.name}</span>
														</div>
														<span className="text-sm font-medium">
															${(item.price * item.quantity).toFixed(2)}
														</span>
													</div>
												</li>
											))}
										</ul>
									</div>
									<div className="bg-gray-50 p-4 space-y-1">
										<p className="flex justify-between text-sm">
											<span>Subtotal:</span>
											<span>${order.fees.subtotal.toFixed(2)}</span>
										</p>
										<p className="flex justify-between text-sm">
											<span>Shipping:</span>
											<span>${order.fees.shipping.toFixed(2)}</span>
										</p>
										<p className="flex justify-between text-sm">
											<span>Tax:</span>
											<span>${order.fees.tax.toFixed(2)}</span>
										</p>
										<p className="flex justify-between text-sm font-bold">
											<span>Total:</span>
											<span>${order.fees.total.toFixed(2)}</span>
										</p>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
export default OrderHistory;
