import { NextRequest, NextResponse } from "next/server";
import User from "@/app/lib/mongoModels/User";
import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";

interface Address {
	_id: mongoose.Types.ObjectId;
	// Add other address fields here if needed
	[key: string]: any;
}

interface UserWithAddresses {
	addresses: Address[];
	// Add other user fields here if needed
	[key: string]: any;
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { addressId: string } }
) {
	const { addressId } = params;
	const addressData = await request.json();

	try {
		await dbConnect();
		const user = (await User.findOne({
			"addresses._id": addressId,
		})) as UserWithAddresses | null;

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const addressIndex = user.addresses.findIndex(
			(address: Address) => address._id && address._id.toString() === addressId
		);

		if (addressIndex === -1) {
			return NextResponse.json({ error: "Address not found" }, { status: 404 });
		}

		user.addresses[addressIndex] = {
			...user.addresses[addressIndex],
			...addressData,
			_id: user.addresses[addressIndex]._id, // Ensure _id is not overwritten
		};

		// Save only the addresses field
		await User.updateOne(
			{ _id: user._id },
			{ $set: { addresses: user.addresses } }
		);

		return NextResponse.json(
			{ message: "Address updated successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating address:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
