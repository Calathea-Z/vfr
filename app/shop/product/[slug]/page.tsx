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
	Grid,
	Container,
	Box,
} from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

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
							height: "100%",
							width: { xs: "100%", md: "50%" }, // Ensure the Box takes 50% of the page width on medium and larger screens
						}}
					>
						{product && product.photo && product.photo.length > 0 ? (
							<Carousel
								infiniteLoop={true}
								useKeyboardArrows={true}
								showThumbs={false}
								showStatus={false}
								dynamicHeight={true}
								className="mx-auto"
								width={"100%"}
							>
								{product.photo.map((photo, index) => (
									<Box
										key={index}
										display="flex"
										justifyContent="center"
										alignItems="center"
										sx={{ width: "100%" }} // Ensure the inner Box takes full width of the parent Box
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
								<Typography color="textSecondary">
									No Image Available
								</Typography>
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
							fontFamily: playfairDisplay.className, // Apply Playfair font
						}}
					>
						{product ? (
							<Card
								sx={{
									height: "100%",
									width: "100%",
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									textAlign: "center",
								}}
							>
								<CardContent sx={{ width: "100%" }}>
									<Typography
										variant="h4"
										component="h1"
										gutterBottom
										sx={{ fontFamily: playfairDisplay.className }}
										className="italic"
									>
										{product.name}
									</Typography>
									<Typography
										variant="h5"
										color="textSecondary"
										gutterBottom
										sx={{ fontFamily: playfairDisplay.className }}
									>
										$ {product.price}.00
									</Typography>
									<Typography
										variant="body1"
										gutterBottom
										sx={{ fontFamily: playfairDisplay.className }}
									>
										{product.tagLine}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										gutterBottom
										sx={{ fontFamily: playfairDisplay.className }}
									>
										{product.description}
									</Typography>
									<Box
										display="flex"
										alignItems="center"
										justifyContent="center"
										mt={2}
									>
										<Typography variant="body2" mr={2}>
											Quantity:
										</Typography>
										<Button
											variant="contained"
											color="primary"
											onClick={() => handleQuantityChange(-1)}
											sx={{ fontFamily: playfairDisplay.className }}
											disabled={quantity <= 1}
										>
											-
										</Button>
										<Typography variant="body1" mx={2}>
											{quantity}
										</Typography>
										<Button
											variant="contained"
											color="primary"
											onClick={() => handleQuantityChange(1)}
											sx={{ fontFamily: playfairDisplay.className }}
										>
											+
										</Button>
									</Box>
									<Box mt={4} width="100%">
										{product.countInStock > 0 ? (
											<motion.div
												whileHover={{
													rotate: [0, 1, -1, 1, 0],
													transition: { duration: 0.4 },
												}}
											>
												<Button
													variant="contained"
													color="success"
													fullWidth
													// onClick={addToCartHandler}
													sx={{ fontFamily: playfairDisplay.className }}
												>
													Add to Cart
												</Button>
											</motion.div>
										) : (
											<Button
												variant="contained"
												color="error"
												fullWidth
												disabled
												sx={{ fontFamily: playfairDisplay.className }}
											>
												Sold Out
											</Button>
										)}
									</Box>
								</CardContent>
							</Card>
						) : (
							<Box textAlign="center">
								<Typography variant="h5" component="h1">
									Product not found
								</Typography>
							</Box>
						)}
					</Box>
				</>
			)}
		</Container>
	);
};
export default ProductScreen;
