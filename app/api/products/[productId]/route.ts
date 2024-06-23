import { NextRequest, NextResponse } from "next/server";
import client from "../../../../sanity/lib/client";

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

export async function GET(
	request: NextRequest,
	{ params }: { params: { productId: string } }
) {
	const { productId } = params;

	try {
		const query = `*[_type == "product" && productId == $productId][0]`;
		console.log("Sanity Query:", query);

		const product = await client.fetch(query, { productId });
		if (product) {
			console.log("Product found:", product);
			return NextResponse.json(product);
		} else {
			console.log("Product not found");
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}
	} catch (error) {
		console.error("Error fetching product:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
