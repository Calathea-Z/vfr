import client from "../../../../sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

// GET route to fetch left side button data
export async function GET(request: NextRequest) {
	try {
		const query = `*[_type == "sideButton" && enabled == true][0]`;
		const data = await client.fetch(query);
		if (data) {
			return NextResponse.json(data);
		} else {
			return NextResponse.json(
				{ error: "No side button data found" },
				{ status: 404 }
			);
		}
	} catch (error) {
		console.error("Error fetching side button data:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
