"use client";
import DeliveryAddressForm from "../components/checkout/DeliveryAddressForm";
import ContactForm from "../components/checkout/ContactForm";
import { lato } from "../fonts/fonts";
import { useStateStorage } from "../../utils/stateStorage";
import { sanityImageBuilder } from "../../utils/sanityImageBuilder";
import ShippingRate from "../components/checkout/ShippingRate";
import CreditCardPay from "../components/checkout/CreditCardPay";
import MobileOrderSummary from "../components/checkout/MobileOrderSummary";
import { fullLogo } from "@/public/assets";
//Framework
import { useState, useEffect } from "react";
//Packages
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import axios from "axios";

const CheckoutPage = () => {
	const { state, dispatch } = useStateStorage();
	const [isTopOrderSummaryOpen, setIsTopOrderSummaryOpen] = useState(false);
	const [postalCode, setPostalCode] = useState("");
	const [shippingRate, setShippingRate] = useState(0);
	const [total, setTotal] = useState(0);
	const [isContactFormFilled, setIsContactFormFilled] = useState(false);
	const [isDeliveryFormFilled, setIsDeliveryFormFilled] = useState(false);

	const toggleTopOrderSummary = () => {
		setIsTopOrderSummaryOpen(!isTopOrderSummaryOpen);
	};

	const calculateTotal = () => {
		const subtotal = state.cart.cartItems.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
		const shippingRateNumber = Number(shippingRate); // Ensure shippingRate is a number
		const taxes = subtotal * 0.07; // 7% tax rate
		const totalAmount = subtotal + shippingRateNumber + taxes;
		setTotal(parseFloat(totalAmount.toFixed(2))); // Ensure total is formatted to two decimal places
	};

	useEffect(() => {
		calculateTotal();
	}, [state.cart.cartItems, shippingRate]);

	const handlePaymentSuccess = async () => {
		try {
			const { userInfo, cart } = state;
			const { shippingInformation, cartItems, shippingCost } = cart;

			// Prepare order data
			const orderData = {
				orderNumber: `ORD-${new Date().toISOString().split("T")[0]}-${crypto.randomUUID()}`,
				userId: userInfo?.id || "guest",
				customer: {
					name: `${shippingInformation.firstNameShipping} ${shippingInformation.lastNameShipping}`,
					email: shippingInformation.shippingContactEmail,
					company: shippingInformation.company,
					address: {
						street: shippingInformation.address.street,
						streetTwo: shippingInformation.address.streetTwo,
						city: shippingInformation.address.city,
						state: shippingInformation.address.state,
						zipCode: shippingInformation.address.zipCode,
					},
				},
				items: cartItems.map((item) => ({
					productId: item.productId,
					name: item.name,
					quantity: item.quantity,
					price: item.price,
				})),
				fees: {
					subtotal: cartItems.reduce(
						(acc, item) => acc + item.price * item.quantity,
						0
					),
					tax:
						cartItems.reduce(
							(acc, item) => acc + item.price * item.quantity,
							0
						) * 0.07,
					shipping: shippingCost || 0,
					total: total,
				},
				paymentStatus: "Completed",
				shippingStatus: "Not Shipped",
			};

			console.log("Order data prepared:", orderData);

			const response = await axios.post("/api/checkout", orderData, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			console.log("API response:", response);

			if (response.status !== 201) {
				throw new Error("Failed to create order");
			}

			const newOrder = response.data;
			console.log("Order created successfully:", newOrder);

			dispatch({ type: "UPDATE_PAYMENT_SUCCESS", payload: true });
			dispatch({ type: "CART_CLEAR_ITEMS" });
		} catch (error) {
			console.error("Error processing payment:", error);
		}
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
						<span className="text-lg font-bold">${total.toFixed(2)}</span>{" "}
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
									${(item.price * item.quantity).toFixed(2)}{" "}
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
										.toFixed(2)}{" "}
									{/* Ensure subtotal is displayed as a string */}
								</span>
							</div>
							<div className="flex justify-between items-center mt-1">
								<span className="text-md text-gray-500">
									Shipping - <span className="italic">USPS Priority</span>
								</span>
								<span className="text-md text-gray-500">
									<ShippingRate
										postalCode={postalCode}
										setShippingRate={setShippingRate}
									/>
								</span>
							</div>
							<div className="flex justify-between items-center mt-1">
								<span className="text-md text-gray-500">Estimated taxes</span>
								<span className="text-md text-gray-500">
									$
									{(
										state.cart.cartItems.reduce(
											(total, item) => total + item.price * item.quantity,
											0
										) * 0.07
									).toFixed(2)}{" "}
								</span>
							</div>
							<div className="flex justify-between items-center font-bold mt-2 text-lg">
								<span>Total</span>
								<span>${total.toFixed(2)}</span>{" "}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col sm:flex-1 order-2 sm:order-1 snap-start overflow-y-auto">
					<div className="flex flex-col sm:w-full p-8">
						<ContactForm setIsContactFormFilled={setIsContactFormFilled} />
						<hr className="my-4" />
						<DeliveryAddressForm
							setPostalCode={setPostalCode}
							setIsDeliveryFormFilled={setIsDeliveryFormFilled}
						/>
						<MobileOrderSummary
							postalCode={postalCode}
							setShippingRate={setShippingRate}
						/>
						<hr className="my-4" />
						<div className="w-full">
							<CreditCardPay
								totalAmount={total}
								disabled={!isContactFormFilled || !isDeliveryFormFilled}
								onPaymentSuccess={handlePaymentSuccess}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutPage;
