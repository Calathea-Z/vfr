import { NextRequest, NextResponse } from "next/server";
import User from "@/app/lib/mongoModels/User";
import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";

interface Address {
	_id: mongoose.Types.ObjectId;
	isPrimary?: boolean;
	dateCreated?: Date;
	dateUpdated?: Date;
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
	{ params }: { params: { userId: string; addressId: string } }
) {
	const { userId, addressId } = params;
	const addressData = await request.json();

	try {
		await dbConnect();
		const user = (await User.findById(userId)) as UserWithAddresses | null;

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		if (addressData.isPrimary) {
			// Set all existing addresses' isPrimary to false
			user.addresses.forEach((address) => {
				address.isPrimary = false;
			});
		}

		if (addressData._id === "") {
			// Create a new address
			const newAddress: Address = {
				_id: new mongoose.Types.ObjectId(),
				...addressData,
				dateCreated: new Date(),
				dateUpdated: new Date(),
			};

			// If the user has no addresses, set the new address as primary
			if (user.addresses.length === 0) {
				newAddress.isPrimary = true;
			}

			user.addresses.push(newAddress);
		} else {
			// Update existing address
			const addressIndex = user.addresses.findIndex(
				(address: Address) =>
					address._id && address._id.toString() === addressId
			);

			if (addressIndex === -1) {
				return NextResponse.json(
					{ error: "Address not found" },
					{ status: 404 }
				);
			}

			user.addresses[addressIndex] = {
				...user.addresses[addressIndex],
				...addressData,
				_id: user.addresses[addressIndex]._id, // Ensure _id is not overwritten
				dateUpdated: new Date(), // Update the dateUpdated field
			};
		}

		// Save only the addresses field
		await User.updateOne({ _id: userId }, { addresses: user.addresses });

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
