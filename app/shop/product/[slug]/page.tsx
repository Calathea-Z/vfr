"use client";
import client from "../../../../sanity/lib/client";
import { stateStorage } from "../../../../utils/stateStorage";
import { sanityImageBuilder } from "../../../../utils/sanityImageBuilder";
import { playfairDisplay, lato } from "../../../fonts/fonts"; // Importing the playfair font
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
	Container,
	Box,
} from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Plus, Minus, PlusCircle } from "@phosphor-icons/react";

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
			return;
		}

		const fetchData = async () => {
			try {
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
	};

	return (
		<Container
			maxWidth={false}
			disableGutters
			className={playfairDisplay.className}
			sx={{
				display: "flex",
				height: "100vh",
				flexDirection: { xs: "column", md: "row" },
			}}
		>
			{loading ? (
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					width="100%"
				>
					<ClipLoader />
				</Box>
			) : error ? (
				<Box textAlign="center" width="100%">
					{error}
				</Box>
			) : (
				<>
					<Box
						sx={{
							flex: 1,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							overflow: "hidden",
							height: "100vh", // Ensure the Box takes full height of the viewport
							width: { xs: "100%", md: "50%" },
						}}
					>
						{product && product.photo && product.photo.length > 0 ? (
							<Carousel
								infiniteLoop={true}
								useKeyboardArrows={true}
								showThumbs={false}
								showStatus={false}
								dynamicHeight={true}
								className="mx-auto h-full"
								width={"100%"}
							>
								{product.photo.map((photo, index) => (
									<Box
										key={index}
										display="flex"
										justifyContent="center"
										alignItems="center"
										sx={{ width: "100%", height: "100%" }} // Ensure the inner Box takes full width and height of the parent Box
									>
										<CardMedia
											component="img"
											image={sanityImageBuilder(photo.asset._ref).url()}
											alt={product.name}
											onLoad={(e) => (e.currentTarget.style.filter = "none")}
											style={{ width: "100%", height: "100%" }}
										/>
									</Box>
								))}
							</Carousel>
						) : (
							<Box
								display="flex"
								justifyContent="center"
								alignItems="center"
								height="100%"
								bgcolor="gray.200"
								sx={{ width: "100%" }}
							>
								<p className="text-gray-500">No Image Available</p>
							</Box>
						)}
					</Box>
					<Box
						sx={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							overflow: "auto",
							width: { xs: "100%", md: "50%" },
							height: "100vh", // Ensure the Box takes full height of the viewport
						}}
					>
						{product ? (
							<Card
								sx={{
									height: "100%",
									width: "100%",
									display: "flex",
									flexDirection: "column",
									justifyContent: "start",
									alignItems: "center",
									textAlign: "center",
									background:
										"linear-gradient(to top right, rgba(255, 255, 255, 0.2), rgba(255, 165, 0, 0.2))", // Very light whitish towards the bottom left to the lighter orange at the top right
								}}
							>
								<CardContent sx={{ width: "100%" }}>
									<h1 className={`text-4xl mt-12 ${lato.className}`}>
										{product.name}
									</h1>
									<h2 className={`font-bold ${lato.className} mb-2`}>
										${product.price}.00
									</h2>
									<p className={`text-base mb-2 ${lato.className}`}>
										{product.tagLine}
									</p>
									<Box
										display="flex"
										alignItems="center"
										justifyContent="center"
										mt={2}
									>
										<span className={`text-sm mr-2 ${lato.className}`}>
											Quantity:
										</span>
										<button
											className={`bg-blue-500 text-white font-bold rounded-xl text-xs p-1 ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
											onClick={() => handleQuantityChange(-1)}
											disabled={quantity <= 1}
										>
											<Minus />
										</button>
										<span
											className={`text-lg font-bold mx-2 ${lato.className}`}
										>
											{quantity}
										</span>
										<button
											className="bg-blue-500 text-white font-bold rounded-xl text-[.75rem] p-1"
											onClick={() => handleQuantityChange(1)}
										>
											<Plus />
										</button>
									</Box>
									<Box mt={4} width="100%">
										{product.countInStock > 0 ? (
											<motion.div
												whileHover={{
													rotate: [0, 1, -1, 1, 0],
													transition: { duration: 0.4 },
												}}
												className="inline-flex items-center"
											>
												<button className="bg-emerald-600 text-white text-sm py-2 px-4 rounded cursor-pointer inline-flex items-center">
													<PlusCircle className="mr-2" />
													Add to Cart
												</button>
											</motion.div>
										) : (
											<button
												className="bg-red-600 text-white text-sm py-2 px-4 rounded cursor-not-allowed inline-flex items-center"
												disabled
											>
												Sold Out
											</button>
										)}
									</Box>
								</CardContent>
							</Card>
						) : (
							<Box textAlign="center">
								<h1 className="text-2xl font-bold">Product not found</h1>
							</Box>
						)}
					</Box>
				</>
			)}
		</Container>
	);
};
export default ProductScreen;
