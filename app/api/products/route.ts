import client from "../../../sanity/lib/client";
//---Framework---//
import { NextRequest, NextResponse } from "next/server";

// GET route to fetch products based on filters and sorting
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const filters = searchParams.getAll("filters");
	const sortQuery = searchParams.get("sortQuery") || "amountSold asc";

	try {
		let baseQuery = '*[_type == "product"';
		let filterConditions: string[] = [];

		// Handle category filters
		const categoryFilters = filters.filter((f) =>
			["Ceramics", "Bags", "Stickers", "Prints"].includes(f)
		);
		if (categoryFilters.length > 0) {
			filterConditions.push(
				`category->title in [${categoryFilters.map((f) => `"${f}"`).join(", ")}]`
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

		if (products.length > 0) {
			return NextResponse.json(products);
		} else {
			return NextResponse.json({ error: "No products found" }, { status: 404 });
		}
	} catch (error) {
		console.error("Error fetching products:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
