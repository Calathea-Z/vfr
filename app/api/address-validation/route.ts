import axios from "axios";
import qs from "qs";
import { parseStringPromise } from "xml2js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { address, apartment, city, state, zipCode } = await request.json();
		const params = {
			API: "Verify",
			XML: `<AddressValidateRequest USERID="${process.env.USPS_USERNAME}">
				<Revision>1</Revision>
				<Address ID="0">
					<Address1>${apartment || ""}</Address1>
					<Address2>${address}</Address2>
					<City>${city}</City>
					<State>${state}</State>
					<Zip5>${zipCode}</Zip5>
					<Zip4></Zip4>
				</Address>
			</AddressValidateRequest>`,
		};
		const paramString = qs.stringify(params);
		const response = await axios.post(
			`https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&${paramString}`
		);
		const xmlString = response.data;
		const result = await parseStringPromise(xmlString, {
			explicitArray: false,
			ignoreAttrs: true,
		});
		console.log("USPS API Response:", result);
		const addressResponse = result.AddressValidateResponse.Address;

		let valid = addressResponse && !addressResponse.Error;
		let suggestedAddress = null;
		if (addressResponse) {
			suggestedAddress = {
				street: addressResponse.Address2?.trim() || "",
				apartment: addressResponse.Address1?.trim() || "",
				city: addressResponse.City?.trim() || "",
				state: addressResponse.State?.trim() || "",
				zipCode: addressResponse.Zip5?.trim() || "",
			};
			// Check if the suggested address matches the input
			const inputMatches =
				(addressResponse.Address2?.trim().toLowerCase() || "") ===
					(address || "").toLowerCase() &&
				(addressResponse.City?.trim().toLowerCase() || "") ===
					(city || "").toLowerCase() &&
				(addressResponse.State?.trim().toLowerCase() || "") ===
					(state || "").toLowerCase() &&
				(addressResponse.Zip5?.trim() || "") === (zipCode || "");

			// If the input doesn't match the suggestion, mark it as invalid
			if (!inputMatches) {
				valid = false;
			}
		}
		return NextResponse.json({ valid, suggestedAddress });
	} catch (error) {
		console.error("Error verifying address:", error);
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
		{ status: 405 }
	);
}
