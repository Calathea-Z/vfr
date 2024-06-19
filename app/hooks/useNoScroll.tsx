"use client";
import { useEffect } from "react";
import { useStateStorage } from "@/utils/stateStorage";

const useNoScroll = () => {
	const { state } = useStateStorage();
	const isCartVisible = state.isCartVisible;

	useEffect(() => {
		if (isCartVisible) {
			document.body.classList.add("no-scroll");
		} else {
			document.body.classList.remove("no-scroll");
		}
	}, [isCartVisible]);
};

export default useNoScroll;
