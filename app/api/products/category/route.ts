import client from "../../../../sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

//Get Route to fetch all categories
export async function GET(request: NextRequest) {
	try {
		const query = `*[_type == "category" && hidden != true] | order(ordinal asc){
			title,
			"subMenuImage": subMenuImage.asset._ref,
			ordinal
		}`;
		const fetchedCategories = await client.fetch(query);
		return NextResponse.json(fetchedCategories);
	} catch (error) {
		console.error("Error fetching categories:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
