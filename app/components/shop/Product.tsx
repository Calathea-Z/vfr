import { sanityImageBuilder } from "../../../utils/sanityImageBuilder";
import { stateStorage } from "../../../utils/stateStorage";
//---Packages---/
import { useContext, useState } from "react";
import Link from "next/link";
import { Basket, Minus, Plus } from "@phosphor-icons/react";
import { Card, CardContent, CardMedia, Chip } from "@mui/material";

interface Product {
	_id: string;
	name: string;
	countInStock: number;
	slug: { current: string };
	price: number;
	photo: {
		asset: {
			_ref: string;
		};
	}[];
}

interface ProductProps {
	product: Product;
	// addToCart: () => void;
}

const Product: React.FC<ProductProps> = ({ product }) => {
	const context = useContext(stateStorage);
	const [quantity, setQuantity] = useState(1);
	const [showQuantitySelector, setShowQuantitySelector] = useState(false);

	if (!context) {
		throw new Error("stateStorage context is not available");
	}

	const { dispatch } = context;

	const addToCartHandler = () => {
		dispatch({
			type: "CART_ADD_ITEM",
			payload: {
				_key: product._id,
				name: product.name,
				countInStock: product.countInStock,
				slug: product.slug.current,
				price: product.price,
				photo: product.photo,
				quantity: quantity,
			},
		});
		// Toggle cart visibility to show the cart
		dispatch({ type: "SHOW_CART" });
	};

	const slug =
		typeof product.slug === "object" ? product.slug.current : product.slug;
	return (
		<div className="flex flex-col items-center relative">
			<Card className="w-full h-auto bg-white shadow-lg border border-black flex flex-col items-center justify-center p-2">
				{product.photo && product.photo.length > 0 ? (
					<Link href={`/shop/product/${slug}`}>
						<CardMedia
							component="img"
							image={sanityImageBuilder(product.photo[0].asset._ref).url()}
							alt={product.name}
							className="object-cover rounded-3xl px-1 py-2"
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
						size="small"
						className="absolute top-2 right-2"
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
									onClick={() => setQuantity(quantity + 1)}
									disabled={quantity >= product.countInStock}
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
					) : (
						<button
							className={`self-end py-1 px-4 rounded flex items-center bg-slate-200 hover:bg-green-300 ${
								product.countInStock <= 0 ? "cursor-not-allowed" : ""
							}`}
							onClick={() => setShowQuantitySelector(true)}
							disabled={product.countInStock <= 0}
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
