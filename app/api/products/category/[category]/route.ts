import client from "../../../../../sanity/lib/client";
//---Framework---//
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  const formattedCategoryName =
    typeof params.category === "string"
      ? params.category.charAt(0).toUpperCase() + params.category.slice(1).toLowerCase()
      : "";

  try {
    const query = `*[_type == "product" && category->title == $category]`;
    console.log("Sanity Query:", query);

    const products = await client.fetch(query, { category: formattedCategoryName });
    if (products.length > 0) {
      console.log("Products found:", products);
      return NextResponse.json(products);
    } else {
      console.log("No products found in this category");
      return NextResponse.json({ error: "No products found in this category" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}