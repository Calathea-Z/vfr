import axios from "axios";

export const calculateShippingRate = async (
	postalCode: string,
	shippingWeight: number,
	boxLength: number,
	boxWidth: number,
	boxHeight: number
) => {
	const data = {
		shippingWeight,
		zipCode: postalCode.substring(0, 5),
		boxLength,
		boxWidth,
		boxHeight,
	};

	try {
		const res = await axios.post("/api/shipping-rate", data);
		if (res.data.rate) {
			return res.data.rate;
		} else {
			console.error(res.data.error);
			return null;
		}
	} catch (error) {
		console.error("Error fetching shipping rates", error);
		return null;
	}
};
