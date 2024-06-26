import { sanityImageBuilder } from "../../../utils/sanityImageBuilder";
import type { Product, CartItem } from "@/types/types";
import AddToCartButton from "./AddToCartButton";
//---Framework---//
import { FC } from "react";
import Link from "next/link";
//---Packages---/
import { Card, CardContent, CardMedia, Chip } from "@mui/material";

interface ProductProps {
	product: Product;
	small?: boolean;
}
const Product: FC<ProductProps> = ({ product, small = false }) => {
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
		category: product.category,
	};

	return (
		<div
			className={`flex flex-col items-center relative ${small ? "w-[20rem]" : "w-full"}`}
		>
			<Card
				className={`w-full h-auto bg-white border border-black flex flex-col items-center justify-center p-2 shadow-none ${small ? "p-1" : "p-2"}`}
				style={{ borderRadius: 0 }}
			>
				{product.photo && product.photo.length > 0 ? (
					<Link href={`/shop/product/${slug}`}>
						<CardMedia
							component="img"
							image={sanityImageBuilder(product.photo[0].asset._ref).url()}
							alt={product.name}
							className={`object-cover rounded-2xl ${small ? "h-16" : "px-1 py-2"}`}
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
				<CardContent
					className={`w-full flex flex-col xl:flex-row justify-between gap-3 items-center ${small ? "p-1" : "p-2"}`}
				>
					<h4
						className={`font-bold ${small ? "text-xs" : "text-sm lg:text-[1.15rem]"}`}
					>
						{product.name}
					</h4>
					<p
						className={`text-slate-800 ${small ? "text-sm" : "text-xl md:ml-3"}`}
					>
						${product.price}
					</p>
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
				{!small && (
					<div className="flex items-end justify-center md:justify-end w-full min-h-[3.5rem] lg:min-h-[3rem]">
						<AddToCartButton product={cartItem} />
					</div>
				)}
			</Card>
		</div>
	);
};

export default Product;
