import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Order from "@/app/lib/mongoModels/Order";

interface Item {
	productId: string;
}

export async function POST(request: NextRequest) {
	try {
		const {
			orderNumber,
			userId,
			transactionId,
			customer,
			items,
			fees,
			paymentStatus,
			shippingStatus,
		} = await request.json();

		// Convert userId to ObjectId if it's not a guest and is a valid ObjectId
		const userObjectId =
			userId !== "guest" && ObjectId.isValid(userId)
				? ObjectId.createFromHexString(userId)
				: userId;

		// Convert productId to ObjectId if valid
		const itemsWithObjectId = items.map((item: Item) => ({
			...item,
			productId: ObjectId.isValid(item.productId)
				? new ObjectId(item.productId)
				: item.productId,
		}));

		const newOrder = new Order({
			orderNumber,
			userId: userObjectId,
			transactionId,
			customer,
			items: itemsWithObjectId,
			fees,
			paymentStatus,
			shippingStatus,
		});

		await newOrder.save();
		return NextResponse.json(newOrder, { status: 201 });
	} catch (error) {
		console.error("Error creating order:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
