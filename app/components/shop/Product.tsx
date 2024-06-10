import { sanityImageBuilder } from "../../../utils/sanityImageBuilder";
import { stateStorage } from "../../../utils/stateStorage";
//---Packages---/
import { useContext } from "react";
import Link from "next/link";
import { Basket } from "@phosphor-icons/react";
import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	Button,
	Chip,
} from "@mui/material";

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
				quantity: 1,
			},
		});
		// Toggle cart visibility to show the cart
		dispatch({ type: "SHOW_CART" });
	};

	const slug =
		typeof product.slug === "object" ? product.slug.current : product.slug;

	console.log(product.name, product.countInStock);

	return (
		<div className="flex flex-col items-center relative">
			<Card className="w-full h-auto bg-white shadow-lg border border-black flex flex-col items-center justify-center p-2">
				{product.photo && product.photo.length > 0 ? (
					<Link href={`/allproducts/product/${slug}`}>
						<CardMedia
							component="img"
							image={sanityImageBuilder(product.photo[0].asset._ref).url()}
							alt={product.name}
							className="object-cover rounded-3xl px-1 py-2"
							style={{ maxHeight: "100%", maxWidth: "100%", width: "100%" }}
						/>
					</Link>
				) : (
					<div className="flex items-center justify-center w-full h-full">
						<Typography variant="body2" color="text.secondary">
							No Image Available
						</Typography>
					</div>
				)}
				<CardContent className="w-full flex justify-between gap-3 items-center p-2">
					<Typography variant="subtitle2" component="h4" className="font-bold">
						{product.name}
					</Typography>
					<Typography variant="body1" color="text.secondary">
						${product.price}
					</Typography>
				</CardContent>
				{product.countInStock === 0 && (
					<Chip
						label="SOLD OUT"
						color="error"
						size="small"
						className="absolute top-2 right-2"
					/>
				)}
				<Button
					variant="contained"
					sx={{
						bgcolor: "rgb(5 150 105)",
						"&:hover": {
							bgcolor: "rgb(5 150 120)",
						},
					}}
					className={`self-end py-1 px-2 rounded flex items-center ${
						product.countInStock <= 0 ? "opacity-0" : ""
					}`}
					onClick={addToCartHandler}
					disabled={product.countInStock <= 0}
					startIcon={<Basket className="h-5 w-5" />}
				>
					Add to Cart
				</Button>
			</Card>
		</div>
	);
};

export default Product;
