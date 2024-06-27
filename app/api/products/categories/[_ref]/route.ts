import client from "../../../../../sanity/lib/client";
//---Framework---//
import { NextRequest, NextResponse } from "next/server";

// GET route to fetch products by a specific category
export async function GET(
	request: NextRequest,
	{ params }: { params: { _ref: string } }
) {
	// Log the params to ensure _ref is being passed correctly
	console.log("Params:", params);

	const { searchParams } = new URL(request.url);
	const limit = parseInt(searchParams.get("limit") || "4", 10);
	const excludeName = searchParams.get("excludeName");

	try {
		// Check if _ref is defined
		if (!params._ref) {
			console.error("Category reference parameter is missing");
			return NextResponse.json(
				{ error: "Category reference parameter is missing" },
				{ status: 400 }
			);
		}

		// Updated query to fetch products that aren't sold out and limit the number of products
		let query = `*[_type == "product" && category._ref == $_ref && countInStock > 0`;
		if (excludeName) {
			query += ` && name != $excludeName`;
		}
		query += `][0...${limit}]`;

		const queryParams: { [key: string]: string | undefined } = {
			_ref: params._ref,
		};
		if (excludeName) {
			queryParams.excludeName = excludeName;
		}

		const products = await client.fetch(query, queryParams);
		if (products.length > 0) {
			console.log("Products found:", products);
			return NextResponse.json(products);
		} else {
			console.log("No products found in this category");
			return NextResponse.json(
				{ error: "No products found in this category" },
				{ status: 404 }
			);
		}
	} catch (error) {
		console.error("Error fetching products:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
