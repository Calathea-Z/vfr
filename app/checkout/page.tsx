"use client";
import { useEffect, useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import DeliveryAddressForm from "../components/checkout/DeliveryAddressForm";
import ContactForm from "../components/checkout/ContactForm";
import { lato } from "../fonts/fonts";
import { useStateStorage } from "../../utils/stateStorage";
import { sanityImageBuilder } from "../../utils/sanityImageBuilder";
import PaymentWithSquare from "../components/checkout/PaymentWithSquare";

const CheckoutPage = () => {
	const { state } = useStateStorage();
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);

	const handleScroll = () => {
		if (window.scrollY > 50) {
			setIsHeaderVisible(false);
		} else {
			setIsHeaderVisible(true);
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			window.addEventListener("scroll", handleScroll);
			return () => {
				window.removeEventListener("scroll", handleScroll);
			};
		}
	}, []);

	const toggleOrderSummary = () => {
		setIsOrderSummaryOpen(!isOrderSummaryOpen);
	};

	return (
		<div className={`flex flex-col min-h-screen ${lato.className}`}>
			{isHeaderVisible && (
				<div className="flex justify-center items-center h-20 bg-gradient-to-tr from-white to-slate-100 border-b border-gray-200">
					<img
						src="/assets/logos/simpleLogo.png"
						alt="Logo"
						className="h-[4rem]"
					/>
				</div>
			)}
			<div className="flex flex-1 flex-col sm:flex-row">
				<div className="flex flex-col sm:flex-1 p-5 bg-slate-200 order-1 sm:order-2">
					<div className="flex justify-between items-center p-4 border-b border-gray-300 sm:hidden">
						<button onClick={toggleOrderSummary} className="flex items-center">
							<span className="mr-2">Show order summary</span>
							{isOrderSummaryOpen ? (
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
						className={`flex flex-col gap-4 ${isOrderSummaryOpen ? "block" : "hidden"} sm:block`}
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
					</div>
				</div>
				<div className="flex flex-col sm:flex-1 order-2 sm:order-1">
					<div className="flex flex-col sm:w-full p-8">
						<h6 className="text-center mb-2 text-gray-500">Express Checkout</h6>
						<PaymentWithSquare />
						<div className="flex items-center my-4">
							<hr className="flex-grow border-t border-gray-300" />
							<span className="mx-2 text-gray-500">OR</span>
							<hr className="flex-grow border-t border-gray-300" />
						</div>
						<ContactForm />
						<hr className="my-4" />
						<DeliveryAddressForm />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutPage;
