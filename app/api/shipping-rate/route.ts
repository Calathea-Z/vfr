import axios from "axios";
import qs from "qs";
import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

export async function POST(request: NextRequest) {
	const { shippingWeight, zipCode, boxLength, boxWidth, boxHeight } =
		await request.json();

	try {
		const params = {
			API: "RateV4",
			XML: `<RateV4Request USERID="${process.env.USPS_USERNAME}">
				<Package ID="0">
					<Service>PRIORITY</Service>
					<ZipOrigination>28791</ZipOrigination>
					<ZipDestination>${zipCode}</ZipDestination>
					<Pounds>0</Pounds>
					<Ounces>${shippingWeight}</Ounces>
					<Container></Container>
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

		const xmlData = await parseStringPromise(response.data);
		const errorElement =
			xmlData?.RateV4Response?.Package?.[0]?.Error?.[0]?.Description?.[0];
		if (errorElement) {
			return NextResponse.json(
				{ error: `Error from USPS API: ${errorElement}` },
				{ status: 500 }
			);
		} else {
			const rateElement =
				xmlData?.RateV4Response?.Package?.[0]?.Postage?.[0]?.Rate?.[0];
			if (rateElement) {
				return NextResponse.json({ rate: rateElement });
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
