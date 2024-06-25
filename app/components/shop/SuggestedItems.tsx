"use client";
import React from "react";
import { Product } from "../../../types/types";
import ProductComponent from "./Product";

interface SuggestedItemsProps {
	category: string;
	resultsLimit: number;
}

const SuggestedItems = ({ category, resultsLimit }: SuggestedItemsProps) => {
	const [suggestedItems, setSuggestedItems] = React.useState<Product[]>([]);
	const [loading, setLoading] = React.useState<boolean>(true);

	React.useEffect(() => {
		setLoading(true);
		// Fetch items from the server or a local source based on the category
		fetch(`/api/products/category/${category}?limit=${resultsLimit}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				setSuggestedItems(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching suggested items:", error);
				setLoading(false);
			});
	}, [category, resultsLimit]);

	return (
		<div className="card p-2">
			<div className="flex flex-col items-center">
				{loading ? (
					<div className="spinner">Loading...</div>
				) : (
					suggestedItems.slice(0, resultsLimit).map((item) => (
						<div key={item._id} className="w-full">
							<ProductComponent product={item} small />
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default SuggestedItems;
