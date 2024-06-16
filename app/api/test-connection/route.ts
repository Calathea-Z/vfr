import { NextResponse } from "next/server";
import clientPromise from "../../lib/db";

export async function GET(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db("VineAndFrond"); // Replace with your database name

		// Perform a simple operation to verify the connection
		const collections = await db.listCollections().toArray();

		return NextResponse.json({
			message: "Successfully connected to the database",
			collections,
		});
	} catch (error) {
		console.error("Error connecting to the database:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
