"use client";
import { Basket, Minus, Plus } from "@phosphor-icons/react";
import { CartItem } from "@/types/types";
import { useStateStorage } from "@/utils/stateStorage";
//---Framework---//
import { useState } from "react";
import { usePathname } from "next/navigation";
//---Packages---//
import { useSnackbar } from "notistack";
import { lato } from "../../../app/fonts/fonts";

interface AddToCartButtonProps {
	product: CartItem;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
	const { dispatch } = useStateStorage();
	const [quantity, setQuantity] = useState(1);
	const [showQuantitySelector, setShowQuantitySelector] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const pathname = usePathname();

	const addToCartHandler = () => {
		console.log(
			`ADD TO CART HANDLER- Adding ${quantity} of ${product.name} to cart`
		);
		dispatch({
			type: "CART_ADD_ITEM",
			payload: {
				...product,
				quantity: quantity,
			},
		});
		dispatch({ type: "SHOW_CART" });
	};

	const isShopProductPage = pathname.startsWith("/shop/product");

	return (
		<div className="flex items-end justify-center md:justify-end w-full min-h-[3.5rem] lg:min-h-[3rem]">
			{isShopProductPage ? (
				<div className="flex items-center justify-center w-full gap-3">
					<div className="flex items-center mr-4">
						<button
							className={`bg-blue-400 text-white font-bold rounded-xl text-[.75rem] p-1 ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
							onClick={() => setQuantity(quantity - 1)}
							disabled={quantity <= 1}
						>
							<Minus />
						</button>
						<span className={`font-bold text-2xl mx-2 ${lato.className}`}>
							{quantity}
						</span>
						<button
							className="bg-blue-400 text-white font-bold rounded-xl text-[.75rem] p-1"
							onClick={() => {
								if (quantity < product.countInStock) {
									setQuantity(quantity + 1);
								} else {
									enqueueSnackbar(
										`We currently have only ${product.countInStock} units of ${product.name} in stock.`,
										{ variant: "warning", autoHideDuration: 3000 }
									);
								}
							}}
						>
							<Plus />
						</button>
					</div>
					<button
						className={`py-2 px-6 rounded flex items-center bg-green-500 hover:bg-green-700 text-white text-lg ${
							product.countInStock <= 0 ? "opacity-0 cursor-not-allowed" : ""
						}`}
						onClick={addToCartHandler}
						disabled={product.countInStock <= 0}
					>
						<Basket className="h-6 w-6 mr-2" />
						Add to Cart
					</button>
				</div>
			) : showQuantitySelector ? (
				<>
					<div className="flex items-center py-1 px-4">
						<button
							className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
							onClick={() => setQuantity(quantity - 1)}
							disabled={quantity <= 1}
						>
							<Minus />
						</button>
						<input
							type="text"
							className="w-12 text-center border-t border-b"
							value={quantity}
							readOnly
						/>
						<button
							className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
							onClick={() => {
								if (quantity < product.countInStock) {
									setQuantity(quantity + 1);
								} else {
									enqueueSnackbar(
										`We currently have only ${product.countInStock} units of ${product.name} in stock.`,
										{ variant: "warning", autoHideDuration: 3000 }
									);
								}
							}}
						>
							<Plus />
						</button>
					</div>
					<button
						className={`ml-2 py-1 px-4 rounded flex items-center bg-slate-200 hover:bg-green-300 ${
							product.countInStock <= 0 ? "opacity-0 cursor-not-allowed" : ""
						}`}
						onClick={addToCartHandler}
						disabled={product.countInStock <= 0}
					>
						<Basket className="h-5 w-5 mr-2" />
						Add to Cart
					</button>
				</>
			) : product.countInStock <= 0 ? (
				<button
					className={`self-end py-1 px-4 rounded flex items-center bg-slate-200 hover:bg-red-200`}
					onClick={() =>
						enqueueSnackbar(`${product.name} is currently out of stock.`, {
							variant: "warning",
							autoHideDuration: 3000,
						})
					}
				>
					Out of Stock
				</button>
			) : (
				<button
					className={`self-end py-1 px-4 rounded flex items-center bg-slate-200 hover:bg-green-300`}
					onClick={() => {
						setShowQuantitySelector(true);
					}}
				>
					<Plus className="h-5 w-5" />
				</button>
			)}
		</div>
	);
};

export default AddToCartButton;
