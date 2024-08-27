import { NextRequest, NextResponse } from "next/server";
import User from "@/app/lib/mongoModels/User";
import dbConnect from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(
	request: NextRequest,
	{ params }: { params: { userId: string } }
) {
	const { userId } = params;

	try {
		await dbConnect();
		const user = await User.findById(userId).lean();

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const sortedAddresses = user.addresses.sort((a: any, b: any) => {
			if (a.isPrimary && !b.isPrimary) return -1;
			if (!a.isPrimary && b.isPrimary) return 1;
			return (
				new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime()
			);
		});

		return NextResponse.json(sortedAddresses, { status: 200 });
	} catch (error) {
		console.error("Error fetching addresses:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
