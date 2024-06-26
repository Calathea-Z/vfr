"use client";
import client from "../../../sanity/lib/client";
import ProductComponent from "../shop/Product";
import { Product } from "@/types/types";
//---Framework---//
import { useEffect, useState, FC } from "react";
//---Packages---//
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/material";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const FeaturedProducts: FC = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);

	const carouselSettings = {
		type: "slide",
		perPage: 4, // Display 4 slides at 1600 width
		perMove: 1,
		breakpoints: {
			1600: {
				perPage: 3,
			},
			1245: {
				perPage: 2, // Change to 2 slides at 1245 width
			},
			800: {
				perPage: 1,
			},
		},
		autoHeight: true,
		rewind: true,
		pagination: false,
		arrows: true,
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const query = `*[_type == "product" && featuredProduct == true]`;
				const fetchedProducts: Product[] = await client.fetch(query);
				if (fetchedProducts.length > 0) {
					// If there are fetched products, proceed to sort them
					const sortedProducts = fetchedProducts.sort((a, b) => {
						// If product a is out of stock, move it to the end
						if (a.countInStock === 0) return 1;
						// If product b is out of stock, move it to the end
						if (b.countInStock === 0) return -1;
						// If product a has low stock and product b has more than 10 in stock, prioritize a
						if (a.countInStock <= 10 && b.countInStock > 10) return -1;
						// If product b has low stock and product a has more than 10 in stock, prioritize b
						if (a.countInStock > 10 && b.countInStock <= 10) return 1;
						// If both products have similar stock levels, no change in order
						return 0;
					});
					// Set the sorted products to the state
					setProducts(sortedProducts);
					setError("");
				} else {
					setError("No products currently featured");
					setProducts([]);
				}
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unknown error occurred");
				}
				setProducts([]);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="start"
				p={2}
				width="100%"
			>
				<CircularProgress size={55} sx={{ color: "#8cc6b0" }} />
			</Box>
		);
	}

	if (error) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				p={4}
				width="100%"
			>
				<p className="text-center text-red-500">{error}</p>
			</Box>
		);
	}

	return (
		<section className="slider-container w-full overflow-hidden">
			<h1 className="text-4xl sm:text-5xl xl:text-7xl mb-4 pt-10 font-thin italic px-4">
				Featured Items
			</h1>
			<Splide aria-label="Featured Products" options={carouselSettings}>
				{products.map((product) => (
					<SplideSlide
						key={product._id}
						className="flex justify-center items-center"
					>
						<ProductComponent product={product} />
					</SplideSlide>
				))}
			</Splide>
		</section>
	);
};
export default FeaturedProducts;
