"use client";
import { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { sanityImageBuilder } from "../../../utils/sanityImageBuilder";
import { useStateStorage } from "../../../utils/stateStorage";
import ShippingRate from "./ShippingRate";

const MobileOrderSummary = ({ postalCode }: { postalCode: string }) => {
	const { state } = useStateStorage();
	const [isBottomOrderSummaryOpen, setIsBottomOrderSummaryOpen] =
		useState(false);

	return (
		<div className="sm:hidden flex flex-col gap-4 mt-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold self-start">
					Order summary ({state.cart.cartItems.length})
				</h2>
				<button
					className="text-blue-500 flex items-center"
					onClick={() => setIsBottomOrderSummaryOpen(!isBottomOrderSummaryOpen)}
				>
					{isBottomOrderSummaryOpen ? (
						<>
							<span>Hide</span> <CaretUp size={16} className="ml-1" />
						</>
					) : (
						<>
							<span>Show</span> <CaretDown size={16} className="ml-1" />
						</>
					)}
				</button>
			</div>
			<div className="flex flex-col gap-4 mt-4">
				{isBottomOrderSummaryOpen && (
					<>
						{state.cart.cartItems.map((item, index) => (
							<div
								className="flex justify-between items-center p-4 border-b border-gray-300"
								key={item._key || index}
							>
								<div className="flex items-center space-x-4">
									<img
										src={sanityImageBuilder(item.photo[0]).url()}
										alt={item.name}
										width={80}
										height={80}
										className="rounded-md"
									/>
									<div className="flex flex-col gap-1">
										<h2 className="text-md md:text-lg font-bold">
											{item.name}
										</h2>
										<p className="text-sm text-gray-500">
											Quantity: {item.quantity}
										</p>
									</div>
								</div>
								<p className="text-lg font-bold">
									${item.price * item.quantity}
								</p>
							</div>
						))}
					</>
				)}
				<div className="flex items-center gap-2">
					<input
						type="text"
						placeholder="Discount code"
						className="flex-grow rounded-md p-2 border border-gray-300"
					/>
					<button className="p-2 bg-blue-500 text-white rounded-md">
						Apply
					</button>
				</div>
				<div className="">
					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-500">Subtotal</span>
						<span className="text-sm text-gray-500">
							$
							{state.cart.cartItems
								.reduce((total, item) => total + item.price * item.quantity, 0)
								.toFixed(2)}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-500">Shipping</span>
						<ShippingRate postalCode={postalCode} />
					</div>
					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-500">Estimated taxes</span>
						<span className="text-sm text-gray-500">
							$
							{(
								state.cart.cartItems.reduce(
									(total, item) => total + item.price * item.quantity,
									0
								) * 0.07
							).toFixed(2)}
						</span>
					</div>
					<div className="flex justify-between items-center font-bold">
						<span>Total</span>
						<span>
							$
							{(
								state.cart.cartItems.reduce(
									(total, item) => total + item.price * item.quantity,
									0
								) +
								15 +
								state.cart.cartItems.reduce(
									(total, item) => total + item.price * item.quantity,
									0
								) *
									0.07
							).toFixed(2)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MobileOrderSummary;
