"use client";
import { useStateStorage, CartItem } from "@/utils/stateStorage";
import { sanityImageBuilder } from "@/utils/sanityImageBuilder";
//---Framework---//
import { useEffect } from "react";
//---Components---//
import axios from "axios";
import { useSnackbar } from "notistack";
import { motion, AnimatePresence } from "framer-motion";
import { PottedPlant, X } from "@phosphor-icons/react";
import Cookies from "universal-cookie";

const Cart: React.FC = () => {
	const { state, dispatch } = useStateStorage();
	const {
		cart: { cartItems },
		isCartVisible,
	} = state;

	const { enqueueSnackbar } = useSnackbar();

	const updateCartHandler = async (item: CartItem, quantity: number) => {
		try {
			const response = await axios.get(`/api/allproducts/${item._key}`);
			const countInStock = response.data.countInStock;

			if (countInStock < quantity) {
				enqueueSnackbar("Sorry. Product is out of stock", { variant: "error" });
				return;
			}
			if (quantity === 0) {
				removeItemHandler(item);
				return;
			}
			dispatch({
				type: "CART_ADD_ITEM",
				payload: {
					...item,
					quantity: quantity,
				},
			});
			enqueueSnackbar(`Cart Updated!`, { variant: "success" });
		} catch (error) {
			enqueueSnackbar("Error updating cart", { variant: "error" });
		}
	};

	const removeItemHandler = (item: CartItem) => {
		dispatch({ type: "CART_REMOVE_ITEM", payload: item });
	};

	const closeCartHandler = () => {
		dispatch({ type: "HIDE_CART" });
	};

	useEffect(() => {
		const currentWeight = cartItems.reduce(
			(a, c) => a + (c.quantity ?? 0) * (c.shippingWeight ?? 0),
			0
		);
		dispatch({
			type: "UPDATE_SHIPPING_WEIGHT",
			payload: currentWeight,
		});
		const cookies = new Cookies();
		cookies.set("shippingWeight", JSON.stringify(currentWeight));
	}, [cartItems, dispatch]);

	return (
		<div>
			{isCartVisible && (
				<div
					id="cartContainer"
					className="fixed right-0 top-0 w-full sm:w-[30%] h-screen bg-gradient-to-tr from-white to-gray-200 z-50 rounded-lg transform transition-transform duration-1000 ease-in-out translate-x-full"
					style={{
						transform: isCartVisible ? "translateX(0)" : "translateX(100%)",
					}}
				>
					<div className="flex justify-between items-center p-3 sm:p-5 border-b border-black">
						<button
							onClick={closeCartHandler}
							className="bg-black p-2 rounded-full"
						>
							<X className="h-4 w-4 text-white" />
						</button>
						<h1 className="text-sm sm:text-2xl underline decoration-primary underline-offset-4 decoration-1">
							Cart ({cartItems.reduce((a, c) => a + c.quantity, 0)})
						</h1>
					</div>
					<div className="flex-grow overflow-y-auto mt-4 sm:mt-6 flex flex-col p-3 sm:p-5">
						<div className="flex-grow p-1 sm:p-2 bg-transparent">
							{cartItems.length === 0 ? (
								<div className="flex flex-col items-center justify-between h-full">
									<div className="p-4 text-center">
										<span className="flex items-center justify-center gap-2 text-amber-500">
											<PottedPlant className="w-10 h-10 lg:w-20 lg:h-20" />
										</span>
										<h1 className="text-sm md:text-xl text-black mt-2">
											Your cart is empty
										</h1>
									</div>
									<p className="text-md italic mt-2 text-amber-600 p-2 bg-stone-100 rounded-lg">
										..so many possibilities!
									</p>
								</div>
							) : (
								cartItems.map((item, index) => (
									<div
										className="flex justify-between items-center py-2 sm:py-4 border-b border-black"
										key={item._key || index}
									>
										<div className="flex items-center space-x-2 sm:space-x-4">
											<a href={`/shop/product/${item.slug}`}>
												<img
													src={sanityImageBuilder(item.photo[0]).url()}
													alt={item.name}
													width={60}
													height={60}
													className="rounded-md"
												/>
											</a>
											<div className="flex flex-col gap-2 sm:gap-3">
												<h2 className="text-xs sm:text-sm font-bold">
													{item.name}
												</h2>
												<div className="flex items-center gap-2 sm:gap-3">
													<div className="space-x-1 sm:space-x-2">
														<button
															onClick={() =>
																updateCartHandler(item, item.quantity - 1)
															}
															className="bg-primary rounded-full p-1 hover:bg-gray-200 text-lg sm:text-xl font-bold"
														>
															-
														</button>
														<button
															onClick={() =>
																updateCartHandler(item, item.quantity + 1)
															}
															className="bg-primary rounded-full p-1 hover:bg-gray-200 text-lg sm:text-xl font-bold"
														>
															+
														</button>
													</div>
													<p className="text-xs sm:text-sm font-serif">
														QTY: {item.quantity}
													</p>
												</div>
											</div>
										</div>
										<div className="flex flex-col items-center gap-2 sm:gap-4">
											<p className="text-sm sm:text-md font-bold">
												${item.price * item.quantity}
											</p>
											<div className="mt-auto">
												<button
													onClick={() => removeItemHandler(item)}
													className="text-red-600 text-xs rounded-lg p-1 hover:bg-slate-50"
												>
													Remove
												</button>
											</div>
										</div>
									</div>
								))
							)}
						</div>
						<div className="fixed inset-x-0 bottom-0 p-4 sm:p-6 h-1/5 bg-transparent shadow-lg">
							{cartItems.length > 0 ? (
								<div className="border-t w-full border-white">
									<div className="flex justify-between p-4 sm:p-6">
										<span className="text-md sm:text-lg font-bold">
											Subtotal
										</span>
										<span className="text-md sm:text-lg font-bold">
											${cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
										</span>
									</div>
									<div className="flex justify-between mt-2 gap-2">
										<button
											onClick={closeCartHandler}
											className="bg-white text-black px-2 sm:px-4 py-2 w-1/2 rounded"
										>
											Continue Shopping
										</button>
										<button
											onClick={closeCartHandler}
											className="bg-black text-white px-2 sm:px-4 py-2 w-1/2 rounded"
										>
											Checkout
										</button>
									</div>
								</div>
							) : (
								<div className="flex justify-center mt-4">
									<div className="p-4 rounded-md bg-white text-black">
										<button onClick={closeCartHandler}>
											Continue Shopping
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
export default Cart;
