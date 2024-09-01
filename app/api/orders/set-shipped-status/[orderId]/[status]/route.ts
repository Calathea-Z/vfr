import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Order from "@/app/lib/mongoModels/Order";
import dbConnect from "@/app/lib/dbConnect";

export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const { orderId, shipped } = await request.json();

		if (!orderId || typeof shipped !== "boolean") {
			return NextResponse.json({ message: "Invalid request" }, { status: 400 });
		}

		const result = await Order.updateOne(
			{ _id: ObjectId.createFromHexString(orderId) },

			{ $set: { shippingStatus: shipped ? "Shipped" : "Not Shipped" } }
		);

		if (result.modifiedCount === 0) {
			return NextResponse.json({ message: "Order not found" }, { status: 404 });
		}

		return NextResponse.json(
			{ message: "Shipping status updated successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating shipping status:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
