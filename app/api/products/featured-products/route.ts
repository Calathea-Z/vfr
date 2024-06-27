import client from "../../../../sanity/lib/client";
import { Product } from "../../../../types/types";
//---Framework---//
import { NextRequest, NextResponse } from "next/server";

// GET route to fetch all featured products.
export async function GET(request: NextRequest) {
	try {
		let baseQuery = `*[_type == "product" && featuredProduct == true]`;
		const fetchedProducts: Product[] = await client.fetch(baseQuery);

		if (fetchedProducts.length > 0) {
			// If there are fetched products, proceed to sort them
			const sortedProducts = fetchedProducts.sort((a, b) => {
				// If product a is out of stock, move it to the end
				if (a.countInStock === 0) return 1;
				// If product b is out of stock, move it to the end
				if (b.countInStock === 0) return -1;
				// If product a has low stock and product b has more than 10 in stock, prioritize a
				if (a.countInStock <= 10 && b.countInStock > 10) return -1;
				// If product b has low stock and product a has more than 10 in stock, prioritize b
				if (a.countInStock > 10 && b.countInStock <= 10) return 1;
				// If both products have similar stock levels, no change in order
				return 0;
			});
			return NextResponse.json(sortedProducts);
		} else {
			return NextResponse.json(
				{ error: "No products currently featured" },
				{ status: 404 }
			);
		}
	} catch (error) {
		console.error("Error fetching featured products:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
