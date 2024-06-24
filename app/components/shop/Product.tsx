import { sanityImageBuilder } from "../../../utils/sanityImageBuilder";
import { useStateStorage } from "@/utils/stateStorage";
import type { Product } from "@/types/types";
//---Packages---/
import { useState } from "react";
import Link from "next/link";
import { Basket, Minus, Plus } from "@phosphor-icons/react";
import { Card, CardContent, CardMedia, Chip } from "@mui/material";
import { useSnackbar } from "notistack";

interface ProductProps {
	product: Product;
}

const Product: React.FC<ProductProps> = ({ product }) => {
	const { dispatch } = useStateStorage();
	const [quantity, setQuantity] = useState(1);
	const [showQuantitySelector, setShowQuantitySelector] = useState(false);
	const { enqueueSnackbar } = useSnackbar();

	const addToCartHandler = () => {
		console.log(
			`PRODUCT COMPONENT - Adding ${quantity} of ${product.name} to cart`
		);
		dispatch({
			type: "CART_ADD_ITEM",
			payload: {
				_key: product._id,
				productId: product.productId,
				name: product.name,
				countInStock: product.countInStock,
				slug: product.slug.current,
				price: product.price,
				photo: product.photo,
				quantity: quantity,
				shippingWeight: product.shippingWeight ?? 0,
			},
		});
		dispatch({ type: "SHOW_CART" });
	};

	const slug =
		typeof product.slug === "object" ? product.slug.current : product.slug;
	return (
		<div className="flex flex-col items-center relative">
			<Card
				className="w-full h-auto bg-white border border-black flex flex-col items-center justify-center p-2 shadow-none"
				style={{ borderRadius: 0 }}
			>
				{product.photo && product.photo.length > 0 ? (
					<Link href={`/shop/product/${slug}`}>
						<CardMedia
							component="img"
							image={sanityImageBuilder(product.photo[0].asset._ref).url()}
							alt={product.name}
							className="object-cover rounded-2xl px-1 py-2"
							style={{
								maxHeight: "100%",
								maxWidth: "100%",
								width: "100%",
								filter: "blur(10px)",
							}}
							onLoad={(e) => (e.currentTarget.style.filter = "none")}
						/>
					</Link>
				) : (
					<div className="flex items-center justify-center w-full h-full">
						<p className="text-sm text-gray-500">No Image Available</p>
					</div>
				)}
				<CardContent className="w-full flex flex-col xl:flex-row justify-between gap-3 items-center p-2">
					<h4 className="font-bold text-sm lg:text-[1.15rem]">
						{product.name}
					</h4>
					<p className="text-slate-800 text-xl md:ml-3">${product.price}</p>
				</CardContent>
				{product.countInStock === 0 && (
					<Chip
						label="SOLD OUT"
						color="error"
						size="medium"
						className="absolute top-2 right-2"
						style={{ fontFamily: "Arial", fontWeight: "bold" }}
					/>
				)}
				{product.countInStock > 0 && product.countInStock < 10 && (
					<Chip
						label="LOW STOCK"
						color="warning"
						size="medium"
						className="absolute top-2 right-2"
						style={{ fontFamily: "Helvetica", fontWeight: "bold" }}
					/>
				)}
				<div className="flex items-end justify-center md:justify-end w-full min-h-[3.5rem] lg:min-h-[3rem]">
					{showQuantitySelector ? (
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
									product.countInStock <= 0
										? "opacity-0 cursor-not-allowed"
										: ""
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
			</Card>
		</div>
	);
};

export default Product;
