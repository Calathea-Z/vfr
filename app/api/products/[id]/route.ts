import client from "../../../../sanity/lib/client";
//---Framework---//
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	_: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;

	try {
		const query = `*[_type == "product" && (slug.current == $id || productId == $id)][0]`;
		console.log("Sanity Query:", query);

		const product = await client.fetch(query, { id });
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
