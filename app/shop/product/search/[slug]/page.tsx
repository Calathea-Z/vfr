"use client";
import client from "../../../../../sanity/lib/client";
import ProductComponent from "@/app/components/shop/Product";
import { lato } from "@/app/fonts/fonts"; // Import Lato font
//---Framework---//
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
//---Packages---//
import CircularProgress from "@mui/material/CircularProgress";
import { MaskHappy, MaskSad } from "@phosphor-icons/react";

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
			// Fetch products that match the search query
			let productQuery = `*[_type == "product" && (name match "${searchQuery}*" || "${searchQuery}" in category->title)]{..., "slug": slug.current}`;
			const products = await client.fetch(productQuery);

			// Fetch categories that match the search query and include their products
			let categoryQuery = `*[_type == "category" && title match "${searchQuery}*"]{
				"products": *[_type == "product" && references(^._id)]{..., "slug": slug.current}
			}`;
			const categories = await client.fetch(categoryQuery);

			// Flatten the category products
			const categoryProducts = categories.reduce(
				(acc: any[], category: any) => {
					return acc.concat(category.products);
				},
				[]
			);

			// Combine product results and category products
			const combinedResults = [...products, ...categoryProducts];

			// Remove duplicates
			const uniqueResults = Array.from(
				new Set(combinedResults.map((item: any) => item._id))
			).map((id) => combinedResults.find((item: any) => item._id === id));

			if (uniqueResults.length === 0) {
				// Fetch best sellers if no search results are found
				const bestSellersQuery = `*[_type == "product" && countInStock > 0] | order(amountSold desc)[0...5]{..., "slug": slug.current}`;
				const bestSellers = await client.fetch(bestSellersQuery);
				setState({
					loading: false,
					error: `Sorry, no results were found for '${decodeURIComponent(searchQuery)}'.`,
					products: bestSellers,
				});
			} else {
				setState({
					products: uniqueResults,
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
			<main className="flex-grow mt-2 md:mt-4">
				<div className="flex justify-center">
					{loading ? (
						<div className="flex justify-center items-center p-10">
							<CircularProgress sx={{ color: "#8cc6b0" }} />
						</div>
					) : (
						<div className="flex flex-col items-start justify-start w-full">
							{error ? (
								<div
									className={`flex flex-col gap-1 md:gap-4 w-full text-left text-sm sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold px-5 md:px-10 py-1 sm:py-4 md:py-8 shadow-sm  ${lato.className}`}
								>
									<span className="flex items-center gap-2 text-secondary">
										<MaskSad size={40} />
										{error}
									</span>
									<span className="flex items-center gap-2 ml-[3.5rem] text-emerald-500">
										<p>Here are some things you may like!</p>
										<MaskHappy size={40} />
									</span>
								</div>
							) : (
								<div
									className={`w-full text-left text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold px-10 py-8 shadow-sm text-emerald-500 ${lato.className}`}
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
