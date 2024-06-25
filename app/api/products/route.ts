import client from "../../../sanity/lib/client";
//---Framework---//
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const query = '*[_type == "product"]';
    console.log("Sanity Query:", query);

    const products = await client.fetch(query);
    if (products.length > 0) {
      console.log("Products found:", products);
      return NextResponse.json(products);
    } else {
      console.log("No products found");
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
