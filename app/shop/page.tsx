"use client";
import ProductComponent from "../components/shop/Product";
import client from "../../sanity/lib/client";
//---Framework---//
import { useEffect, useState, useCallback } from "react";
//---Packages---//
import PropagateLoader from "react-spinners/PropagateLoader";
import { Box, Typography } from "@mui/material";

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

interface State {
	products: Product[];
	error: string;
	loading: boolean;
	filters: string[];
}

const ShopHome: React.FC = () => {
	const [state, setState] = useState<State>({
		products: [],
		error: "",
		loading: true,
		filters: [],
	});

	const { loading, error, products, filters } = state;

	const fetchData = async () => {
		// if (!filters || filters.length === 0) {
		// 	console.log("No filters set, skipping fetch");
		// 	return;
		// }
		setState((prevState) => ({
			...prevState,
			loading: true,
			error: "",
		}));

		try {
			let baseQuery = '*[_type == "product"]';
			// let filterConditions: string[] = [];

			// // Handle category filters
			// const categoryFilters = filters.filter((f) =>
			// 	["Ceramics", "Bags", "Stickers", "Prints"].includes(f)
			// );
			// if (categoryFilters.length > 0) {
			// 	filterConditions.push(
			// 		`category->title in [${categoryFilters
			// 			.map((f) => `"${f}"`)
			// 			.join(", ")}]`
			// 	);
			// }

			// // Handle price range filters
			// const priceFilters = filters.filter((f) =>
			// 	["Under 25", "25-50", "Over 50"].includes(f)
			// );
			// if (priceFilters.length > 0) {
			// 	priceFilters.forEach((price) => {
			// 		switch (price) {
			// 			case "Under 25":
			// 				filterConditions.push("price < 25");
			// 				break;
			// 			case "25-50":
			// 				filterConditions.push("price >= 25 && price <= 50");
			// 				break;
			// 			case "Over 50":
			// 				filterConditions.push("price > 50");
			// 				break;
			// 		}
			// 	});
			// }

			// // Exclude out of stock products if the filter is active
			// if (filters.includes("Exclude Out Of Stock")) {
			// 	filterConditions.push("countInStock > 0");
			// }

			// // Combine all filter conditions
			// if (filterConditions.length > 0) {
			// 	baseQuery += ` && (${filterConditions.join(" && ")})`;
			// }
			// baseQuery += "]";

			console.log("Querying Sanity with:", baseQuery);
			const products = await client.fetch(baseQuery);
			console.log("Products fetched:", products);

			if (!Array.isArray(products)) {
				throw new Error("Fetch did not return an array");
			}

			if (products.length === 0) {
				setState({
					loading: false,
					error: "No products found. Please check back later.",
					products: [],
					filters: state.filters,
				});
			} else {
				setState({
					products,
					loading: false,
					error: "",
					filters: state.filters,
				});
			}
		} catch (err: any) {
			console.error("Error fetching products:", err);
			setState({
				loading: false,
				error: err.message,
				products: [],
				filters: state.filters,
			});
		}
	};

	// useEffect(() => {
	// 	if (filters && filters.length > 0) {
	// 		console.log("Fetching data with filters:", filters);
	// 		fetchData();
	// 	} else {
	// 		console.log("No filters set, skipping fetch");
	// 	}
	// }, [filters]);

	useEffect(() => {
		console.log("useEffect triggered for testing, ignoring filters");
		fetchData();
	}, []);

	const handleFilterChange = useCallback((selectedFilters: string[]) => {
		console.log("Received filters for update:", selectedFilters);
		setState((prevState) => {
			if (
				JSON.stringify(prevState.filters) !== JSON.stringify(selectedFilters)
			) {
				console.log("Updating Filters in AllProducts:", selectedFilters);
				return { ...prevState, filters: selectedFilters };
			}
			return prevState;
		});
	}, []);

	return (
		<Box
			sx={{
				bgcolor: "#F5F5F5",
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<Box
				sx={{
					bgcolor: "#F5F5F5",
					p: 0,
					borderTop: 1,
					borderBottom: 1,
					borderColor: "black",
				}}
			>
				<Box sx={{ flexGrow: 1 }}>
					{/* <Breadcrumbs /> */}
					<Typography
						variant="h4"
						sx={{
							fontStyle: "italic",
							fontWeight: "light",
							color: "black",
							px: 1,
							py: 4,
							borderBottom: 0,
						}}
					>
						Shop All
					</Typography>
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					bgcolor: "primary.main",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "start",
						width: "100%",
					}}
				>
					<Box sx={{ maxWidth: "xs" }}>
						{/* <Filters
							productTypes={["Ceramics", "Bags", "Stickers", "Prints"]}
							onFilterChange={handleFilterChange}
						/> */}
					</Box>
					{/* <Box sx={{ maxWidth: 'xs' }}>
						<Sort />
					</Box> */}
				</Box>
			</Box>
			<Box sx={{ flexGrow: 1 }}>
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					{loading ? (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								p: 10,
							}}
						>
							<PropagateLoader size={35} color={"#8cc6b0"} />
						</Box>
					) : error ? (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "start",
								width: "100%",
								height: "100%",
							}}
						>
							<Box
								sx={{
									width: "100%",
									textAlign: "center",
									fontSize: "xl",
									px: 10,
									py: 16,
									borderRadius: "lg",
									boxShadow: "md",
									bgcolor: "secondary.light",
									opacity: 0.5,
								}}
							>
								{error}
							</Box>
						</Box>
					) : (
						// grid layout when displaying products
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: {
									xs: "repeat(1, 1fr)",
									sm: "repeat(2, 1fr)",
									md: "repeat(3, 1fr)",
									lg: "repeat(4, 1fr)",
								},
								justifyItems: "center",
								width: "100%",
							}}
						>
							{products.map((product, index) => (
								<ProductComponent key={index} product={product} />
							))}
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default ShopHome;
