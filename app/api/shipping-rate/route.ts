import axios from "axios";
import qs from "qs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const { cartItems, shippingWeight, zipCode } = await request.json();

	const pickBoxSize = (itemQuantity: number) => {
		if (itemQuantity <= 2) {
			return { boxLength: 7, boxWidth: 7, boxHeight: 6 };
		} else {
			return { boxLength: 12, boxWidth: 11, boxHeight: 8 };
		}
	};

	const totalQuantity = cartItems.reduce(
		(accumulator: number, currentValue: { quantity: number }) => {
			return accumulator + currentValue.quantity;
		},
		0
	);

	const { boxLength, boxWidth, boxHeight } = pickBoxSize(totalQuantity);

	try {
		const params = {
			API: "RateV4",
			XML: `<RateV4Request USERID="${process.env.USPS_USERNAME}" PASSWORD="${process.env.USPS_PASSWORD}">
				<Package ID="0">
					<Service>PRIORITY</Service>
					<ZipOrigination>28791</ZipOrigination>
					<ZipDestination>${zipCode}</ZipDestination>
					<Pounds>0</Pounds>
					<Ounces>${shippingWeight}</Ounces>
					<Container/>
					<Width>${boxWidth}</Width>
					<Length>${boxLength}</Length>
					<Height>${boxHeight}</Height>    
					<Machinable>true</Machinable>
				</Package>
			</RateV4Request>`,
		};

		const paramString = qs.stringify(params);

		const response = await axios.post(
			`https://secure.shippingapis.com/ShippingAPI.dll?API=RateV4&${paramString}`
		);

		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, "application/xml");
		const errorElement = xmlDoc.querySelector("Error Description");
		if (errorElement) {
			const errorMessage = errorElement.textContent;
			return NextResponse.json(
				{ error: `Error from USPS API: ${errorMessage}` },
				{ status: 500 }
			);
		} else {
			const rateElement = xmlDoc.querySelector("Rate");
			if (rateElement) {
				const rate = rateElement.textContent;
				return NextResponse.json({ rate });
			} else {
				return NextResponse.json(
					{ error: "Rate element not found in XML document" },
					{ status: 500 }
				);
			}
		}
	} catch (error) {
		return NextResponse.json(
			{ error: "Error fetching shipping rates" },
			{ status: 500 }
		);
	}
}
