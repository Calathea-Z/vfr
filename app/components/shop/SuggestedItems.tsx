"use client";
import { Product } from "../../../types/types";
import ProductComponent from "./Product";
//---Framework---//
import { FC, useEffect, useState } from "react";
//---Packages---//
import { CircularProgress } from "@mui/material";
import axios from "axios";

interface SuggestedItemsProps {
	category: string;
	resultsLimit: number;
}

const SuggestedItems: FC<SuggestedItemsProps> = ({
	category,
	resultsLimit,
}) => {
	const [suggestedItems, setSuggestedItems] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setLoading(true);
		axios
			.get(`/api/products/category/${category}?limit=${resultsLimit}`)
			.then((response) => {
				if (response.status !== 200) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				setSuggestedItems(response.data);
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
					<CircularProgress />
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
