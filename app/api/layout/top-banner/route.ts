import client from "../../../../sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

// GET route to fetch top banner information.
export async function GET(request: NextRequest) {
	try {
		const query = `*[_type == "topBanner" && enabled == true][0]`;
		const data = await client.fetch(query);
		if (data) {
			return NextResponse.json(data);
		} else {
			return NextResponse.json(
				{ error: "No top banner data found" },
				{ status: 404 }
			);
		}
	} catch (error) {
		console.error("Error fetching top banner data:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
