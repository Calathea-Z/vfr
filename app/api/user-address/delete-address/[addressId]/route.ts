import { NextRequest, NextResponse } from "next/server";
import User from "@/app/lib/mongoModels/User";
import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";

interface Address {
	_id: mongoose.Types.ObjectId;
	isPrimary?: boolean;
	dateCreated?: Date;
	// Add other address fields here if needed
	[key: string]: any;
}

interface UserWithAddresses {
	addresses: Address[];
	// Add other user fields here if needed
	[key: string]: any;
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { addressId: string } }
) {
	const { addressId } = params;

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

		user.addresses.splice(addressIndex, 1);

		// Check if there are no addresses with isPrimary set to true
		const hasPrimaryAddress = user.addresses.some(
			(address) => address.isPrimary
		);

		if (!hasPrimaryAddress && user.addresses.length > 0) {
			// Find the address with the newest creation date
			const newestAddress = user.addresses.reduce(
				(newest, address) => {
					return !newest ||
						(address.dateCreated &&
							address.dateCreated > (newest?.dateCreated || new Date(0)))
						? address
						: newest;
				},
				null as Address | null
			);

			if (newestAddress) {
				newestAddress.isPrimary = true;
			}
		}

		// Save only the addresses field
		await User.updateOne({ _id: user._id }, { addresses: user.addresses });

		return NextResponse.json(
			{ message: "Address deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting address:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
