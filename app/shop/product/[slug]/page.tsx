"use client";
import client from "../../../../sanity/lib/client";
import { stateStorage } from "../../../../utils/stateStorage";
import { sanityImageBuilder } from "../../../../utils/sanityImageBuilder";
import { playfairDisplay, lato } from "../../../fonts/fonts";
import { Product, CartItem } from "@/types/types";
//---Framework---//
import { useEffect, useState, useContext } from "react";
//--Packages---//
import {
	Card,
	CardContent,
	Grid,
	CardMedia,
	Container,
	Box,
	CircularProgress,
} from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import AddToCartButton from "../../../components/shop/AddToCartButton";

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
				const response = await fetch(`/api/products/${slug}`);
				if (!response.ok) {
					throw new Error("Product not found");
				}
				const product = await response.json();
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

	const cartItem: CartItem = {
		_key: product?._id || "",
		productId: product?.productId || "",
		name: product?.name || "",
		countInStock: product?.countInStock || 0,
		slug: slug,
		price: product?.price || 0,
		photo: product?.photo || [],
		shippingWeight: product?.shippingWeight || 0,
		quantity: quantity,
	};

	return loading ? (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			width="100%"
			height="100vh"
		>
			<CircularProgress />
		</Box>
	) : (
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
					{error ? (
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
								{product.photo.map((photo: any, index: number) => (
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
								<AddToCartButton product={cartItem} />
							</CardContent>
						</Card>
					) : (
						!loading && (
							<Box textAlign="center">
								<h1 className="text-2xl font-bold">Product not found</h1>
							</Box>
						)
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
										{splitProductDetails().map((detail: any, index: number) => (
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
