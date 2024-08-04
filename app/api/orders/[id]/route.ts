import { NextRequest, NextResponse } from "next/server";
import Order from "@/app/lib/mongoModels/Order";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;

	try {
		const order = await Order.findOne({ orderNumber: id });

		if (!order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		return NextResponse.json(order, { status: 200 });
	} catch (error) {
		console.error("Error fetching order:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
