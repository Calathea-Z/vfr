import { sanityImageBuilder } from "../../../utils/sanityImageBuilder";
import { useStateStorage } from "@/utils/stateStorage";
import type { Product, CartItem } from "@/types/types";
import AddToCartButton from "./AddToCartButton";
//---Framework---//
import { useState } from "react";
import Link from "next/link";
//---Packages---/
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

	const slug =
		typeof product.slug === "object" ? product.slug.current : product.slug;

	const cartItem: CartItem = {
		_key: product._id,
		productId: product.productId,
		name: product.name,
		countInStock: product.countInStock,
		slug: slug,
		price: product.price,
		photo: product.photo,
		shippingWeight: product.shippingWeight || 0,
		quantity: 1,
	};

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
					<AddToCartButton product={cartItem} />
				</div>
			</Card>
		</div>
	);
};

export default Product;
