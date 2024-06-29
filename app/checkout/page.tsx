"use client";
import DeliveryAddressForm from "../components/checkout/DeliveryAddressForm";
import ContactForm from "../components/checkout/ContactForm";
import { lato } from "../fonts/fonts";
import { useStateStorage } from "../../utils/stateStorage";
import { sanityImageBuilder } from "../../utils/sanityImageBuilder";
//---Framework---//
import { useEffect, useState } from "react";

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
					<div className="flex flex-col gap-4">
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
										<h2 className="text-lg font-bold">{item.name}</h2>
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
			</div>
		</div>
	);
};

export default CheckoutPage;
