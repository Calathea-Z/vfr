import { Product } from "@/types/types";
import client from "../../../../sanity/lib/client";
//---Framework---//
import { NextRequest, NextResponse } from "next/server";

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
