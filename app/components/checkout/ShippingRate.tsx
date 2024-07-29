import { useStateStorage } from "../../../utils/stateStorage";
//---Framework---//
import { useState, useEffect } from "react";
//---Packages---//
import ClipLoader from "react-spinners/ClipLoader";
import Cookies from "universal-cookie";
import { calculateShippingRate } from "../../../utils/calculateShippingRate";

const ShippingCostCalculator = ({
	postalCode,
	setShippingRate,
}: {
	postalCode: string;
	setShippingRate: (rate: number) => void;
}) => {
	const {
		state: {
			cart: { cartItems, shippingWeight },
		},
		dispatch,
	} = useStateStorage();

	const [localShippingRate, setLocalShippingRate] = useState<number | null>(
		null
	);
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
			const rate = await calculateShippingRate(
				postalCode,
				shippingWeight ?? 0,
				boxLength ?? 0,
				boxWidth ?? 0,
				boxHeight ?? 0
			);
			if (rate !== null) {
				dispatch({
					type: "UPDATE_SHIPPING_COST",
					payload: rate,
				});
				cookies.set("shippingCost", JSON.stringify(rate), {
					path: "/",
				});
				setLocalShippingRate(rate);
				if (typeof setShippingRate === "function") {
					setShippingRate(rate); // Call the callback to update the parent component's state
				}
			}
			setIsLoading(false);
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
		<div className="flex justify-between items-center">
			<span className="text-md text-gray-500">
				{isLoading ? (
					<ClipLoader />
				) : localShippingRate !== null ? (
					`$${localShippingRate}`
				) : (
					"$00.00"
				)}
			</span>
		</div>
	);
};

export default ShippingCostCalculator;
