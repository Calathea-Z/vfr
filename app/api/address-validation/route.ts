import axios from "axios";
import qs from "qs";
import { parseStringPromise } from "xml2js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const { street, city, state, zipCode } = await request.json();
	const params = {
		API: "Verify",
		XML: `<AddressValidateRequest USERID="${process.env.USPS_USERNAME}">
			<Revision>1</Revision>
			<Address ID="0">
				<Address1/>
				<Address2>${street}</Address2>
				<City>${city}</City>
				<State>${state}</State>
				<Zip5>${zipCode}</Zip5>
				<Zip4/>
			</Address>
		</AddressValidateRequest>`,
	};
	const paramString = qs.stringify(params);
	try {
		const response = await axios.post(
			`https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&${paramString}`
		);
		const xmlString = response.data;
		const result = await parseStringPromise(xmlString, {
			explicitArray: false,
			ignoreAttrs: true,
		});
		const address = result.AddressValidateResponse.Address;

		const valid = address && !address.Error;
		const suggestedAddress = valid
			? null
			: {
					street: address?.Address2?.trim(),
					city: address?.City?.trim(),
					state: address?.State?.trim(),
					zipCode: address?.Zip5?.trim(),
				};
		return NextResponse.json({ valid, suggestedAddress });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				error: "An error occurred while verifying the address.",
				details: (error as Error).message,
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	return NextResponse.json(
		{ error: "Invalid request method." },
		{ status: 404 }
	);
}
