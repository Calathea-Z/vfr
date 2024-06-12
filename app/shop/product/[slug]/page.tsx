"use client";
import client from "../../../../sanity/lib/client";
import { stateStorage } from "../../../../utils/stateStorage";
import { sanityImageBuilder } from "../../../../utils/sanityImageBuilder";
import { playfairDisplay } from "../../../fonts/fonts"; // Importing the playfair font
// import Modal from "@/components/store/Modal";
//---Framework---//
import { useEffect, useState, useContext } from "react";
import Image from "next/image";
//--Packages---//
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	Typography,
	Button,
	CardMedia,
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
	description: string;
	tagLine: string;
	measurements: string;
	shippingWeight: number;
}

interface ProductScreenProps {
	params: { slug: string };
}

const ProductScreen: React.FC<ProductScreenProps> = ({ params }) => {
	const slug = params.slug;
	console.log("params", params);
	const context = useContext(stateStorage);

	if (!context) {
		throw new Error("stateStorage context is not available");
	}

	const {
		state: { cart, isCartVisible },
		dispatch,
	} = context;

	const [state, setState] = useState<{
		product: Product | null;
		loading: boolean;
		error: string;
		quantity: number;
	}>({
		product: null,
		loading: true,
		error: "",
		quantity: 1,
	});

	const { product, loading, error, quantity } = state;
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = (image: string) => {
		setSelectedImage(image);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedImage(null);
	};

	const toggleCart = () => {
		dispatch({ type: isCartVisible ? "HIDE_CART" : "SHOW_CART" });
	};

	useEffect(() => {
		if (!slug) {
			console.log("return", slug);
			return;
		}

		const fetchData = async () => {
			try {
				console.log("Begin fetch", slug);
				const product = await client.fetch(
					`*[_type == "product" && slug.current == $slug][0]`,
					{ slug }
				);
				setState((prevState) => ({ ...prevState, product, loading: false }));
			} catch (err: any) {
				setState((prevState) => ({
					...prevState,
					error: err.message,
					loading: false,
				}));
			}
		};
		fetchData();
	}, [slug]);

	// const addToCartHandler = async () => {
	// 	if (!product) return;
	// 	const existItem = cart.cartItems.find((x: any) => x._id === product._id);
	// 	const newQuantity = existItem ? existItem.quantity + quantity : quantity;
	// 	const { data } = await axios.get(`/api/allproducts/${product._id}`);
	// 	// if (data.countInStock < newQuantity) {
	// 	// 	enqueueSnackbar("Sorry. Product is out of stock", { variant: "error" });
	// 	// 	return;
	// 	// }
	// 	toggleCart();
	// 	dispatch({
	// 		type: "CART_ADD_ITEM",
	// 		payload: {
	// 			_key: product._id,
	// 			name: product.name,
	// 			countInStock: product.countInStock,
	// 			slug: product.slug.current,
	// 			price: product.price,
	// 			photo: product.photo,
	// 			shippingWeight: product.shippingWeight,
	// 			quantity: newQuantity,
	// 		},
	// 	});
	// 	// enqueueSnackbar(`${product.name} added to cart!`, { variant: "success" });
	// };
	const splitProductDetails = () => {
		if (!product || !product.description) return [];
		return product.description
			.split(".")
			.map((sentence) => sentence.trim())
			.filter((sentence) => sentence !== "");
	};

	const handleQuantityChange = (change: number) => {
		if (!product) return;
		const newQuantity = quantity + change;
		if (newQuantity > 0 && newQuantity <= product.countInStock) {
			setState((prevState) => ({ ...prevState, quantity: newQuantity }));
		}

		// } else {
		// 	enqueueSnackbar(
		// 		`We only have ${quantity} ${product.name}s in stock at the moment!`,
		// 		{
		// 			variant: "warning",
		// 			anchorOrigin: { vertical: "top", horizontal: "right" },
		// 			style: { color: "#000000" },
		// 		}
		// 	);
		// }
	};
	return (
		<>
			<div
				className={`flex flex-col items-center justify-center min-h-screen p-4 lg:p-10 ${playfairDisplay.className}`}
			>
				{loading ? (
					<div className="flex justify-center items-center w-full">
						<ClipLoader />
					</div>
				) : error ? (
					<div className="w-full text-center">{error}</div>
				) : (
					<div className="flex flex-col items-center justify-center w-full gap-6 lg:flex-row lg:items-start lg:px-6">
						<div className="w-full flex justify-center items-center mb-4 lg:w-1/2 lg:mb-0">
							{product && product.photo && product.photo.length > 0 ? (
								<Card className="grid grid-cols-2 grid-rows-2 gap-0.5">
									{product.photo.map((photo, index) => (
										<CardMedia
											key={index}
											component="img"
											image={sanityImageBuilder(photo.asset._ref).url()}
											alt={product.name}
											className="object-cover rounded-3xl px-1 py-2 cursor-pointer"
											style={{
												maxHeight: "100%",
												maxWidth: "100%",
												width: "100%",
											}}
											onClick={() => openModal(photo.asset._ref)}
										/>
									))}
								</Card>
							) : (
								<div className="flex items-center justify-center w-full h-full bg-gray-200">
									<p className="text-gray-500">No Image Available</p>
								</div>
							)}
						</div>
						<div className="flex flex-col items-center justify-center w-full md:flex-1">
							{product ? (
								<>
									<Card className="bg-offwhite rounded-lg p-2 shadow-md mx-auto w-full">
										<CardContent>
											<Typography
												variant="h4"
												component="h1"
												className="font-bold italic"
												style={{ fontFamily: "Playfair Display, serif" }}
											>
												{product.name}
											</Typography>
											<Typography
												variant="h6"
												className="font-extrabold p-1 text-md text-emerald-800 mt-2 mb-6"
												style={{ fontFamily: "Playfair Display, serif" }}
											>
												$ {product.price}.00
											</Typography>
											<Typography
												variant="body1"
												className="text-slate-800 text-md font-bold items-center leading-loose mb-6"
												style={{ fontFamily: "Playfair Display, serif" }}
											>
												{product.tagLine}
											</Typography>
											<Typography
												variant="body2"
												className="text-slate-800 font-bold text-md mb-3"
												style={{ fontFamily: "Playfair Display, serif" }}
											>
												Size:
											</Typography>
											<Typography
												variant="body2"
												className="text-slate-800 text-sm mb-8"
												style={{ fontFamily: "Playfair Display, serif" }}
											>
												{product.measurements}
											</Typography>
											<div
												className="flex flex-col items-center justify-center"
												style={{ fontFamily: "Playfair Display, serif" }}
											>
												{product.countInStock > 0 ? (
													<>
														<div className="flex items-center mb-4 text-lg">
															<span className="mr-4">Quantity:</span>
															<div className="flex items-center">
																<Button
																	variant="contained"
																	color="primary"
																	className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center"
																	onClick={() => handleQuantityChange(-1)}
																	disabled={quantity <= 1}
																>
																	-
																</Button>
																<span className="mx-3 font-amaticSC font-bold text-3xl">
																	{quantity}
																</span>
																<Button
																	variant="contained"
																	color="primary"
																	className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center"
																	onClick={() => handleQuantityChange(1)}
																>
																	+
																</Button>
															</div>
														</div>
														<motion.div
															whileHover={{
																rotate: [0, 1, -1, 1, 0],
																transition: { duration: 0.4 },
															}}
															className="inline-block"
														>
															<Button
																variant="contained"
																color="success"
																className="bg-emerald-400/70 border-gray-800 border-0.5 rounded px-10 py-2 hover:border-blue-400 mt-4 mb-8 flex items-center justify-center gap-3 lg:px-20 lg:py-3"
																// onClick={addToCartHandler}
															>
																Add to Cart
															</Button>
														</motion.div>
													</>
												) : (
													<Button
														variant="contained"
														color="error"
														className="bg-rose-400 cursor-not-allowed border-gray-800 border-0.5 rounded px-4 py-3 mt-4 mb-8 flex items-center justify-center gap-3"
														disabled
													>
														Sold Out
													</Button>
												)}
											</div>
										</CardContent>
									</Card>
									<Card className="bg-secondary rounded-lg px-4 pt-1 mt-4 shadow-md mx-auto w-full lg:px-6">
										<CardContent>
											<Typography
												variant="h4"
												component="h1"
												className="font-bold mb-4 font-amaticSC text-lg text-stone-800"
												style={{ fontFamily: "Playfair Display, serif" }}
											>
												Details:
											</Typography>
											<ul className="list-disc pl-5">
												{splitProductDetails().map((detail, index) => (
													<li
														key={index}
														className="mb-2 font-amaticSC font-bold text-md text-stone-800"
														style={{ fontFamily: "Playfair Display, serif" }}
													>
														{detail}
													</li>
												))}
											</ul>
										</CardContent>
									</Card>
								</>
							) : (
								<div className="text-center">
									<Typography
										variant="h5"
										component="h1"
										className="text-2xl font-thin italic"
										style={{ fontFamily: "Playfair Display, serif" }}
									>
										Product not found
									</Typography>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
			{/* <Modal isOpen={isModalOpen} onClose={closeModal}>
				{selectedImage && (
					<Image
						src={sanityImageBuilder(selectedImage).url()}
						alt={`Enlarged image of ${product?.name}`}
						width={1024}
						height={768}
						layout="responsive"
					/>
				)}
			</Modal> */}
		</>
	);
};
export default ProductScreen;
