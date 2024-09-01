import { NextRequest, NextResponse } from "next/server";
import Order from "@/app/lib/mongoModels/Order";
import dbConnect from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(
	request: NextRequest,
	{ params }: { params: { userId: string } }
) {
	const { userId } = params;

	console.log("Fetching orders for userId:", userId);

	try {
		await dbConnect();
		const orders = await Order.find({ userId: new ObjectId(userId) }).sort({
			createdAt: -1,
		});

		console.log("Found orders:", orders.length);

		return NextResponse.json(orders, { status: 200 });
	} catch (error) {
		console.error("Error fetching user orders:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
