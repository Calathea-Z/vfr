"use client";
import { useEffect, useState } from "react";
import DeliveryAddressForm from "../components/checkout/DeliveryAddressForm";
import ContactForm from "../components/checkout/ContactForm";
import { useStateStorage } from "../../utils/stateStorage";
import { lato } from "../fonts/fonts";

const CheckoutPage = () => {
	const { state } = useStateStorage();
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);

	const handleScroll = () => {
		if (window.scrollY > 50) {
			setIsHeaderVisible(false);
		} else {
			setIsHeaderVisible(true);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className={`flex flex-col min-h-screen ${lato.className}`}>
			{isHeaderVisible && (
				<div className="flex justify-center items-center h-24 bg-primary border-b border-black">
					<img src="/assets/logos/simpleLogo.png" alt="Logo" className="h-20" />
				</div>
			)}
			<div className="flex flex-1">
				<div className="flex flex-1">
					<div className="w-1/3"></div>
					<div className="flex flex-col w-2/3 pr-5">
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
				<div className="flex flex-1 flex-col p-5 bg-slate-200">
					<ul>
						{state.cart.cartItems.map((item, index) => (
							<li key={index}>{item.name}</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default CheckoutPage;
