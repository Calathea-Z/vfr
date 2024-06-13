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
	Grid,
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
		>
			<Grid container spacing={0}>
				{/* Top-left: Image */}
				<Grid
					item
					xs={12}
					md={6}
					sx={{ height: { xs: "50%", sm: "auto", maxHeight: "70%" } }}
				>
					{loading ? (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							width="100%"
							height="100%"
						>
							<ClipLoader />
						</Box>
					) : error ? (
						<Box textAlign="center" width="100%" height="100%">
							{error}
						</Box>
					) : product && product.photo && product.photo.length > 0 ? (
						<div className="border-b-black border-b-[.5px]">
							<Carousel
								infiniteLoop={true}
								useKeyboardArrows={true}
								showThumbs={false}
								showStatus={false}
								dynamicHeight={true}
								className="mx-auto max-h-[70%]"
								width={"100%"}
							>
								{product.photo.map((photo, index) => (
									<Box
										key={index}
										display="flex"
										justifyContent="center"
										alignItems="center"
										sx={{
											width: "100%",
											height: "100%",
											maxHeight: "70%",
											borderBottom: "1px solid black",
										}}
									>
										<CardMedia
											component="img"
											image={sanityImageBuilder(photo.asset._ref).url()}
											alt={product.name}
											onLoad={(e) => (e.currentTarget.style.filter = "none")}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
										/>
									</Box>
								))}
							</Carousel>
						</div>
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
				</Grid>
				{/* Top-right: Product Info */}
				<Grid item xs={12} md={6} sx={{ height: { xs: "50vh", sm: "auto" } }}>
					{product ? (
						<Card
							sx={{
								height: "100%",
								width: "100%",
								display: "flex",
								overflow: "auto",
								flexDirection: "column",
								justifyContent: "start",
								alignItems: "center",
								textAlign: "center",
								borderRadius: 0,
								background:
									"linear-gradient(to top right, rgba(255, 255, 255, 0.2), rgba(255, 165, 0, 0.2))",
								boxShadow: "none",
								borderBottom: ".5px solid black",
							}}
						>
							<CardContent sx={{ width: "100%" }}>
								<h1 className={`text-4xl mt-12 ${lato.className}`}>
									{product.name}
								</h1>
								<h2
									className={`font-bold text-2xl mt-2 ${lato.className} mb-2`}
								>
									$ {product.price}
								</h2>
								<p className={`text-xl mb-2 ${lato.className}`}>
									{product.tagLine}
								</p>
								<Box
									display="flex"
									alignItems="center"
									justifyContent="center"
									mt={2}
								>
									<span className={`text-2xl mr-2 ${lato.className}`}>
										Quantity:
									</span>
									<button
										className={`bg-blue-500 text-white font-bold rounded-xl text-[.75rem] p-1 ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
										onClick={() => handleQuantityChange(-1)}
										disabled={quantity <= 1}
									>
										<Minus />
									</button>
									<span className={`font-bold text-2xl mx-2 ${lato.className}`}>
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
										<div className="inline-flex items-center">
											<button className="bg-emerald-600 text-white text-2xl py-2 px-4 rounded cursor-pointer inline-flex items-center">
												<PlusCircle className="mr-2" />
												Add to Cart
											</button>
										</div>
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
				</Grid>
				{/* Bottom: Product Details */}
				<Grid item xs={12} sm={12}>
					<Card
						sx={{
							width: "100%",
							minHeight: "60vh",
							borderRadius: 0,
							paddingX: 3,
							paddingY: 8,
							background:
								"linear-gradient(to top left, rgba(16, 185, 129, 0.1), white)",
						}}
					>
						<CardContent>
							<Grid container spacing={4}>
								<Grid item xs={12} sm={6}>
									<h5 className="text-2xl sm:text-3xl font-bold mb-4">
										Details:
									</h5>
									<ul className="list-disc pl-5">
										{splitProductDetails().map((detail, index) => (
											<li
												key={index}
												className={`text-lg sm:text-2xl font-medium mx-2 ${lato.className}`}
											>
												{detail}
											</li>
										))}
									</ul>
								</Grid>
								<Grid item xs={12} sm={6}>
									<h5 className="text-2xl sm:text-3xl font-bold mb-4">
										Dimensions:
									</h5>
									<p className="text-slate-800 text-lg sm:text-2xl mb-8">
										{product
											? product.measurements
											: "No measurements available"}
									</p>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
};
export default ProductScreen;
