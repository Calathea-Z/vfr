import React from "react";

interface OrderSummaryProps {
	orderNumber: string;
	shippingAddress: {
		name: string;
		street: string;
		city: string;
		state: string;
		zipCode: string;
		email: string;
	};
	items: {
		name: string;
		quantity: number;
		price: number;
	}[];
	fees: {
		subtotal: number;
		tax: number;
		shipping: number;
		total: number;
	};
	paymentType: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
	orderNumber,
	shippingAddress,
	items,
	fees,
	paymentType,
}) => {
	return (
		<div className="p-8 bg-white rounded shadow-md">
			<h1 className="text-2xl font-bold mb-4">
				Thank you for your order #{orderNumber}
			</h1>
			<p className="mb-4">
				We'll send you an email with tracking information when your item ships.
			</p>
			<div className="mb-4">
				<h2 className="text-xl font-semibold">Order placed</h2>
				<p>Order #{orderNumber}</p>
			</div>
			<div className="mb-4">
				<h2 className="text-xl font-semibold">Shipping address</h2>
				<p>{shippingAddress.name}</p>
				<p>{shippingAddress.street}</p>
				<p>
					{shippingAddress.city}, {shippingAddress.state}{" "}
					{shippingAddress.zipCode}
				</p>
				<p>{shippingAddress.email}</p>
			</div>
			<div className="mb-4">
				<h2 className="text-xl font-semibold">Order summary</h2>
				{items.map((item, index) => (
					<div key={index} className="flex justify-between">
						<p>
							{item.name} (x{item.quantity})
						</p>
						<p>${(item.price * item.quantity).toFixed(2)}</p>
					</div>
				))}
				<div className="flex justify-between font-bold">
					<p>Subtotal</p>
					<p>${fees.subtotal.toFixed(2)}</p>
				</div>
				<div className="flex justify-between">
					<p>Tax</p>
					<p>${fees.tax.toFixed(2)}</p>
				</div>
				<div className="flex justify-between">
					<p>Shipping</p>
					<p>${fees.shipping.toFixed(2)}</p>
				</div>
				<div className="flex justify-between font-bold">
					<p>Total</p>
					<p>${fees.total.toFixed(2)}</p>
				</div>
			</div>
			<div className="mb-4">
				<h2 className="text-xl font-semibold">Payment type</h2>
				<p>{paymentType}</p>
			</div>
			<button className="px-4 py-2 bg-blue-500 text-white rounded">
				Continue Shopping
			</button>
		</div>
	);
};

export default OrderSummary;
