"use client";
import ProductComponent from "../components/shop/Product";
import Filter from "../components/shop/Filter";
import Sort from "../components/shop/Sort";
import client from "../../sanity/lib/client";
//---Framework---//
import { useEffect, useState, useCallback } from "react";
//---Packages---//
import { CircularProgress } from "@mui/material";
import Link from "next/link";
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
	sortQuery: string;
}

const ShopHome: React.FC = () => {
	const [state, setState] = useState<State>({
		products: [],
		error: "",
		loading: true,
		filters: [],
		sortQuery: "amountSold asc",
	});

	const { loading, error, products, filters, sortQuery } = state;

	const fetchData = async () => {
		if (!filters || filters.length === 0) {
			console.log("No filters set, skipping fetch");
			return;
		}
		setState((prevState) => ({
			...prevState,
			loading: true,
			error: "",
		}));

		try {
			let baseQuery = '*[_type == "product"';
			let filterConditions: string[] = [];

			// Handle category filters
			const categoryFilters = filters.filter((f) =>
				["Ceramics", "Bags", "Stickers", "Prints"].includes(f)
			);
			if (categoryFilters.length > 0) {
				filterConditions.push(
					`category->title in [${categoryFilters
						.map((f) => `"${f}"`)
						.join(", ")}]`
				);
			}

			// Handle price range filters
			const priceFilters = filters.filter((f) =>
				["Under 25", "25-50", "Over 50"].includes(f)
			);
			if (priceFilters.length > 0) {
				priceFilters.forEach((price) => {
					switch (price) {
						case "Under 25":
							filterConditions.push("price < 25");
							break;
						case "25-50":
							filterConditions.push("price >= 25 && price <= 50");
							break;
						case "Over 50":
							filterConditions.push("price > 50");
							break;
					}
				});
			}

			// Exclude out of stock products if the filter is active
			if (filters.includes("Exclude Out Of Stock")) {
				filterConditions.push("countInStock > 0");
			}

			// Combine all filter conditions
			if (filterConditions.length > 0) {
				baseQuery += ` && (${filterConditions.join(" && ")})`;
			}
			baseQuery += "]";

			// Add sorting
			if (sortQuery) {
				baseQuery += ` | order(${sortQuery})`;
			}

			const products = await client.fetch(baseQuery);

			if (!Array.isArray(products)) {
				throw new Error("Fetch did not return an array");
			}

			if (products.length === 0) {
				setState({
					loading: false,
					error: "No products found. Please check back later.",
					products: [],
					filters: state.filters,
					sortQuery: state.sortQuery,
				});
			} else {
				setState({
					products,
					loading: false,
					error: "",
					filters: state.filters,
					sortQuery: state.sortQuery,
				});
			}
		} catch (err: any) {
			console.error("Error fetching products:", err);
			setState({
				loading: false,
				error: err.message,
				products: [],
				filters: state.filters,
				sortQuery: state.sortQuery,
			});
		}
	};

	useEffect(() => {
		if (filters && filters.length > 0) {
			fetchData();
		} else {
			console.log("No filters set, skipping fetch");
		}
	}, [filters, sortQuery]);

	useEffect(() => {
		fetchData();
	}, []);

	const handleFilterChange = useCallback((selectedFilters: string[]) => {
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

	const handleSortChange = (sortQuery: string) => {
		setState((prevState) => ({
			...prevState,
			sortQuery,
		}));
	};

	return (
		<div className="bg-primary flex flex-col min-h-screen">
			<div className="bg-primary pt-4 px-2 h-24md:h-36 border-b-black border-b-[1px]">
				<div className="flex-grow">
					{/* <Breadcrumbs /> */}
					<h1 className="text-3xl sm:text-6xl font-thin italic text-black px-1 py-4">
						Shop All
					</h1>
				</div>
			</div>
			<div className="flex flex-col md:flex-row justify-center bg-primary px-2">
				<div className="flex flex-col lg:flex-row justify-between items-start w-full lg:w-screen">
					<div className="w-full lg:max-w-xs">
						<Filter
							productTypes={["Ceramics", "Bags", "Stickers", "Prints"]}
							onFilterChange={handleFilterChange}
						/>
					</div>
					<div className="w-full lg:max-w-[15rem] mt-4 lg:mt-0">
						<Sort onSortChange={handleSortChange} />
					</div>
				</div>
			</div>
			<main className="flex-grow mt-4">
				<div className="p-2 flex justify-center">
					{loading ? (
						<div className="flex justify-center items-center p-10">
							<CircularProgress sx={{ color: "#8cc6b0" }} />
						</div>
					) : error ? (
						<div className="flex flex-col items-center justify-start w-full h-full">
							<div className="w-full text-center text-xl leading-relaxed px-10 py-16 rounded-lg shadow-md bg-secondary/50">
								{error}
							</div>
						</div>
					) : (
						// grid layout when displaying products
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mdLg:grid-cols-4 justify-items-center w-full">
							{products.map((product, index) => (
								<ProductComponent key={index} product={product} />
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default ShopHome;
