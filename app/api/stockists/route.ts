import client from "../../../sanity/lib/client";
import { Stockist } from "@/types/types";
//---Framework---//
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const query = `*[_type == "stockist"]{
      name,
      description,
      "addressLineOne": address.street,
      "addressLineTwo": address.city + ", " + address.state + " " + address.zipCode,
      keywords,
      latitude,
      longitude,
      url
    }`;
		const fetchedStockists: Stockist[] = await client.fetch(query);
		const sortedStockists = fetchedStockists.sort((a: Stockist, b: Stockist) =>
			a.name.localeCompare(b.name)
		);
		return NextResponse.json(sortedStockists);
	} catch (error) {
		console.error("Error fetching stockists:", error);
		return NextResponse.json(
			{ error: "Failed to fetch stockists. Please try again later." },
			{ status: 500 }
		);
	}
}
