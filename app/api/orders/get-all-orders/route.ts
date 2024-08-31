import { NextRequest, NextResponse } from "next/server";
import Order from "@/app/lib/mongoModels/Order";
import dbConnect from "@/app/lib/dbConnect";

export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const orders = await Order.find().sort({ createdAt: -1 });

		if (orders.length > 0) {
			return NextResponse.json(orders, { status: 200 });
		} else {
			return NextResponse.json({ error: "No orders found" }, { status: 404 });
		}
	} catch (error) {
		console.error("Error fetching orders:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
