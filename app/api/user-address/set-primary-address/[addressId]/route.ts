import { NextRequest, NextResponse } from "next/server";
import User from "@/app/lib/mongoModels/User";
import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";

interface Address {
	_id: mongoose.Types.ObjectId;
	isPrimary: boolean;
	[key: string]: any;
}

interface UserWithAddresses {
	addresses: Address[];
	[key: string]: any;
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { addressId: string } }
) {
	const { addressId } = params;
	const userId = request.headers.get("userId");

	if (!userId) {
		return NextResponse.json({ error: "User ID is required" }, { status: 400 });
	}

	try {
		await dbConnect();
		const user = (await User.findById(userId)) as UserWithAddresses | null;

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		let addressFound = false;

		user.addresses.forEach((address) => {
			if (address._id && address._id.toString() === addressId) {
				address.isPrimary = true;
				addressFound = true;
			} else {
				address.isPrimary = false;
			}
		});

		if (!addressFound) {
			return NextResponse.json({ error: "Address not found" }, { status: 404 });
		}

		await User.updateOne(
			{ _id: user._id },
			{ $set: { addresses: user.addresses } }
		);

		return NextResponse.json(
			{ message: "Primary address set successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error setting primary address:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
