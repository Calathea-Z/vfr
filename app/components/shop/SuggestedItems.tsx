"use client";
import { Product } from "../../../types/types";
import ProductComponent from "./Product";
//---Framework---//
import { FC, useEffect, useState } from "react";
//---Packages---//
import { CircularProgress } from "@mui/material";
import axios from "axios";

interface SuggestedItemsProps {
	category_ref: string;
	resultsLimit: number;
	referencingProduct: string;
}

const SuggestedItems: FC<SuggestedItemsProps> = ({
	category_ref,
	resultsLimit,
	referencingProduct,
}) => {
	const [suggestedItems, setSuggestedItems] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		const excludeNameParam = referencingProduct
			? `&excludeName=${referencingProduct}`
			: "";
		axios
			.get(
				`/api/products/categories/${category_ref}?limit=${resultsLimit}${excludeNameParam}`
			)
			.then((response) => {
				if (response.status !== 200) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				setSuggestedItems(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching suggested items:", error);
				setError("Error fetching suggested items");
				setLoading(false);
			});
	}, [category_ref, resultsLimit, referencingProduct]);
	return (
		<div
			className="card"
			style={{
				background:
					"linear-gradient(to top right, rgba(255, 255, 255, 0.2), rgba(255, 165, 0, 0.2))",
				minHeight: "60vh",
			}}
		>
			<h1 className="text-4xl sm:text-5xl xl:text-7xl mb-4 pt-5 font-thin italic px-4 text-right">
				You May Also Like...
			</h1>
			<main className="flex-grow mt-4">
				<div className="flex justify-center">
					{loading ? (
						<div className="flex justify-center items-center p-10">
							<CircularProgress sx={{ color: "#8cc6b0" }} />
						</div>
					) : error ? (
						<div className="flex flex-col items-start justify-start w-full">
							<div className="w-full text-left text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold px-10 py-16 shadow-sm h-screen bg-gradient-to-b from-primary to-secondary">
								{error}
							</div>
						</div>
					) : (
						// grid layout when displaying products
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 justify-items-center w-full p-0 m-0">
							{suggestedItems.map((product, index) => (
								<ProductComponent key={index} product={product} />
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
};
export default SuggestedItems;
