import { useStateStorage } from "../../../utils/stateStorage";
import { ShippingInformation } from "@/types/types";
//---Framework---//
import { useState, useEffect } from "react";
//---Packages---//
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import Cookies from "universal-cookie";

const ShippingCostCalculator = () => {
	const {
		state: {
			cart: { cartItems, shippingWeight, shippingInformation },
		},
		dispatch,
	} = useStateStorage();

	const [shippingRate, setShippingRate] = useState<number | null>(null);

	const cookies = new Cookies();

	useEffect(() => {
		const getShippingRates = async () => {
			const data = {
				cartItems,
				shippingWeight,
				zipCode: (shippingInformation as ShippingInformation)?.address.zipCode,
			};

			try {
				const res = await axios.post("/api/shipping-rate", data);
				if (res.data.rate) {
					dispatch({
						type: "UPDATE_SHIPPING_COST",
						payload: res.data.rate,
					});
					cookies.set("shippingCost", JSON.stringify(res.data.rate), {
						path: "/",
					});
					setShippingRate(res.data.rate);
				} else {
					console.error(res.data.error);
				}
			} catch (error) {
				console.error("Error fetching shipping rates", error);
			}
		};

		if ((shippingInformation as ShippingInformation)?.address.zipCode) {
			getShippingRates();
		}
	}, [cartItems, shippingWeight, shippingInformation, dispatch]);

	return (
		<div className="s flex justify-between p-3">
			<h1 className="font-sans">USPS Priority Mail</h1>
			<p className="font-sans">
				{shippingRate ? `$${shippingRate}` : <ClipLoader />}
			</p>
		</div>
	);
};

export default ShippingCostCalculator;
