import { useStateStorage } from "../../../utils/stateStorage";
//---Framework---//
import { useState, useEffect } from "react";
//---Packages---//
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import Cookies from "universal-cookie";

const ShippingCostCalculator = ({ postalCode }: { postalCode: string }) => {
	const {
		state: {
			cart: { cartItems, shippingWeight },
		},
		dispatch,
	} = useStateStorage();

	const [shippingRate, setShippingRate] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [boxLength, setBoxLength] = useState<number | null>(null);
	const [boxWidth, setBoxWidth] = useState<number | null>(null);
	const [boxHeight, setBoxHeight] = useState<number | null>(null);

	const cookies = new Cookies();

	const pickBoxSize = (itemQuantity: number) => {
		if (itemQuantity <= 2) {
			setBoxLength(7);
			setBoxWidth(7);
			setBoxHeight(6);
		} else {
			setBoxLength(12);
			setBoxWidth(11);
			setBoxHeight(8);
		}
	};

	useEffect(() => {
		const totalQuantity = cartItems.reduce((accumulator, currentValue) => {
			return accumulator + currentValue.quantity;
		}, 0);
		pickBoxSize(totalQuantity);
	}, [cartItems]);

	useEffect(() => {
		const getShippingRates = async () => {
			setIsLoading(true);
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
			} finally {
				setIsLoading(false);
			}
		};

		if (postalCode && boxLength && boxWidth && boxHeight) {
			getShippingRates();
		}
	}, [
		cartItems,
		shippingWeight,
		postalCode,
		boxLength,
		boxWidth,
		boxHeight,
		dispatch,
	]);

	return (
		<div className="flex justify-start mr-2">
			<h1 className="font-sans text-bold mr-5 text-md text-gray-600">
				USPS Priority Mail
			</h1>
			<p className="text-md text-gray-500">
				{isLoading ? (
					<ClipLoader />
				) : shippingRate !== null ? (
					`$${shippingRate}`
				) : (
					"$ 00.00"
				)}
			</p>
		</div>
	);
};

export default ShippingCostCalculator;
