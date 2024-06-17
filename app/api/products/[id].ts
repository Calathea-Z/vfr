import type { NextApiRequest, NextApiResponse } from "next";
// import { unstable_getServerSession } from "next-auth/react";
import client from "../../../sanity/lib/client";

interface Product {
	_id: string;
	name: string;
	price: number;
	photo: {
		_type: string;
		asset: {
			_ref: string;
			_type: string;
		};
	}[];
	tagLine?: string;
	description?: string;
	slug: {
		_type: string;
		current: string;
	};
	category: {
		_ref: string;
		_type: string;
	};
	subCategory?: {
		_ref: string;
		_type: string;
	};
	measurements?: string;
	shippingWeight?: number;
	countInStock: number;
	featuredProduct?: boolean;
}
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Product | { error: string }>
) {
	// const session = await unstable_getServerSession(req, res); // Optional: Add authentication if needed

	// if (!session) {
	// 	return res.status(401).json({ error: "Unauthorized" }); // Handle unauthorized access
	// }

	const id = req.query.id as string; // Access query parameter using req.query

	try {
		const product = await client.fetch(
			`*[_type == "Product" && _id == $id[0]]`,
			{ id }
		);

		if (!product) {
			return res.status(404).json({ error: "Product not found" }); // Handle product not found
		}

		res.status(200).json(product);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" }); // Handle errors gracefully
	}
}
