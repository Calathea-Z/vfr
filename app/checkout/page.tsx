"use client";
import { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import DeliveryAddressForm from "../components/checkout/DeliveryAddressForm";
import ContactForm from "../components/checkout/ContactForm";
import { lato } from "../fonts/fonts";
import { useStateStorage } from "../../utils/stateStorage";
import { sanityImageBuilder } from "../../utils/sanityImageBuilder";
import GooglePayComponent from "../components/checkout/GooglePay";
import ShippingRate from "../components/checkout/ShippingRate";
import CreditCardPay from "../components/checkout/CreditCardPay";
import MobileOrderSummary from "../components/checkout/MobileOrderSummary";
import { fullLogo } from "@/public/assets";

const CheckoutPage = () => {
	const { state } = useStateStorage();
	const [isTopOrderSummaryOpen, setIsTopOrderSummaryOpen] = useState(false);
	const [isBottomOrderSummaryOpen, setIsBottomOrderSummaryOpen] =
		useState(false);

	const toggleTopOrderSummary = () => {
		setIsTopOrderSummaryOpen(!isTopOrderSummaryOpen);
	};

	const toggleBottomOrderSummary = () => {
		setIsBottomOrderSummaryOpen(!isBottomOrderSummaryOpen);
	};

	return (
		<div className={`flex flex-col min-h-screen ${lato.className}`}>
			<div className="flex justify-center items-center h-26 bg-gradient-to-tr from-white to-slate-100 border-b border-gray-200 snap-start pb-2">
				<img src={fullLogo.src} alt="Logo" className="h-[6rem]" />
			</div>
			<div className="flex flex-1 flex-col sm:flex-row snap-y">
				<div className="flex flex-col sm:flex-1 p-3 bg-slate-200 order-1 sm:order-2 snap-start sm:sticky sm:top-0 sm:h-screen sm:overflow-y-auto border sm:border-none border-t-gray-500 border-b-gray-500">
					<div className="flex justify-between items-center p-4 sm:hidden">
						<button
							onClick={toggleTopOrderSummary}
							className="flex items-center"
						>
							<span className="mr-2">Show order summary</span>
							{isTopOrderSummaryOpen ? (
								<CaretUp size={24} />
							) : (
								<CaretDown size={24} />
							)}
						</button>
						<span className="text-lg font-bold">
							$
							{state.cart.cartItems
								.reduce((total, item) => total + item.price * item.quantity, 0)
								.toFixed(2)}
						</span>
					</div>
					<div
						className={`flex flex-col gap-4 ${isTopOrderSummaryOpen ? "block" : "hidden"} sm:block`}
					>
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
						<div className="hidden sm:flex items-center gap-2 p-4">
							<input
								type="text"
								placeholder="Discount code"
								className="flex-grow rounded-md p-2 border border-gray-300 text-md"
							/>
							<button className="p-2 bg-blue-500 text-white rounded-md text-md">
								Apply
							</button>
						</div>
						<div className="hidden sm:block p-4">
							<div className="flex justify-between items-center mt-1">
								<span className="text-md text-gray-500">Subtotal</span>
								<span className="text-md text-gray-500">
									$
									{state.cart.cartItems
										.reduce(
											(total, item) => total + item.price * item.quantity,
											0
										)
										.toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between items-center mt-1">
								<span className="text-md text-gray-500">Shipping</span>
								<span className="text-md text-gray-500">$15.00</span>
							</div>
							<div className="flex justify-between items-center mt-1">
								<span className="text-md text-gray-500">Estimated taxes</span>
								<span className="text-md text-gray-500">$17.79</span>
							</div>
							<div className="flex justify-between items-center font-bold mt-2 text-lg">
								<span>Total</span>
								<span>
									$
									{(
										state.cart.cartItems.reduce(
											(total, item) => total + item.price * item.quantity,
											0
										) +
										15 +
										17.79
									).toFixed(2)}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col sm:flex-1 order-2 sm:order-1 snap-start overflow-y-auto">
					<div className="flex flex-col sm:w-full p-8">
						<h6 className="text-center mb-2 text-gray-500">Express Checkout</h6>
						<GooglePayComponent />
						<div className="flex items-center my-4">
							<hr className="flex-grow border-t border-gray-300" />
							<span className="mx-2 text-gray-500">OR</span>
							<hr className="flex-grow border-t border-gray-300" />
						</div>
						<ContactForm />
						<hr className="my-4" />
						<DeliveryAddressForm />
						<MobileOrderSummary />
					</div>
				</div>
			</div>
			{/* <ShippingRate /> */}
		</div>
	);
};

export default CheckoutPage;
