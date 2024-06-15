"use client";
import client from "../../../../../sanity/lib/client";
import ProductComponent from "@/app/components/shop/Product";
import { lato } from "@/app/fonts/fonts"; // Import Lato font
//---Framework---//
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
//---Packages---//
import CircularProgress from "@mui/material/CircularProgress";

const SearchResultsPage: React.FC = () => {
	const { slug } = useParams();
	const searchQuery = typeof slug === "string" ? slug : "";

	const [state, setState] = useState<{
		products: any[];
		error: string;
		loading: boolean;
	}>({
		products: [],
		error: "",
		loading: true,
	});

	const { loading, error, products } = state;

	const fetchData = async () => {
		if (!searchQuery) {
			console.log("No search query provided, skipping fetch");
			return;
		}
		setState((prevState) => ({
			...prevState,
			loading: true,
			error: "",
		}));
		try {
			let baseQuery = `*[_type == "product" && name match "${searchQuery}*"]{..., "slug": slug.current}`;

			console.log("Final query:", baseQuery);

			const products = await client.fetch(baseQuery);

			if (!Array.isArray(products)) {
				throw new Error("Fetch did not return an array");
			}

			if (products.length === 0) {
				// Fetch best sellers if no search results are found
				const bestSellersQuery = `*[_type == "product" && countInStock > 0] | order(amountSold desc)[0...5]{..., "slug": slug.current}`;
				const bestSellers = await client.fetch(bestSellersQuery);
				setState({
					loading: false,
					error: `Sorry, no results were found for "${decodeURIComponent(searchQuery)}".\nPopular items you might like:`,
					products: bestSellers,
				});
			} else {
				setState({
					products,
					loading: false,
					error: "",
				});
			}
		} catch (err: any) {
			console.error("Error fetching products:", err);
			setState({
				loading: false,
				error: err.message,
				products: [],
			});
		}
	};

	useEffect(() => {
		if (searchQuery) {
			fetchData();
		} else {
			console.log("No search query provided, skipping fetch");
		}
	}, [searchQuery]);
	return (
		<div className="bg-white flex flex-col min-h-screen">
			<main className="flex-grow mt-4">
				<div className="flex justify-center">
					{loading ? (
						<div className="flex justify-center items-center p-10">
							<CircularProgress sx={{ color: "#8cc6b0" }} />
						</div>
					) : (
						<div className="flex flex-col items-start justify-start w-full">
							{error ? (
								<div
									className={`w-full text-left text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold px-10 py-8 shadow-sm  ${lato.className}`}
								>
									{error}
								</div>
							) : (
								<div
									className={`w-full text-left text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold px-10 py-8 shadow-sm  ${lato.className}`}
								>
									{`Search results for "${decodeURIComponent(searchQuery)}"`}
								</div>
							)}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 justify-items-center w-full">
								{products.map((product, index) => (
									<ProductComponent key={index} product={product} />
								))}
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default SearchResultsPage;
