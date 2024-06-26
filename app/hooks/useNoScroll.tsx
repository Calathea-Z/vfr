"use client";
import { useStateStorage } from "@/utils/stateStorage";
//---Framework---//
import { useEffect, FC } from "react";

interface UseNoScrollProps {
	isMobile: boolean;
}

const UseNoScroll: FC<UseNoScrollProps> = ({ isMobile }) => {
	const { state } = useStateStorage();
	const isCartVisible = state.isCartVisible;

	useEffect(() => {
		// Apply no-scroll only if the cart is visible and it's a mobile device
		if (isCartVisible && isMobile) {
			document.body.classList.add("no-scroll");
		} else {
			document.body.classList.remove("no-scroll");
		}

		// Cleanup function to ensure no-scroll is removed when not needed
		return () => {
			document.body.classList.remove("no-scroll");
		};
	}, [isCartVisible, isMobile]); // React to changes in isCartVisible and isMobile

	return null;
};

export default UseNoScroll;
