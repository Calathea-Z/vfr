"use client";
import { useStateStorage, CartItem } from "@/utils/stateStorage";
import { sanityImageBuilder } from "@/utils/sanityImageBuilder";
//---Framework---//
import { useEffect } from "react";
//---Components---//
import axios from "axios";
import { useSnackbar } from "notistack";
import { PottedPlant, X, PlusCircle, MinusCircle } from "@phosphor-icons/react";
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
					className={`fixed right-0 ${state.isTopBannerVisible ? "top-[8.5rem] sm:top-[3.14rem]" : "top-[5.2rem] sm:top-0"} w-full sm:w-[50%] h-[84%] xs:h-[86%] sm:h-[96%] bg-blue-400 z-[10000] transform transition-transform duration-1000 ease-in-out flex flex-col`}
				>
					{/* Cart Header */}
					<div className="hidden sm:flex justify-between items-center p-4 border-b border-black bg-white flex-shrink-0">
						<button onClick={closeCartHandler} className="">
							<X
								className={`${state.isTopBannerVisible ? "h-[3.35rem] w-[3.35rem]" : "h-[3.4rem] w-[3.4rem]"} lg:h-[4.6rem] lg:w-[4.6rem] text-black hover:bg-gray-200 rounded-full p-2`}
							/>
						</button>
						<h1 className="text-sm sm:text-2xl underline decoration-primary underline-offset-4 decoration-1">
							Cart ({cartItems.reduce((a, c) => a + c.quantity, 0)})
						</h1>
					</div>
					{/* Cart Body */}
					<div
						id="cart-body"
						className="flex overflow-y-auto flex-col bg-white flex-grow"
					>
						{cartItems.length === 0 ? (
							<div className="flex flex-col items-center justify-between h-full">
								<div className="p-8 mt-2 text-center">
									<span className="flex items-center justify-center gap-2 text-emerald-400">
										<PottedPlant className="w-16 h-16 lg:w-20 lg:h-20" />
									</span>
									<h1 className="text-2xl md:text-3xl text-black mt-2">
										Your cart is empty..
									</h1>
								</div>
							</div>
						) : (
							cartItems.map((item, index) => (
								<div
									className="flex justify-between items-center p-8 border-b border-gray-300"
									key={item._key || index}
								>
									<div className="flex items-center space-x-4 sm:space-x-6">
										<a href={`/shop/product/${item.slug}`}>
											<img
												src={sanityImageBuilder(item.photo[0]).url()}
												alt={item.name}
												width={80}
												height={80}
												className="rounded-md"
											/>
										</a>
										<div className="flex flex-col gap-1 sm:gap-2">
											<h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-3xl font-bold">
												{item.name}
											</h2>
											<div className="flex items-center gap-2 sm:gap-3">
												<div className="flex items-center space-x-1 sm:space-x-2">
													<button
														onClick={() =>
															updateCartHandler(item, item.quantity - 1)
														}
														className="rounded-full p-1 hover:bg-emerald-200 text-lg sm:text-xl font-bold flex items-center justify-center"
													>
														<MinusCircle className="w-8 h-8" />
													</button>
													<p className="text-2xl sm:text-4xl font-serif">
														{item.quantity}
													</p>
													<button
														onClick={() =>
															updateCartHandler(item, item.quantity + 1)
														}
														className="rounded-full p-1 hover:bg-emerald-200 text-lg sm:text-xl font-bold flex items-center justify-center"
													>
														<PlusCircle className="w-8 h-8" />
													</button>
												</div>
											</div>
										</div>
									</div>
									<div className="flex flex-col items-end gap-2 sm:gap-4">
										<p className="text-lg md:text-2xl font-bold">
											${item.price * item.quantity}
										</p>
										<button
											onClick={() => removeItemHandler(item)}
											className="text-red-600 text-base md:text-md rounded-lg p-1 hover:bg-gray-100"
										>
											Remove
										</button>
									</div>
								</div>
							))
						)}
					</div>
					{/* Cart Checkout Buttons */}
					<div
						id="cart-checkout-buttons"
						className="bg-white shadow-lg flex-shrink-0 p-4"
					>
						{cartItems.length > 0 ? (
							<div className="border-t w-full border-gray-300">
								<div className="flex justify-between p-4 sm:p-6">
									<span className="text-md sm:text-lg font-bold">Subtotal</span>
									<span className="text-md sm:text-lg font-bold">
										${cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
									</span>
								</div>
								<div className="flex justify-between mt-2 gap-2">
									<button
										onClick={closeCartHandler}
										className="bg-emerald-400 text-black px-2 sm:px-4 py-4 w-1/2 rounded"
									>
										Continue Shopping
									</button>
									<button
										onClick={closeCartHandler}
										className="bg-black text-white px-2 sm:px-4 py-4 w-1/2 rounded"
									>
										Checkout
									</button>
								</div>
							</div>
						) : (
							<div className="border-t xs:w-full border-gray-300">
								<div className="flex justify-center pt-8">
									<button
										onClick={closeCartHandler}
										className="bg-emerald-400 text-black px-2 sm:px-4 py-4 w-1/2 rounded"
									>
										Continue Shopping
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Cart;